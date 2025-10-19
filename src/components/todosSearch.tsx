"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface TodosSearchProps {
  onSearch: (query: string) => void;
}

export function TodosSearch({ onSearch }: TodosSearchProps) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        placeholder="Buscar todos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
