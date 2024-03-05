
// mongodb://localhost:27017
const express = require("express");

const MainRouter = require("./routes/index")

const app = express();

app.use('/api/v1',MainRouter);




app.

app.listen(3333);
