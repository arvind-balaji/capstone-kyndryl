"use client" 
import { useRef, useState, ReactElement } from "react";
import type { FormEvent } from "react";
import { UploadDocumentsForm } from "@/components/UploadDocumentsForm";
import { URLUploadButton } from "@/components/URLUploadButton";

export default function AgentsPage() {
  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl">
      📄 Document Upload Portal
      </h1>
    </div>
  );
  return (
    <div className='flex flex-col gap-4'>
      {InfoCard}
      <div>
      <UploadDocumentsForm />
      <URLUploadButton />
      </div>
    </div>
  );
}