const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRouter");
const itemRoutes = require("./routes/itemRouter");
const orderRoutes = require("./routes/orderRouter");
const paymentRoutes = require("./routes/paymentRouter");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/Images", express.static("./Images"));

app.use("/api", userRoutes);
app.use("/api", itemRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);


 
mongoose
  .connect(process.env.dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(process.env.PORT || 4000, () => console.log(`Server running on http://localhost:${process.env.PORT || 4000}`))
  )
  .catch((err) => err);
