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
    'For each section provided, produce a clear and concise summary without referring to the source as "the article", "this passage", or any similar phrases. Ensure that the summary for each section is presented with the section title followed by a colon and a newline, then the summarized content. Add two newline characters between each summarized section. Avoid repeating information from previous sections unless it is critical for the summary.',
  completionParams: {
    model: "gpt-3.5-turbo-0301",
  },
});

let contentChunks = [];
let currentChunk = "";

function addContent({ sentences }, sectionTitle) {
  const content = sentences?.map((sentence) => sentence.text).join(" ");
  currentChunk += `Section: ${sectionTitle}\nContent: ${content}\n\n`;
}

function parseSection(section) {
  const sectionTitle = section.title || "Intro";
  if (
    ["See also", "Notes", "External links", "Further reading"].includes(
      sectionTitle
    )
  ) {
    return "";
  }
  section.paragraphs?.forEach((paragraph) => {
    addContent(paragraph, sectionTitle);
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
  const joinedSummaries = summaries
    .map((summary, index) => (index > 0 ? `\n\n${summary}` : summary))
    .join("");

  return joinedSummaries;
}

async function parseDoc() {
  rl.question(
    "Enter a Wikipedia article title: ",
    async function (articleTitle) {
      try {
        const doc = await fetchArticle(articleTitle);
        parseSections(doc);
        rl.close();
        const summaries = await summarizeContent(contentChunks);
        console.log(summaries);
      } catch (error) {
        console.error(error.message);
      }
    }
  );
}

parseDoc().catch((err) => {
  console.error(err);
  process.exit(1);
});
