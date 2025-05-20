import express from "express";
import cors from "cors";
import routes from "./routes";
import { connectDB } from "./config/db";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

const PORT = process.env.PORT || 1000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error: any) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer()


export default app;
