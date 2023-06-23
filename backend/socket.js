import { Server, Socket } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

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

    socket.on("disconnect", () => {
      removeUser(socket.id);
    });

    socket.on("sendInvite", (receiverId) => {
      const receiverSocketId = getUser(receiverId);
      const senderSocketId = getUser(socket.userId);

      if (!senderSocketId) return;

      //   let gameInfo = {
      //     playerOne: {
      //       userId: 0,
      //       userName: "",
      //       image: "",
      //       scores: {
      //         longestWord: 0,
      //         targetNumber: 0,
      //         matchingPairs: 0,
      //         quiz: 0,
      //         associations: 0,
      //         matermind: 0,
      //       },
      //     },
      //     playerTwo: {
      //       userId: 0,
      //       userName: "",
      //       image: "",
      //       scores: {
      //         longestWord: 0,
      //         targetNumber: 0,
      //         matchingPairs: 0,
      //         quiz: 0,
      //         associations: 0,
      //         matermind: 0,
      //       },
      //     },
      //   };
    });
  });

  io.listen(5001);
}
