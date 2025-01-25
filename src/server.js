const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const compression = require("compression");
require("dotenv").config();

const fileRoutes = require("./routes/fileRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(compression());

connectDB();

app.use("/api/files", fileRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
