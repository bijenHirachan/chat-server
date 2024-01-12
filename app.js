import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const PORT = 3000;

const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );

const server = createServer(app);

const io = new Server(server, {
  cors: {
    // origin: "http://localhost:5173",
    origin: "https://socketiochatter.netlify.app/",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// app.get("/", (req, res) => {
//   res.send("Hello world");
// });

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("join-room", ({ name, room }) => {
    socket.join(room);

    console.log(`User ${name} has joined ${room} room`);
    console.log(name, room);
    socket.emit("you-entered", `You have joined ${room}`);
    socket.broadcast.emit("user-entered", `${name} has joined ${room}`);
  });

  socket.on("message", ({ name, room, message }) => {
    socket.to(room).emit("receive-message", { name, message });
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
