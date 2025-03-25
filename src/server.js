// Imports
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer")

// Express Variables
const app = express();
const port = 8080;

// Multer Variables
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadPath = path.join(__dirname, "public", "media"); // Save to src/media
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname); // Prevent filename collisions
        }
    })
});


// Express Settings
app.set("view engine", "ejs");
app.use(express.static("public")); // Serve static files correctly
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Debug Page
app.get("/debug", (req, res) => {
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    res.send(`Port: ${port}\nURL/IP: ${url}`);
});

// Root Page
app.get("/", (req, res) => {
    res.render("index");
});

// Player Page
app.get("/player", (req, res) => {
    fs.readFile(path.join(__dirname, "public", "song-index.json"), "utf8", (err, data) => {
        if (err) {
            console.error("Error reading song index:", err);
            return res.status(500).send("Error loading songs");
        }
        const songs = JSON.parse(data);
        res.render("player", { songs });
    });
});

// Upload Page
app.get("/upload", (req, res) => {
    res.render("upload");
})

// Upload API
const jsonFilePath = path.join(__dirname, "public", "song-index.json");

app.post("/upload-api", upload.single('file_field'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    const songName = req.body.name_field || "Unknown Song";
    const songAuthor = req.body.author_field || "Unknown Artist";
    const fileName = req.file.filename;
    const filePath = `/media/${fileName}`;
    const dateUploaded = new Date().toLocaleDateString();

    // Read existing song index
    fs.readFile(jsonFilePath, "utf8", (err, data) => {
        let songIndex = {};
        if (!err && data) {
            try {
                songIndex = JSON.parse(data);
            } catch (parseErr) {
                console.error("Error parsing song-index.json:", parseErr);
            }
        }

        // Add new song entry
        songIndex[songName] = {
            mp3: filePath,
            author: songAuthor,
            "date-uploaded": dateUploaded
        };

        // Write updated JSON back to file
        fs.writeFile(jsonFilePath, JSON.stringify(songIndex, null, 4), "utf8", (writeErr) => {
            if (writeErr) {
                console.error("Error writing to song-index.json:", writeErr);
                return res.status(500).json({ error: "Failed to save song metadata." });
            }
            res.json({
                message: "File uploaded and song-index updated successfully.",
                file: req.file,
                songName,
                songAuthor
            });
        });
    });
});

// Server Start
app.listen(port, () => {
    console.log(`Server started on port ${port} successfully!`)
});
