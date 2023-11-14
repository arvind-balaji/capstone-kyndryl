"use client";

import { usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from 'next/navigation';

export function Navbar() {
  const router = useRouter();
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_KEY!,
  );

  const handleDelete = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (confirm("Do you want to delete all documents?")) {
      try {
        const { data, error } = await client
          .from("documents")
          .delete()
          .neq("id", 0);
        if (error) throw error;
        alert("Reset knowledge base successfully!");
        router.push("/");
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const pathname = usePathname();
  return (
    <nav className="mb-4">
      <a
        className={`mr-4 ${pathname === "/" ? "text-white border-b" : ""}`}
        href="/"
      >
        About
      </a>
      <a
        className={`mr-4 ${
          pathname === "/retrieval" ? "text-white border-b" : ""
        }`}
        href="/retrieval"
      >
        App
      </a>
      {/* <a className={`mr-4 ${pathname === "/structured_output" ? "text-white border-b" : ""}`} href="/structured_output">🧱 Structured Output</a>
      <a className={`mr-4 ${pathname === "/agents" ? "text-white border-b" : ""}`} href="/agents">🦜 Agents</a> */}
      <a
        className={`mr-4 ${
          pathname === "/documents" ? "text-white border-b" : ""
        }`}
        href="/documents"
      >
        Documents
      </a>
      {/* <a className={`mr-4 text-red-500`}> */}
        {/* Reset */}
        <button className="shrink-0 py-1 bg-red-500 rounded w-16" onClick={handleDelete}>
        Reset
      </button>
       {/* </a> */}
      {/* <a className={`mr-4 ${pathname === "/retrieval_agents" ? "text-white border-b" : ""}`} href="/retrieval_agents">🤖 Retrieval Agents</a> */}
    </nav>
  );
}
