const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3003;

app.use(cors());

app.get("/", (req, res, next) => {
    res.send("Hi from shipping");
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
