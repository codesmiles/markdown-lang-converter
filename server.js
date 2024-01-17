const express = require("express");
const markdownIt = require("markdown-it");
const { Translate } = require("@google-cloud/translate").v2;

const app = express();
const translator = new Translate();
const md = new markdownIt();

// express-file-upload to receive incoming md file request
// fs module to save the file in a public folder,access the data in the files, create files for the translate files
// google translations for interpreting data
// package to return either all the response in text or in an md document downloadable format or as a link
// cloudinary in case it's lin that was requested
// tests for endpoint created
// readme doc for what's being done or what we're about to do

app.post("/convert", async (req, res) => {
  const markdownText = req.body.markdown;

  // Parse the Markdown text
  const html = md.render(markdownText);

  // Extract words from the HTML
  const words = extractWords(html);

  // Translate the words to English
  const translatedWords = await translateWords(words);

  // Replace the translated words in the HTML
  const translatedHtml = replaceWordsInHtml(html, words, translatedWords);

  res.send(translatedHtml);
});


function extractWords(text) {
  // Implement your logic to extract words from the text
  // For example, you can use regular expressions or language-specific libraries

  // Return an array of extracted words
  return [];
}

async function translateWords(words) {
  const [translations] = await translator.translate(words, "en");

  // Return an array of translated words
  return Array.isArray(translations) ? translations : [translations];
}

function replaceWordsInHtml(html, words, translatedWords) {
  // Implement your logic to replace the words in the HTML
  // For example, you can use string replacements or DOM manipulation libraries

  // Return the modified HTML
  return html;
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
