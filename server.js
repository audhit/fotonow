const path = require("path");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const moment = require("moment");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const app = express();

// This middleware is used to enable Cross Origin Resource Sharing This sets Headers to allow access to our client application
app.use(cors());

// Storage Engine That Tells/Configures Multer for where (destination) and how (filename) to save/upload our files
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images"); //important this is a direct path fron our current file to storage location
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + '__' + moment() + "." + file.originalname.split('.')[1]);
    },
});

// Route To Load Index.html page to browser
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// The Multer Middleware that is passed to routes that will receive income requests with file data (multipart/formdata)
// You can create multiple middleware each with a different storage engine config so save different files in different locations on server
const upload = multer({ storage: fileStorageEngine });

// Single File Route Handler
app.post("/single", upload.single("image"), (req, res) => {
    const fileUploadTimestamp = req.file.filename.split('__')[1].split('.')[0]; // Extract the timestamp from filename
    const fileUploadExactTime = moment().format("DD-MM-YYYY_HH:mm:ss"); // Convert the date and time into Human Readable Format
    req.file.fileUploadExactTime = fileUploadExactTime; // add the file upload data/time as meta info.
    fs.writeFileSync('./image_metainfos/' + req.file.filename.split('.')[0] + '.json', JSON.stringify(req.file, null, 2), 'utf-8'); // Save image file metainfo in server instead of DB(later todo)
    res.send("Single FIle upload success");
});


app.listen(5000);