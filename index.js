const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const fs = require("fs");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "uploads/");
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + "-" + file.originalname);
//     },
// });

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    // fileFilter: fileFilter,
    // limits: {
    //     fileSize: 1024 * 1024 * 5
    // }
});

function fileFilter(req,file, cb) {
    const filetypes = /jpeg|jpg|png/;
    // const filetypes = /txt/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if(mimetype && extname) {
        return cb(null, true);
    } else{
        cb('Посилка: Файл має бути зображенням (jpg, jpeg, png)');
    }
}

app.post("/upload", upload.single("file"), (req, res) => {
    console.log(req.file);
    if(req.fileValidationError) {
        return res.send(req.fileValidationError);
    }
    const file = req.file.buffer.toString('utf-8');
    res.send(`<pre>${fileContent}</pre>`);
});

app.post('/upload-multiple', upload.array('files', 3), (req, res) => {
    console.log(req.files);
    if(req.fileValidationError) {
        return res.send(req.fileValidationError);
    }
    const uploadedFiles = req.files.map(f => f.originalname).join(', ').toString();
    res.send(`Files uploaded successfully! ${uploadedFiles}`);
});
app.post('/upload-metadata', upload.single('file'), (req, res) => {
    if(!req.file){
        return res.status(400).send('No file uploaded');
    }

    const metadata = {
        originalName: req.file.originalname,
        description: req.body.description,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
        uploadDate: new Date().toDateString()
    }
    fs.readFile('uploads/metadata.json', 'utf8', (err, data) => {
        const jsonData = data ? JSON.parse(data) : [];
        jsonData.push(metadata);
        fs.writeFile('uploads/metadata.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if(err) {
                console.error('Error writing metadata to file', err);
            }
            res.send('File uploaded and metadata saved successfully');
        });
    });


});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});