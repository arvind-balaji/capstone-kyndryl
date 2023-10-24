// import { OpenAI } from "langchain/llms/openai";
// import { ChatOpenAI } from "langchain/chat_models/openai";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
// import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import dotenv from 'dotenv';
import fs from 'fs';

// const dotenv = require('dotenv');
const result = dotenv.config({ path: '.env.local' });

if (result.error) {
  throw result.error;
}
// const apiKey = process.env.OPENAI_API_KEY;
const loader = new DirectoryLoader(
  "src/",
  {
    ".json": (path) => new JSONLoader(path, "/texts"),
    ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
    ".txt": (path) => new TextLoader(path),
    ".csv": (path) => new CSVLoader(path, "text"),
    // ".docx": (path) => new DocxLoader(path, "testdocx"),
  }
);
const docs = await loader.load();
console.log({ docs });
/* TO-DO:
Get chunkSize fromthe frontend client side
*/
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 20,
  chunkOverlap: 0,
});

const splitDocs = await textSplitter.splitDocuments(docs);
// TO-DO: replace FILE_NAME_FROM_FRONTEND once pipeline is supported
for (let i = 0; i < splitDocs.length; i++) {
  splitDocs[i].metadata.file_name = "FILE_NAME_FROM_FRONTEND";
  line_from = splitDocs[i].metadata.loc.lines.from
  line_to = splitDocs[i].metadata.loc.lines.to
}

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

const client = createClient(url, privateKey);

const store = new SupabaseVectorStore(embeddings, {
  client,
  tableName: "documents",
});
await store.addDocuments(splitDocs);