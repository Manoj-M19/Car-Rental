import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js"
import userRouter from "./routes/userRouter.js";
import ownerRouter from "./routes/ownerRoute.js";

const app = express()

await connectDB()

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=> res.send("Server is running"))
app.use('/api/user',userRouter)
app.use('/api/owner',ownerRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=> console.log(`Server running on port ${PORT}`))