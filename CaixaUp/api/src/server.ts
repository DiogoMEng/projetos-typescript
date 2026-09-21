import { DB } from "./database/models/index.js";
import { PORT } from "./config";
import app from "./app.js";

const port = PORT || 3000;

DB.sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}.`);
    });
  })
  .catch((err: Error) => {
    console.error("Unable to connect to the database:", err);
  });
