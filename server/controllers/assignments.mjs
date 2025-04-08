import connectionPool from "../utils/db.mjs";

export const createAssignment = async (req, res) => {
  const { title, content, category } = req.body;

  try {
    const result = await connectionPool.query(
      `INSERT INTO assignments 
      (title, content, category, created_at, updated_at, published_at) 
      VALUES ($1, $2, $3, NOW(), NOW(), NOW()) RETURNING assignment_id`,
      [title, content, category]
    );

    const assignmentId = result.rows[0].assignment_id;
    if (!assignmentId) {
      throw new Error("Failed to create assignment");
    }

    return res.status(201).json({
      message: "Created assignment sucessfully",
    });
  } catch (error) {
    console.error("Error creating assignment:", error);
    switch (error.code) {
      case "3D000":
      case "ECONNREFUSED":
        return res.status(500).json({
          message:
            "Server could not create assignment because database connection",
        });
      default:
        return res.status(500).json({ message: "Internal server error" });
    }
  }
};
