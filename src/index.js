
const express = require("express");
const cors = require("cors");

const route = require("./route/route");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", route);

app.listen(5000, () => {
  console.log("Running at Port 5000");
});
