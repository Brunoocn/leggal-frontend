"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Todo, TodoUrgency } from "@/types/Todo";
import { fetchWrapper } from "@/utils/fetchWrapper";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { getCookie } from "cookies-next/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { UpdateTodoDialog } from "@/components/updateTodoDialog";
import { useState } from "react";
import { formatDate } from "@/utils/formatDate";

interface TodosTableProps {
  todos: Todo[];
}

export function TodosTable({ todos }: TodosTableProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function onDelete(id: string) {
    setDeletingId(id);
    try {
      const token = getCookie("LEGGAL::TOKEN");

      await fetchWrapper(`todos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      toast({
        title: "Sucesso!",
        description: "Todo deletado com sucesso.",
        variant: "sucess",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Erro!",
        description:
          error instanceof Error ? error.message : "Erro ao deletar todo.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  }

  const urgencyLabels: Record<TodoUrgency, string> = {
    [TodoUrgency.LOW]: "Baixa",
    [TodoUrgency.MEDIUM]: "Média",
    [TodoUrgency.HIGH]: "Alta",
    [TodoUrgency.URGENT]: "Urgente",
  };

  const urgencyColors: Record<TodoUrgency, string> = {
    [TodoUrgency.LOW]: "bg-green-100 text-green-800",
    [TodoUrgency.MEDIUM]: "bg-yellow-100 text-yellow-800",
    [TodoUrgency.HIGH]: "bg-orange-100 text-orange-800",
    [TodoUrgency.URGENT]: "bg-red-100 text-red-800",
  };

 

  return (
    <>
      {todos.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Urgência</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Atualizado em</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todos.map((todo) => (
              <TableRow key={todo.id}>
                <TableCell className="font-medium">{todo.title}</TableCell>
                <TableCell className="max-w-md truncate">
                  {todo.description}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      urgencyColors[todo.urgency]
                    }`}
                  >
                    {urgencyLabels[todo.urgency]}
                  </span>
                </TableCell>
                <TableCell>{formatDate(todo.createdAt)}</TableCell>
                <TableCell>{formatDate(todo.updatedAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <UpdateTodoDialog
                      todoId={todo.id}
                      trigger={
                        <button
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                      }
                    />

                    <button
                      onClick={() => onDelete(todo.id)}
                      disabled={deletingId === todo.id}
                      className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Deletar"
                    >
                      {deletingId === todo.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum todo encontrado.</p>
        </div>
      )}
    </>
  );
}
