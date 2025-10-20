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
import ConfirmDialog from "@/components/confirmDialog";

interface TodosTableProps {
  todos: Todo[];
}

export function TodosTable({ todos }: TodosTableProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);

  function handleOpenConfirmDialog(id: string) {
    setTodoToDelete(id);
    setShowConfirmDialog(true);
  }

  function handleCloseConfirmDialog() {
    setShowConfirmDialog(false);
    setTodoToDelete(null);
  }

  async function onConfirmDelete() {
    if (!todoToDelete) return;

    setShowConfirmDialog(false);
    setDeletingId(todoToDelete);

    try {
      const token = getCookie("LEGGAL::TOKEN");

      await fetchWrapper(`todos/${todoToDelete}`, {
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
      setTodoToDelete(null);
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
        <>
          <div className="hidden md:block">
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
                          onClick={() => handleOpenConfirmDialog(todo.id)}
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
          </div>

          <div className="md:hidden space-y-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm text-black flex-1 leading-tight">
                    {todo.title}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap flex-shrink-0 ${
                      urgencyColors[todo.urgency]
                    }`}
                  >
                    {urgencyLabels[todo.urgency]}
                  </span>
                </div>

                <p className="text-xs text-gray-600 mb-2 line-clamp-2 leading-relaxed">
                  {todo.description}
                </p>

                <div className="flex flex-col gap-1 text-[10px] text-gray-500 mb-2">
                  <div className="flex justify-between">
                    <span>Criado:</span>
                    <span className="font-medium">{formatDate(todo.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Atualizado:</span>
                    <span className="font-medium">{formatDate(todo.updatedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <UpdateTodoDialog
                    todoId={todo.id}
                    trigger={
                      <button
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-xs font-medium"
                        title="Editar"
                      >
                        <Pencil size={14} />
                        <span>Editar</span>
                      </button>
                    }
                  />

                  <button
                    onClick={() => handleOpenConfirmDialog(todo.id)}
                    disabled={deletingId === todo.id}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                    title="Deletar"
                  >
                    {deletingId === todo.id ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Deletando...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={14} />
                        <span>Deletar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum todo encontrado.</p>
        </div>
      )}

      <ConfirmDialog
        showDialog={showConfirmDialog}
        handleDialog={handleCloseConfirmDialog}
        functionConfirm={onConfirmDelete}
        title="Confirmar exclusão"
        message="Tem certeza que deseja deletar este todo? Esta ação não pode ser desfeita."
        messageCancel="Cancelar"
        messageConfirm="Deletar"
      />
    </>
  );
}
