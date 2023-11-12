"use client";

import { usePathname } from 'next/navigation';
import { createClient } from "@supabase/supabase-js";

export function Navbar() {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_KEY!,
  );

  const handleDelete = async (event: React.MouseEvent) => {
    event.preventDefault(); 
    try {
      const { data, error } = await client.from('documents').delete().neq("id", 0);
      if (error) throw error;
      alert("Reset knowledge base successfully!");
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const pathname = usePathname();
  return (
    <nav className="mb-4">
      <a className={`mr-4 ${pathname === "/" ? "text-white border-b" : ""}`} href="/">About</a>
      <a className={`mr-4 ${pathname === "/retrieval" ? "text-white border-b" : ""}`} href="/retrieval">App</a>
      <a className={`mr-4`} onClick={handleDelete}>Reset</a>
    </nav>
  );
}