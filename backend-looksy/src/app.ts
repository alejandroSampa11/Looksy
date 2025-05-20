import express from "express";
import cors from "cors";
import routes from "./routes";
import { connectDB } from "./config/db";
import { errorHandler } from './middleware/errorHandler';

process.on('uncaughtException', (error) => {
  console.error('⚠️ Uncaught exception', error.message);
  console.error(error.stack)
})

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);
app.use(errorHandler)

const PORT = process.env.PORT || 1000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    process.on('unhandledRejection', (error: any) => {
      console.error('⚠️ Uncaught exception', error.message);
      console.error(error.stack)
    })
  } catch (error: any) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer()


export default app;
