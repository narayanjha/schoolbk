const express = require("express");
const app = express();
const port = 9000;
const cors = require("cors");
const { default: mongoose } = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/schooldb")
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

//user api routes
const userRoutes = require("./routes/userRoute");
app.use(cors());
app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
