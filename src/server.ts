import express from "express";
import path from "path";
import cors from "cors";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import { mongoConnect } from "./database/mongo";
import apiRoutes from "./routes/api";

dotenv.config();
mongoConnect();
const server = express();

server.use(cors());
server.use(express.static(path.join(__dirname, "../public")));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(fileUpload());

server.use("/", apiRoutes);

server.listen(process.env.PORT);
