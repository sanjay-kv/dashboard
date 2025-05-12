import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

//Env variable config
dotenv.config({
	path: "./.env",
});

connectDB()
	.then(() => {
		app.listen(process.env.PORT || 8000, () => {
			console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
		});
	})
	.catch((err) => {
		console.log("MONGO db connection failed !!! ", err);
	});
