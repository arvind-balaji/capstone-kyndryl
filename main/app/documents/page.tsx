"use client";

import { useRef, useState, ReactElement } from "react";
import type { FormEvent } from "react";
import { UploadDocumentsForm } from "@/components/UploadDocumentsForm";
import { URLUploadButton } from "@/components/URLUploadButton";

export default function AgentsPage() {
  const [showFile, setShowFile] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl">📄 Document Portal</h1>
    </div>
  );

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
        [Insert component to delete document by ID]
      </div>
    </div>
  );
}
