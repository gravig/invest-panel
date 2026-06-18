import express, { type Express } from "express";

const main = () => {
  const app: Express = express();

  app.get("/api/hello", (_req, res) => {
    res.json({ message: "Hello from the server!" });
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

main();
