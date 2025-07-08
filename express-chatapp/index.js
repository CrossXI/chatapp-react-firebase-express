const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.json());
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const imageUrl = `http://localhost:4000/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

app.post("/delete-image", (req, res) => {
  const { url } = req.body;
  const filePath = url?.split("/uploads/")[1];
  if (!filePath) return res.status(400).json({ error: "Invalid image path" });

  const fullPath = path.join(__dirname, "uploads", filePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error("Failed to delete image:", err);
      return res.status(500).json({ error: "Failed to delete image" });
    }
    res.json({ success: true });
  });
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
