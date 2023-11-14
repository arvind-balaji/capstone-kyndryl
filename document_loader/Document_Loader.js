// import { OpenAI } from "langchain/llms/openai";
// import { ChatOpenAI } from "langchain/chat_models/openai";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
// import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import dotenv from 'dotenv';
import fs from 'fs';
import express from 'express';
import upload from './upload.js';
import cors from 'cors';
import path from 'path';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log("Before multer")
app.use(cors());

app.post('/uploads', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    document_loaders(req.body,req.file)
    res.status(200).send('File uploaded successfully.');
});

app.get('/' , (req, res) => {
  const filePath = path.resolve('index.html');
  return res.sendFile(filePath);
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export async function document_loaders(chunkS, file) {
  const result = dotenv.config({ path: '.env.local' });

  if (result.error) {
    throw result.error;
  }
  const { chunkSize } = chunkS;
  const chunkSize_ = +chunkSize;
  let docs;
  console.log(file);
  try{
    const loader = new PDFLoader(file.path);
    docs = await loader.load();
  } catch (e) {
    console.error('An error occurred on file Loader:', error.message);
  }
  
  const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: chunkSize_,
  chunkOverlap: 20,
  });

  const splitDocs = await textSplitter.splitDocuments(docs);
  // TO-DO: replace FILE_NAME_FROM_FRONTEND once pipeline is supported
  for (let i = 0; i < splitDocs.length; i++) {
  splitDocs[i].metadata.filename = file.filename;
  splitDocs[i].metadata.type = "file_upload";
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
  try {
    await store.addDocuments(splitDocs);
  } catch (err) {
    console.error("Error inserting documents, Error:", err);
  }
  finally {
    await fs.unlink(file.path, (err) => {
      if (err) {
        console.error(`Error deleting the file: ${err}`);
      } else {
        console.log(`The file ${file.path} has been deleted successfully.`);
      }
    });
  }
};
