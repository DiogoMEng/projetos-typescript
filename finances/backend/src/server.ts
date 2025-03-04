import app from "./app";
import "dotenv"

app.listen(process.env.PORT, () => {
    const date = new Date();
    console.log("server running.\n" + date);
  });