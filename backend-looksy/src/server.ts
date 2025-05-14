import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 1000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error: any) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
