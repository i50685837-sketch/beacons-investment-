const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();


// Middleware
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended:true
}));


// Serve frontend files (if using public folder)
app.use(express.static(path.join(__dirname, "public")));



// Test route
app.get("/", (req,res)=>{
    res.json({
        success:true,
        message:"🚀 Beacons API is running"
    });
});



// Routes

app.use("/api/auth", require("./routes/auth"));

app.use("/api/profile", require("./routes/profile"));

app.use("/api/payment", require("./routes/payment"));

app.use("/api/investment", require("./routes/investment"));

app.use("/api/admin", require("./routes/admin"));



// Error handler

app.use((err,req,res,next)=>{

    console.error(err.stack);

    res.status(500).json({

        success:false,
        message:"Server error"

    });

});



module.exports = app;
