import app from './app';

app.listen("3000", () => {
    const date = new Date();
    console.log("server running.\n" + date);
  });