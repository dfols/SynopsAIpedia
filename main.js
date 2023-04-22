import * as dotenv from "dotenv";
dotenv.config();
import { ChatGPTAPI } from "chatgpt";
import wtf from "wtf_wikipedia";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
  systemMessage:
    "Summarize the following content while never saying things such as the article, or this passage, etc. also if there are follow up questions being asked, you need to make sure you are not going to repeat any information unless it is critical for the summary",
  completionParams: {
    model: "gpt-3.5-turbo-0301",
  },
});

let contentChunks = [];
let currentChunk = "";

function addContent({ sentences }) {
  const content = sentences?.map((sentence) => sentence.text).join(" ");
  currentChunk += content;
}

function parseSection(section) {
  const sectionTitle = section.title || "Intro";
  if (["See also", "Notes", "External links"].includes(sectionTitle)) {
    return "";
  }
  section.paragraphs?.forEach((paragraph) => {
    addContent(paragraph);
  });
  if (currentChunk.length > 3000) {
    contentChunks.push(currentChunk);
    currentChunk = "";
  }
}

async function fetchArticle(articleTitle) {
  if (!articleTitle) {
    throw new Error("Please enter a valid Wikipedia article title");
  }
  const doc = await wtf.fetch(articleTitle);
  if (!doc) {
    throw new Error("Could not find article with that title");
  }
  return doc;
}

function parseSections(doc) {
  const docJSON = doc.json();
  docJSON.sections.forEach(parseSection);
  if (currentChunk.length > 0) {
    contentChunks.push(currentChunk);
  }
}

async function summarizeContent(contentChunks) {
  const summaries = await Promise.all(
    contentChunks.map(async (chunk) => {
      const res = await api.sendMessage(chunk);
      return res.text;
    })
  );
  return summaries.join("\n");
}

async function parseDoc() {
  rl.question("Enter a Wikipedia article title: ", async function (articleTitle) {
    try {
      const doc = await fetchArticle(articleTitle);
      parseSections(doc);
      rl.close();
      const summaries = await summarizeContent(contentChunks);
      console.log(summaries);
    } catch (error) {
      console.error(error.message);
    }
  });
}

parseDoc().catch((err) => {
  console.error(err);
  process.exit(1);
});
