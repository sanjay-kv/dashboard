import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";

const app = express();

app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	})
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

import pullRouter from "./routes/pulls.route.js";

app.get("/", (req, res) => {
	res.send('Server is running');
});

app.use("/api/v1/pull", pullRouter);

export default app;
