"use client";

import { usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from 'next/navigation';
import AdminToggle from './AdminToggle'; 
import { useState, useEffect } from 'react';

export function Navbar() {
  const router = useRouter();
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_KEY!,
  );

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Fetch the initial admin status when the component mounts
    fetch('/api/admin')
      .then((response) => response.json())
      .then((data) => setIsAdmin(data.isAdmin))
      .catch((error) => console.error('Error fetching admin status:', error));
  }, []);
  const handleToggle = () => {
    // Toggle the admin status and update it on the server
    const newAdminStatus = !isAdmin;
    fetch('/api/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isAdmin: newAdminStatus }),
    })
      .then((response) => response.json())
      .then((data) => setIsAdmin(data.isAdmin))
      .catch((error) => console.error('Error updating admin status:', error));
  };

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
    <nav className="mb-4 flex">
      <button
        className={`mr-4 ${pathname === "/" ? "text-white border-b" : "text-red"}`}
        onClick={() => router.push("/")}
      >
        About
      </button>
      <button
        className={`mr-4 ${
          pathname === "/retrieval" ? "text-white border-b" : ""
        }`}
        onClick={() => router.push("/retrieval")}
      >
        App
      </button>
      {/* <a className={`mr-4 ${pathname === "/structured_output" ? "text-white border-b" : ""}`} href="/structured_output">🧱 Structured Output</a>
      <a className={`mr-4 ${pathname === "/agents" ? "text-white border-b" : ""}`} href="/agents">🦜 Agents</a> */}
      <button
        className={`mr-4 ${pathname === '/documents' ? 'text-white border-b' : ''}`}
        onClick={() => {
          if (isAdmin) {
            // Handle the click event for admins
            window.location.href = '/documents';
          } else {
            // Optionally, show a message or prevent the action for non-admins
            alert('You do not have permission to access this page.');
          }
        }}
        disabled={!isAdmin}
      >
        Documents
      </button>
      {/* <a className={`mr-4 text-red-500`}> */}
        {/* Reset */}
        <button className="shrink-0 py-1 bg-red-500 rounded w-16 mr-4" onClick={handleDelete}>
        Reset
      </button>
      <div className="mr-4 flex">
        <p className="mr-2">Admin Status</p>
        <label className="switch mr-4">
          <input type="checkbox" checked={isAdmin} onChange={handleToggle} />
          <span className="slider round"></span>
        </label>
      </div>
       {/* </a> */}
      {/* <a className={`mr-4 ${pathname === "/retrieval_agents" ? "text-white border-b" : ""}`} href="/retrieval_agents">🤖 Retrieval Agents</a> */}
    </nav>
  );
}
