"use client";

import { TodosSearch } from "./todosSearch";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";

export function TodosSearchWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lastQueryRef = useRef<string>(searchParams.get("query") || "");

  const handleSearch = useCallback((query: string) => {
    // Evita requisições duplicadas
    if (query === lastQueryRef.current) {
      return;
    }

    lastQueryRef.current = query;
    const params = new URLSearchParams(searchParams.toString());

    if (query) {
      params.set("query", query);
      params.delete("page"); // Remove paginação quando está em modo de busca
    } else {
      params.delete("query");
    }

    router.push(`/todos?${params.toString()}`);
  }, [router, searchParams]);

  return <TodosSearch onSearch={handleSearch} />;
}
