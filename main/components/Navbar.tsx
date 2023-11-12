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
      console.log('Documents deleted successfully', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const pathname = usePathname();
  return (
    <nav className="mb-4">
      <a className={`mr-4 ${pathname === "/" ? "text-white border-b" : ""}`} href="/">Test</a>
      <a className={`mr-4 ${pathname === "/retrieval" ? "text-white border-b" : ""}`} href="/retrieval">Home</a>
      <a className={`mr-4 ${pathname === "/" ? "text-white border-b" : ""}`} onClick={handleDelete}>Reset</a>
    </nav>
  );
}