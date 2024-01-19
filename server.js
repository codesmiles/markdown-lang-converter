const express = require("express");
const fileUpload = require("express-fileupload");
// const markdownIt = require("markdown-it");
const { validateMarkdown } = require("./validateMarkdown");
// import { Translate } from ("@google-cloud/translate").v2;


const app = express();
app.use(
  express.urlencoded({ extended: true }),
  express.json({ limit: "100mb" })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 }, // cant accept images more than 50mb
    abortOnLimit: true,
    responseOnLimit: "File size limit has been reached",
  })
);

app.post("/upload", validateMarkdown, (req, res) => {
 
  // Access the uploaded file
   const file = req.files.file;
  // res.send(file)
  
   // Use the file as needed (e.g., save it to a specific location)
  //  file.mv(`uploads/${file.name}`, (err) => {
  //    if (err) {
  //      return res.status(500).send(err);
  //    }

  //    res.send("File uploaded successfully.");
  //  });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
