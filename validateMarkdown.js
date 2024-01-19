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
      const markdownContent = `Your Markdown content here`;

const MAX_LINE_LENGTH = 80; // Specify the maximum line length you want to enforce

// Split the Markdown content into an array of lines
const lines = markdownContent.split('\n');

// Iterate through each line and check if it exceeds the maximum line length
const modifiedLines = lines.map((line) => {
  if (line.length > MAX_LINE_LENGTH) {
    // If the line exceeds the maximum length, truncate it or break it into multiple lines
    // based on your desired logic
    return line.substring(0, MAX_LINE_LENGTH);
  }
  return line;
});

// Join the modified lines back into a single string
const modifiedMarkdownContent = modifiedLines.join('\n');

// Use the modifiedMarkdownContent as needed
console.log(modifiedMarkdownContent);
      return res.status(400).json(result[file.name]);
    }

    // Markdown file is valid
    next();
  });
};

