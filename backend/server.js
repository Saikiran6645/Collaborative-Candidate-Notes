const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const userRoutes = require("./routes/user");
const candidateRoutes = require("./routes/candidate");
const notesRoutes = require("./routes/notes");
const authMiddleware = require("./middleware/auth");
const Note = require("./models/Note");
const Notification = require("./models/Notification");
const notificationroutes = require("./routes/notification");
const User = require("./models/User");
const cookieParser = require("cookie-parser");
const { errorMiddleware } = require("./middleware/error");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/collab-notes";

mongoose.connect(MONGO_URI).then(() => console.log("MongoDB connected"));

app.use(
  cors({
    origin: "https://collaborative-candidate-notes-1.onrender.com/", // frontend URL
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/candidate", authMiddleware, candidateRoutes);
app.use("/api/notes", authMiddleware, notesRoutes);
app.use("/api/notifications", authMiddleware, notificationroutes);
app.use(errorMiddleware);
// --- Socket.io Real-Time ---
const onlineUsers = {};

io.on("connection", (socket) => {
  // Join candidate room
  socket.on("joinRoom", ({ candidateId, userId }) => {
    socket.join(candidateId);
    onlineUsers[userId] = socket.id;
  });

  // Handle new note
  socket.on("newNote", async (data) => {
    const savedNote = await Note.create(data);

    // Send new note to candidate room
    io.to(data.candidateId).emit("receiveNote", savedNote);
    const userName = await User.findById({
      _id: data.userId,
    });
    // For each tagged user, create and emit notification
    for (const taggedUserId of data.taggedUsers) {
      const notification = await Notification.create({
        senderId: data.userId,
        recipientId: taggedUserId,
        candidateId: data.candidateId,
        noteId: savedNote._id,
        message: data.message,
        userName: userName.name,
        createdAt: new Date(),
      });
      // console.log("Notification created:", notification);
      if (onlineUsers[taggedUserId]) {
        io.to(onlineUsers[taggedUserId]).emit("notification", notification);
      }
    }
  });
  // Handle disconnect
  socket.on("disconnect", () => {
    for (let [id, sockId] of Object.entries(onlineUsers)) {
      if (sockId === socket.id) delete onlineUsers[id];
    }
  });
});

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
