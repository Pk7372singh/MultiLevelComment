require("dotenv").config(); 

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const db = require("./config/db"); 

const app = express();

app.use(cors());
app.use(express.json());

app.use( require("./routes/commentRoutes"));
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await db(); 
    console.log(`Server running on port ${PORT} and connected to DB`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});
