import { NextRequest, NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HtmlToTextTransformer } from "langchain/document_transformers/html_to_text";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
      const formData = await req.formData();
  
      const url: URL | null = formData.get('url') as unknown as URL
      if (url) {
        const loader = new CheerioWebBaseLoader(url.toString());
        if (!loader)
          return NextResponse.json({ error: 'Unsupported URL' }, { status: 400 });
        const docs_ = await loader.load();
        const splitter = RecursiveCharacterTextSplitter.fromLanguage("html");
        const transformer = new HtmlToTextTransformer();

        const sequence = splitter.pipe(transformer);

        const docs = await sequence.invoke(docs_);

        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 512,
          chunkOverlap: 20,
        });
  
        const splitDocs = (await textSplitter.splitDocuments(docs))
        .map((doc: { pageContent: string; metadata: any; }) => ({
          pageContent: doc.pageContent, // Replace 'someTextProperty' with the actual property name containing the text
          metadata: {
            ...doc.metadata,
            filename: url
          }
        }));
  
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
  
      }
  
      return NextResponse.json({ ok: true }, { status: 200 });
    } catch (e: any) {
      console.error(e);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  
  }
  