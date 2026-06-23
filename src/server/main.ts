import express, { type Express } from "express";
import cors from "cors";
import { createUdfRouter } from "./lib/dataFeed/udfRouter";
import { YahooFinanceProvider } from "./lib/dataFeed/providers/YahooFinanceProvider";
import { NotesController } from "./controller/notes.controller";
import { NewsController } from "./controller/news.controller";
import { AdminController } from "./controller/admin.controller";

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

const app: Express = express();
const dataFeedProvider = new YahooFinanceProvider();

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());
app.use("/api/admin", AdminController.router);
app.use("/api/news", NewsController.router);
app.use("/api/notes", NotesController.router);
app.use("/api/udf", createUdfRouter(dataFeedProvider));

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
