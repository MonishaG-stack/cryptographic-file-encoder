const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const { execFile } = require("child_process");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const upload = multer({ dest: "uploads/" });

app.post("/process", upload.single("file"), (req, res) => {
    const mode = req.body.mode;
    const key = req.body.key;

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const inputPath = req.file.path;
    const originalName = req.file.originalname;
    const outputFileName =
        mode === "encrypt" ? `encrypted_${originalName}` : `decrypted_${originalName}`;
    const outputPath = path.join("outputs", outputFileName);

    execFile(
        path.join(__dirname, "cpp", "encoder.exe"),
        [mode, inputPath, outputPath, key],
        (error, stdout, stderr) => {
            if (error) {
                return res.status(500).json({ error: "Processing failed", details: stderr });
            }

            res.json({
                message: "File processed successfully",
                download: `/download/${outputFileName}`
            });
        }
    );
});

app.get("/download/:filename", (req, res) => {
    const filePath = path.join(__dirname, "outputs", req.params.filename);
    res.download(filePath);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});