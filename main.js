import * as dotenv from "dotenv";
dotenv.config();
import { ChatGPTAPI } from "chatgpt";
import wtf from "wtf_wikipedia";

function parseSection(section) {
  const sectionTitle = section.title || "Intro";
  if (["See also", "Notes", "External links"].includes(sectionTitle)) {
    return;
  }
  console.log(`\nSection: ${sectionTitle}`);
  section.paragraphs?.forEach((paragraph) => {
    logParagraph(paragraph);
  });
}

function logParagraph({ sentences }) {
  const content = sentences?.map((sentence) => sentence.text).join(" ");
  console.log(content);
}

async function parseDoc() {
  let doc = await wtf.fetch("Mill Creek Park");
  const docJSON = doc.json();
  docJSON.sections.forEach(parseSection);
}

parseDoc().catch((err) => {
  console.error(err);
  process.exit(1);
});
