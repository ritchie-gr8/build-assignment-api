import connectionPool from "../utils/db.mjs";

export const createAssignment = async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({
      message:
        "Server could not create assignment because missing required fields",
    });
  }

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
        return res.status(500).json({
          message: "Internal server error",
        });
    }
  }
};

export const getAssignments = async (req, res) => {
  try {
    const result = await connectionPool.query(
      "SELECT * FROM assignments ORDER BY assignment_id"
    );

    return res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return res.status(500).json({
      message: "Server could not read assignment because database connection",
    });
  }
};

export const getAssignmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await connectionPool.query(
      "SELECT * FROM assignments WHERE assignment_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Server could not find a requested assignment" });
    }

    return res.status(200).json({
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching assignment by ID:", error);
    return res.status(500).json({
      message: "Server could not read assignment because database connection",
    });
  }
};

export const updateAssignment = async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;

  try {
    const existingAssignment = await connectionPool.query(
      "SELECT * FROM assignments WHERE assignment_id = $1",
      [id]
    );

    if (existingAssignment.rows.length === 0) {
      return res.status(404).json({
        message: "Server could not find a requested assignment to update",
      });
    }

    const updatedTitle = title || existingAssignment.rows[0].title;
    const updatedContent = content || existingAssignment.rows[0].content;
    const updatedCategory = category || existingAssignment.rows[0].category;

    const result = await connectionPool.query(
      "UPDATE assignments SET title = $1, content = $2, category = $3, updated_at = NOW() WHERE assignment_id = $4",
      [updatedTitle, updatedContent, updatedCategory, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Server could not find a requested assignment to update",
      });
    }

    return res.status(200).json({ message: "Updated assignment sucessfully" });
  } catch (error) {
    console.error("Error updating assignment:", error);
    return res.status(500).json({
      message: "Server could not update assignment because database connection",
    });
  }
};

export const deleteAssignment = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await connectionPool.query(
      "DELETE FROM assignments WHERE assignment_id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Server could not find a requested assignment to delete",
      });
    }

    return res.status(200).json({ message: "Deleted assignment sucessfully" });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return res
      .status(500)
      .json({
        message:
          "Server could not delete assignment because database connection",
      });
  }
};
