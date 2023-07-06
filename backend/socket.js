import { Server, Socket } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import query from "./db.js";
import { Redis } from "ioredis";

const client = new Redis({
  host: "localhost",
  port: 6379,
});

let usersLookingForMatch = [];

const createNewGame = (playerOneId, playerTwoId) => {
  return {
    playerOne: {
      gamesPlayed: 0,
      userId: playerOneId,
      longestWord: 0,
      targetNumber: 0,
      matchingPairs: 0,
      quiz: 0,
      associations: 0,
      mastermind: 0,
    },
    playerTwo: {
      gamesPlayed: 0,
      userId: playerTwoId,
      longestWord: 0,
      targetNumber: 0,
      matchingPairs: 0,
      quiz: 0,
      associations: 0,
      mastermind: 0,
    },
  };
};

export default function setupSocket() {
  const server = http.createServer();

  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decodedToken.userId;
      next();
    } catch (error) {
      console.log(error);
    }
  });

  let users = new Map();

  const addUser = (userId, socketId) => {
    if (!users.has(userId)) {
      users.set(userId, socketId);
    }
  };

  const removeUser = (socketId) => {
    const userEntries = [...users.entries()];

    const usersEntriesFilterd = userEntries.filter(
      ([_, value]) => value !== socketId
    );

    users = new Map(usersEntriesFilterd);
  };

  const getUser = (userId) => {
    return users.get(userId);
  };

  io.on("connection", (socket) => {
    console.log("new socket connection", socket.userId);

    addUser(socket.userId, socket.id);

    socket.on("reconnectToRoom", (gameRoomId) => {
      const userSocketId = getUser(socket.userId);

      if (userSocketId) {
        const userSocket = io.sockets.sockets.get(userSocketId);

        userSocket.join(gameRoomId);
      }
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log("disconnected");
    });

    socket.on("findMatch", async () => {
      if (!usersLookingForMatch.includes(socket.userId)) {
        usersLookingForMatch.push(socket.userId);
      }

      if (usersLookingForMatch.length > 1) {
        const playerOneId = usersLookingForMatch[0];
        const playerTwoId = usersLookingForMatch[1];

        usersLookingForMatch = usersLookingForMatch.filter(
          (playerId) => playerId !== playerOneId && playerId !== playerTwoId
        );

        const playerOnesocketId = getUser(playerOneId);
        const playerTwoSocketId = getUser(playerTwoId);

        if (!playerOnesocketId || !playerTwoSocketId) return;

        const playerOneSocket = io.sockets.sockets.get(playerOnesocketId);
        const playerTwoSocket = io.sockets.sockets.get(playerTwoSocketId);

        if (playerOneSocket && playerTwoSocket) {
          let gameId = uuidv4();

          let q =
            "INSERT INTO games (`gameId`,`senderId`,`receiverId`) VALUES (?,?,?)";

          let data = await query(q, [gameId, playerOneId, playerTwoId]);

          playerOneSocket.join(gameId);
          playerTwoSocket.join(gameId);

          const gameState = createNewGame(playerOneId, playerTwoId);

          await client.set(gameId, JSON.stringify(gameState));

          io.to(gameId).emit("gameStart", gameId);
        }
      }
    });

    socket.on("cancelFindMatch", () => {
      usersLookingForMatch = usersLookingForMatch.filter(
        (userId) => userId !== socket.userId
      );
    });

    socket.on("sendInvite", async (receiverId) => {
      const receiverSocketId = getUser(receiverId);
      const senderSocketId = getUser(socket.userId);

      if (!senderSocketId) return;

      let q = "SELECT `userName` FROM users WHERE `userId`= ?";
      let userInfo = await query(q, [socket.userId]);

      let gameId = uuidv4();
      q = "INSERT INTO games (`gameId`,`senderId`,`receiverId`) VALUES (?,?,?)";
      let data = await query(q, [gameId, socket.userId, receiverId]);

      io.to(receiverSocketId).emit("gameInvite", userInfo[0].userName);
      io.to(senderSocketId).emit("gameInvitePending");
    });

    socket.on("acceptInvite", async () => {
      let q = "SELECT `gameId`,`senderId` FROM games WHERE `receiverId`= ?";
      let data = await query(q, [socket.userId]);
      let gameId = data[0].gameId;

      const receiverSocketId = getUser(socket.userId);
      const senderSocketId = getUser(data[0].senderId);

      if (!receiverSocketId || !senderSocketId) return;

      const senderSocket = io.sockets.sockets.get(senderSocketId);
      const receiverSocket = io.sockets.sockets.get(receiverSocketId);

      if (senderSocket && receiverSocket) {
        senderSocket.join(gameId);
        receiverSocket.join(gameId);

        const gameState = createNewGame(socket.userId, data[0].senderId);

        await client.set(gameId, JSON.stringify(gameState));

        io.to(gameId).emit("gameStart", gameId);
      }
    });

    socket.on("cancelInvite", async () => {
      if (!socket.userId) {
        console.log("User not authenticated");
        return;
      }
      let q =
        "SELECT `gameId` FROM games WHERE (`receiverId`= ? OR `senderId` = ?)";

      let data = await query(q, [socket.userId, socket.userId]);

      io.to(data[0].gameId).emit("inviteCanceled");
    });

    socket.on("updateGameState", async (data) => {
      console.log(data, "dataSocket");
      let result = await client.get(data.gameId);
      let receiverSocketId;
      let gameState = JSON.parse(result);
      const playerOne = gameState.playerOne;
      const playerTwo = gameState.playerTwo;

      console.log(gameState, "gameStateSocket");

      if (playerOne.userId === socket.userId) {
        receiverSocketId = getUser(playerTwo.userId);
        playerOne[data.gameName] = data.score;
        playerOne.gamesPlayed++;
      }

      if (playerTwo.userId === socket.userId) {
        receiverSocketId = getUser(playerOne.userId);
        playerTwo[data.gameName] = data.score;
        playerTwo.gamesPlayed++;
      }

      await client.set(data.gameId, JSON.stringify(gameState));
      io.to(receiverSocketId).emit("gameUpdate", gameState);

      if (playerOne.gamesPlayed === 6 && playerTwo.gamesPlayed === 6) {
        const {
          userId: playerOneId,
          gamesPlayed: playerOneGamesPlayed,
          ...playerOneScores
        } = playerOne;

        const playerOneTotalScore = Object.values(playerOneScores).reduce(
          (acc, score) => acc + score,
          0
        );

        const {
          userId: playerTwoId,
          gamesPlayed: playerTwoGamesPlayed,
          ...playerTwoScores
        } = playerTwo;

        const playerTwoTotalScore = Object.values(playerTwoScores).reduce(
          (sum, score) => sum + score,
          0
        );

        let winnerId;

        if (playerOneTotalScore > playerTwoTotalScore) {
          winnerId = playerOneId;
        }

        if (playerTwoTotalScore > playerOneTotalScore) {
          winnerId = playerTwoId;
        }

        if (playerOneTotalScore === playerTwoTotalScore) {
          winnerId = null;
        }

        io.to(data.gameId).emit("gameOver", {
          winnerId,
        });

        let q = "DELETE FROM games WHERE `gameId` = ?";

        await query(q, [data.gameId]);

        q =
          "INSERT INTO leaderboard (`userId`, `score`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `score` = `score` + ?";

        await query(q, [winnerId, 5, 5]);

        await client.del(playerOneId);
        await client.del(playerTwoId);
        await client.del(data.gameId);

        return;
      }
    });
  });

  io.listen(5001);
}
