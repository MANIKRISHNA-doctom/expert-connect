import http from "http";
import mongoose from "mongoose";
import app from "./app.js";
import { initSocket } from "../sockets/socket.js";
import dotenv from "dotenv";
dotenv.config();

// Connect Database
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB connected"))
.catch(err=> console.log(err));

// Create server
const server = http.createServer(app);

// Socket setup
initSocket(server);

const port = process.env.port || 5000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});