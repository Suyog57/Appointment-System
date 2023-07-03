const express = require("express");
const colors = require("colors");
const moragan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();
const cors=require("cors");
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(moragan("dev"));

app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));
app.use("/api/v1/payment", require("./routes/paymentRoute"));

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(
      `Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
        .bgCyan.white
    );
  });