// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString:
    "postgresql://admin:admin@localhost:5432/lms",
});

connectionPool.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err.code);
  } else {
    console.log("Connected to database");
  }
});

export default connectionPool;
