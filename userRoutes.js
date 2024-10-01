import express from "express";
const router = express.Router();
import { db } from "./db_connection.js";

router.get("/", (req, res) => {
  const { user_name, user_role } = req.query;

  if (user_name) {
    const q = "SELECT * FROM user WHERE user_name = ?";
    db.query(q, [user_name], (err, data) => {
      if (err) throw err;
      return res.json(data);
    });
  } else if (user_role) {
    const q = "SELECT * FROM user WHERE user_role = ?";
    db.query(q, [user_role], (err, data) => {
      if (err) throw err;
      return res.json(data);
    });
  } else {
    const q = "SELECT * FROM user";
    db.query(q, [user_role], (err, data) => {
      if (err) throw err;
      return res.json(data);
    });
  }
});

router.get("/:id", (req, res) => {
  const userId = req.params.id;
  const q = "SELECT * FROM user WHERE user_id = ?";
  db.query(q, [userId], (err, data) => {
    if (err) throw err;
    console.log(err);
    return res.json(data);
  });
});

router.post("/", (req, res) => {
  const { userId, name, email, password, role } = req.body;

  const q =
    "INSERT INTO user(`user_id`, `user_name`, `user_password`, `user_email`, `user_role`, `isActive`) VALUES (?, ?, ?, ?, ?, 1)";

  db.query(q, [userId, name, password, email, role], (err, data) => {
    if (err) throw err;
    return res.json("User has been created successfully");
  });
});

router.delete("/:id", (req, res) => {
  const userId = req.params.id;
  const q = "DELETE FROM user WHERE user_id = ?";

  db.query(q, [userId], (err, data) => {
    if (err) throw err;
    return res.json("User has been deleted successfully");
  });
});

router.put("/:id", (req, res) => {
  const user_id = req.params.id;
  const fieldMapping = {
    userName: "user_name",
    userEmail: "user_email",
    userPassword: "user_password",
    userRole: "user_role",
    isActive: "isActive"
  };

  // Filter and map the fields that are not undefined
  const updates = Object.entries(req.body)
    .filter(([key, value]) => value !== undefined && fieldMapping[key]) // Ensure the field is mappable
    .map(([key, value]) => ({
      field: fieldMapping[key], // Use the database field name
      value: value,
    }));

  if (updates.length === 0) {
    return res
      .status(400)
      .json({ error: "No valid fields provided for update." });
  }

  // Construct the SQL update clause
  const updateFields = updates.map((u) => `${u.field} = ?`).join(", ");
  const values = updates.map((u) => u.value);

  // Add the user ID at the end of the values array for the WHERE clause
  values.push(user_id);

  const query = `UPDATE user SET ${updateFields} WHERE user_id = ?`;

  // Execute the query
  db.query(query, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json("User has been updated successfully");
  });
});

export default router;
