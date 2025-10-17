import { Pagination } from "@/components/pagination";
import { TodosTable } from "@/components/todosTable";
import { Button } from "@/components/ui/button";
import { Todo } from "@/types/Todo";
import { fetchWrapper } from "@/utils/fetchWrapper";
import { getToken } from "@/utils/getToken";
import { Plus } from "lucide-react";
import Link from "next/link";
import { TodosSearchWrapper } from "@/components/todosSearchWrapper";

interface IResponseTodos {
  list: Todo[];
  paging: {
    total: number;
    page: number;
    pages: number;
  };
}

async function requestTodos(pageSize: number, page: number) {
  const token = await getToken();

  const data: IResponseTodos = await fetchWrapper(
    `todos?pageSize=${pageSize}&page=${page}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return {
    todos: data.list,
    paging: data.paging,
  };
}

async function searchTodos(query: string) {
  const token = await getToken();

  const todos: Todo[] = await fetchWrapper(
    `todos/search/semantic?query=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return todos;
}

export default async function TodosPage(props: {
  searchParams?: Promise<{
    page?: string;
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const ITEMS_PER_PAGE: number = 10;
  const page = Number(searchParams?.page) || 1;
  const query = searchParams?.query;

  const isSearchMode = !!query;

  let todos: Todo[];
  let totalCount: number;

  if (isSearchMode) {
    todos = await searchTodos(query);
    totalCount = todos.length;
  } else {
    const response = await requestTodos(ITEMS_PER_PAGE, page);
    todos = response.todos;
    totalCount = response.paging.total;
  }

  return (
    <main className="p-4">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-black">Todos</h1>
          <Link href="/todos/create">
            <Button className="flex items-center gap-2 h-9 px-4 text-sm">
              <Plus className="h-4 w-4" />
              Criar Todo
            </Button>
          </Link>
        </div>
        <p className="text-black">
          <span className="text-black font-semibold mr-[5px]">
            {totalCount}
          </span>
          {totalCount === 1 ? "Todo encontrado" : "Todos encontrados"}
          {isSearchMode && query && (
            <span className="text-gray-600 ml-2">para &quot;{query}&quot;</span>
          )}
        </p>
      </div>

      <TodosSearchWrapper />

      <TodosTable todos={todos} />

      {!isSearchMode && totalCount > ITEMS_PER_PAGE && (
        <Pagination totalCount={totalCount} />
      )}
    </main>
  );
}
