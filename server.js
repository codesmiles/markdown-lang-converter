require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const axios = require('axios');

const fs = require("fs");

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
app.post("/detect", async (req, res) => {
  const encodedParams = new URLSearchParams();
  encodedParams.set("q", "English is hard, but detectably so");

  const options = {
    method: "POST",
    url: "https://google-translate1.p.rapidapi.com/language/translate/v2/detect",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "Accept-Encoding": "application/gzip",
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
    },
    data: encodedParams,
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
});

app.get("/languages", async (req, res) => {
  const options = {
    method: "GET",
    url: "https://google-translate1.p.rapidapi.com/language/translate/v2/languages",
    headers: {
      "Accept-Encoding": "application/gzip",
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
})


app.post("/upload", async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ msg: "No files were uploaded." });
  }

  const uploadedFile = req.files.file;
  const from = await req.body.from;
  const to = await req.body.to;


  // Read the contents of the uploaded file
  fs.readFile(uploadedFile.tempFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "An error occurred while reading the file" });
    }

    const fileContents = data.split("\n").join(" ");

    // fileContents.forEach((e) => {});

    // ------------------translate api --------------
    const encodedParams = new URLSearchParams();
    encodedParams.set("q", fileContents);
    encodedParams.set("target", to);
    encodedParams.set("source", from);

    const options = {
      method: "POST",
      url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "application/gzip",
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
      },
      data: encodedParams,
    };

    try {
      const response = axios.request(options);
      console.log(response.data);

          return res.status(200).json({
            successful: true,
            message: "File uploaded and processed successfully",
            content: fileContents,
          });
    } catch (error) {
      console.error(error);
    }
    // ------------------ end translate api -------


  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
