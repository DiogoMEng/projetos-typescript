import app from "./app";
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  const date = new Date();
  console.log("server running.\n" + date);
});