import express from "express";
import cors from "cors";
import router from "./routes/index.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", router);

app.listen(3000, "0.0.0.0", () => {
  console.log("Backend running on port 3000");
});