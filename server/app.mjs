import express from "express";
import { createAssignment, deleteAssignment, getAssignmentById, getAssignments, updateAssignment } from "./controllers/assignments.mjs";

const app = express();
const port = 4001;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.get("/assignments", getAssignments);
app.get("/assignments/:id", getAssignmentById);
app.post("/assignments", createAssignment);
app.put("/assignments/:id", updateAssignment);
app.delete("/assignments/:id", deleteAssignment);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
