import express from "express";
import { createAssignment } from "./controllers/assignments.mjs";

const app = express();
const port = 4001;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.post("/assignments", createAssignment);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
