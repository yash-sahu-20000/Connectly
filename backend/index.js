import express from "express";
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.js'
import messageRoutes from './src/routes/message.js'
import { connectDatabase } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { server, app } from "./src/lib/socket.js";


dotenv.config();
app.use(express.json({ limit: '50mb' })); // Adjust size limit as needed

// app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
const PORT = process.env.PORT
server.listen(PORT, ()=> { 
    console.log("listening on PORT: " + PORT);
    connectDatabase()
});

app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes);