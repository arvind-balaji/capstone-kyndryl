"use client";

import { useRef, useState, ReactElement, cache, useEffect } from "react";
import type { FormEvent } from "react";
import { UploadDocumentsForm } from "@/components/UploadDocumentsForm";
import { URLUploadButton } from "@/components/URLUploadButton";
import { GetServerSideProps } from "next";
import { createClient } from "@supabase/supabase-js";


export const getFiles = cache(async () => {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_KEY!,
  );
  const {data} = await client
  .from("documents")
  .select()

  console.log(data)

  return data
})
 
export default function AgentsPage() {
  const [showFile, setShowFile] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [files, setFiles] = useState([]);

  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_KEY!,
  );
 
  useEffect(() => {
    client
    .from("unique_filenames")
    .select("filename")
    .neq("filename", null)
    .then(({data}) => setFiles(data as []))
  }, [])


  const deleteByFilename = (filename: string) => {
    client
    .from("documents")
    .delete()
    .eq('metadata->>filename', filename)
    .then(({data}) => console.log({data})).then(() => window.location.reload())
  }
  
  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl">📄 Document Portal</h1>
    </div>
  );

  // useEffect(() => {getFiles().then(data => console.log(data)).catch(err => console.log(err))}, [])
  console.log(files)
  console.log(files.reduce((acc, val) => ({...acc, [val.id]: (acc[val.id]??0) + 1}), {}))
  return (
    <div className="flex flex-col gap-4">
      {InfoCard}
      <div className="p-4 md:p-8 rounded bg-[#17141c] w-full max-h-[85%] overflow-hidden">
        <h2 className="text-2xl md:text-2xl">⬆️ Upload Documents </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4 justify-center items-center">
            <button
              className={`shrink-0 p-1 ${
                showFile ? "bg-[#942c24]" : "bg-[#fb442c]"
              } rounded w-24`}
              onClick={() => {
                if (showUrl) setShowUrl(!showUrl);
                setShowFile(!showFile);
              }}
            >
              File
            </button>
            <button
              className={`shrink-0 p-1 ${
                showUrl ? "bg-[#942c24]" : "bg-[#fb442c]"
              } rounded w-24`}
              onClick={() => {
                setShowUrl(!showUrl);
                if (showFile) setShowFile(!showFile);
              }}
            >
              URL
            </button>
          </div>
          {(showFile || showUrl) && (
            <>
              {showFile && <UploadDocumentsForm />}
              {showUrl && <URLUploadButton />}
            </>
          )}
        </div>
      </div>
      <div className="p-4 md:p-8 rounded bg-[#17141c] w-full max-h-[85%] overflow-hidden">
        <h2 className="text-2xl md:text-2xl">🗑️ Delete Documents</h2>
        {/* {[...]} */}
        <table className="table-fixed">
  <thead>
    <tr>
      <th className="text-left m-2">File</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {files.map(f => (<tr key={f.filename}className="m-4">
      <td>{f.filename}</td>
      <td className="px-2">
        <button className={`shrink-0 p-1 bg-[#fb442c] rounded `} onClick={() => deleteByFilename(f.filename)}>
          Delete
        </button>
      </td>
    </tr>))}
  </tbody>
</table>
      </div>
    </div>
  );
}
