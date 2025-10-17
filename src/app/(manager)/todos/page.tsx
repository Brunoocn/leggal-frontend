import { Pagination } from "@/components/pagination";

import { Todo } from "@/types/Todo";

import { fetchWrapper } from "@/utils/fetchWrapper";
import { getToken } from "@/utils/getToken";


interface IReponseClients {
  list: Todo[];
  paging: {
    total: number;
    page: number;
    pages: number;
  };
}

export type ParsedClient = {
  id: string;
  name: string;
  companyValue: string;
  salary: string;
  isSelect: boolean;
  userId: string;
};
async function requestTodos(pageSize: number, page: number) {
  const token = await getToken();

  const data: IReponseClients = await fetchWrapper(
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

export default async function Clients(props: {
  searchParams?: Promise<{
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const ITEMS_PER_PAGE: number = 10;
  const page = Number(searchParams?.page) || 1;
  const response = await requestTodos(ITEMS_PER_PAGE, page);
  const totalCountClients = response.paging.total;


  return (
    <main className="p-4">
      <p className="text-black mb-[10px]">
        <span className="text-black font-semibold mr-[5px]">
          {totalCountClients}
        </span>
        Todos encontrados:
      </p>
      {response.paging.total >= 1 && (
        <Pagination totalCount={totalCountClients || 10} />
      )}
    </main>
  );
}
