const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();
const PORT = 3000;

app.use(cors());
app.use("/customer", proxy("http://localhost:3001"));
app.use("/shopping", proxy("http://localhost:3003"));
app.use("/", proxy("http://localhost:3002"));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
