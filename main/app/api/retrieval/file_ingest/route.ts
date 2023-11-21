import { NextRequest, NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { SRTLoader } from "langchain/document_loaders/fs/srt";
// import {writeFile} from 'fs'

export const runtime = "nodejs";

// export const config = {
//   api: {
//     bodyParser: false,
//   }
// };

// Before running, follow set-up instructions at
// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/supabase

/**
 * This handler takes input text, splits it into chunks, and embeds those chunks
 * into a vector store for later retrieval. See the following docs for more information:
 *
 * https://js.langchain.com/docs/modules/data_connection/document_transformers/text_splitters/recursive_text_splitter
 * https://js.langchain.com/docs/modules/data_connection/vectorstores/integrations/supabase
 */
export async function POST(req: NextRequest) {
  // const body = await req.json();
  // const text = body.text;


  try {
    const formData = await req.formData();
    console.log(formData)

    const file: File | null = formData.get('file') as unknown as File
    console.log(file)
    if (file) {
      const blob = new Blob([await file.arrayBuffer()], { type: file.type })
      console.log(blob)
      const loader = (() => {
        if (file.type === 'application/pdf')
          return new PDFLoader(blob);
        else if (file.type === 'text/plain')
          return new TextLoader(blob)
        else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
          return new DocxLoader(blob)
        else if (file.type === 'application/json')
          return new JSONLoader(blob)
        else if (file.type === 'application/x-subrip')
          return new SRTLoader(blob)
      })();
      if (!loader)
        return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
      const docs = await loader.load();

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 256,
        chunkOverlap: 20,
      });

      const splitDocs = (await textSplitter.splitDocuments(docs)).map((doc: any) => ({...doc, metadata: {
        ...doc.metadata,
        filename: file.name
      }}))

      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      });

      const client = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_PRIVATE_KEY!,
      );


      const vectorstore = await SupabaseVectorStore.fromDocuments(
        splitDocs,
        embeddings,
        {
          client,
          tableName: "documents",
          queryName: "match_documents",
        },
      );

      // console.log(docs)
    }


    // await writeFile("~/Documents/foo.pdf", Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }

}
