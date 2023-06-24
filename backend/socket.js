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

const createNewGame = (playerOneId, playerTwoId) => {
  return {
    playerOne: {
      userId: playerOneId,
      longestWord: 0,
      targetNumber: 0,
      matchingPairs: 0,
      quiz: 0,
      associations: 0,
      matermind: 0,
    },
    playerTwo: {
      userId: playerTwoId,
      longestWord: 0,
      targetNumber: 0,
      matchingPairs: 0,
      quiz: 0,
      associations: 0,
      matermind: 0,
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

    socket.on("updateGameState", async (data) => {
      console.log(data);
      let result = await client.get(data.gameId);
      let receiverSocketId;

      let gameState = JSON.parse(result);

      if (gameState.playerOne.userId === socket.userId) {
        receiverSocketId = getUser(gameState.playerTwo.userId);
        gameState.playerOne[data.gameName] = data.score;
      }

      if (gameState.playerTwo.userId === socket.userId) {
        receiverSocketId = getUser(gameState.playerOne.userId);
        gameState.playerTwo[data.gameName] = data.score;
      }

      await client.set(data.gameId, JSON.stringify(gameState));

      console.log(gameState);

      io.to(receiverSocketId).emit("gameUpdate", gameState);
    });
  });

  io.listen(5001);
}
