import { Pagination } from "@/components/pagination";
import { TodosTable } from "@/components/todosTable";
import { Todo } from "@/types/Todo";
import { fetchWrapper } from "@/utils/fetchWrapper";
import { getToken } from "@/utils/getToken";
import { TodosSearchWrapper } from "@/components/todosSearchWrapper";
import { CreateTodoDialog } from "@/components/createTodoDialog";

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

async function loadTodos({
  query,
  page,
  pageSize,
}: {
  query?: string;
  page: number;
  pageSize: number;
}) {
  if (query) {
    const todos = await searchTodos(query);
    return { todos, totalCount: todos.length, isSearch: true };
  }

  const response = await requestTodos(pageSize, page);
  return {
    todos: response.todos,
    totalCount: response.paging.total,
    isSearch: false,
  };
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

  const { todos, totalCount, isSearch } = await loadTodos({
    query,
    page,
    pageSize: ITEMS_PER_PAGE,
  });

  return (
    <main className="p-4">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-black">Todos</h1>
          <CreateTodoDialog />
        </div>
        <p className="text-black">
          <span className="text-black font-semibold mr-[5px]">
            {totalCount}
          </span>
          {totalCount === 1 ? "Todo encontrado" : "Todos encontrados"}
          {isSearch && query && (
            <span className="text-black ml-2">para {query}</span>
          )}
        </p>
      </div>

      <TodosSearchWrapper />

      <TodosTable todos={todos} />

      {!isSearch && totalCount > ITEMS_PER_PAGE && (
        <Pagination totalCount={totalCount} />
      )}
    </main>
  );
}
