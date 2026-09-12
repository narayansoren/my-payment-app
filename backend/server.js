import "dotenv/config";
import app from "./src/app.js";

import connectDB from "./src/common/config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on  http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Error starting server:", err);
  process.exit(1);
});
