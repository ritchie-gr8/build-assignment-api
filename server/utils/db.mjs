// Create PostgreSQL Connection Pool here !
import pg from "pg";
const { Pool } = pg;

const connectionPool = new Pool({
  connectionString:
    "postgresql://postgres:P@ssw0rd@localhost:5432/posts",
});

export default connectionPool;
