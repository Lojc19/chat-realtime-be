const express = require('express');
const dotenv = require("dotenv")
const app = express();
const cookieParser = require("cookie-parser");

const db = require('./src/config/db/connect');
const { errorHandler, notFound } = require('./src/app/middlewares/errorHandler');

// const { app, server } = require("./socket/socket.js");


const authRouter = require('./src/app/routes/auth.route');
const messageRouter = require('./src/app/routes/message.route');
const userRouter = require('./src/app/routes/user.route');

dotenv.config();
const port = process.env.PORT || 4000

db.connect()

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);
app.use("/api/users", userRouter);
// app.use("/", (req,res) => {
// });

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening at Port: ${port}`)
})