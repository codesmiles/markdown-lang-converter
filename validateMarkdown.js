const markdownlint = require("markdownlint");

module.exports.validateMarkdown = async(req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ msg: "No files were uploaded." });
  }
  
  const file = req.files.file;
  
  // Read the file content
  const content = file.data.toString();
 
  // Define the markdownlint options
  const options = {
    files: [file.name],
    strings: {
      [file.name]: content,
    },
  };


  // Run markdownlint
  markdownlint(options, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (result[file.name].length > 0) {
      // Markdown file has linting errors
      
      return res.status(400).json(result[file.name]);
    }

    // Markdown file is valid
    next();
  });
};

