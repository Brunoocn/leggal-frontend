"use client";

import { TodosSearch } from "./todosSearch";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";

export function TodosSearchWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lastQueryRef = useRef<string>(searchParams.get("query") || "");

  const handleSearch = useCallback(
    (query: string) => {
      if (query === lastQueryRef.current) {
        return;
      }

      lastQueryRef.current = query;
      const params = new URLSearchParams();

      if (query) {
        params.set("query", query);
      } else {
        const currentPage = searchParams.get("page");
        if (currentPage) {
          params.set("page", currentPage);
        }
      }

      const queryString = params.toString();
      router.push(queryString ? `/todos?${queryString}` : "/todos");
    },
    [router, searchParams]
  );

  return <TodosSearch onSearch={handleSearch} />;
}
