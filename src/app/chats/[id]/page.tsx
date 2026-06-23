"use client";

import { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMensajes, sendMensaje, deleteMensaje } from "@/lib/api";
import { useState, useRef, useEffect } from "react";

type Params = {
  id: string;
};

type Mensaje = {
  id: number;
  contenido: string;
  direccion: "saliente" | "entrante";
  created_at?: string;
  createdAt?: string;
};

function formatTime(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return "Ahora";
  if (diffMins < 60) return `hace ${diffMins}m`;
  if (diffHours < 24) return `hace ${diffHours}h`;
  
  // Mostrar hora exacta si es hoy
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  }
  
  // Mostrar fecha y hora si es otro día
  return date.toLocaleString("es-ES", { 
    year: "numeric", 
    month: "short", 
    day: "numeric",
    hour: "2-digit", 
    minute: "2-digit" 
  });
}

export default function ChatPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = use(params);
  const chatId = id;

  const [input, setInput] = useState("");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["mensajes", chatId],
    queryFn: () => getMensajes(chatId),
  });

  const mutation = useMutation({
    mutationFn: (contenido: string) =>
      sendMensaje(chatId, contenido),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mensajes", chatId],
      });
      setInput("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMensaje(chatId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mensajes", chatId],
      });
      setConfirmDelete(null);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  const enviar = () => {
    if (!input.trim()) return;
    mutation.mutate(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  const mensajes: Mensaje[] = data?.mensajes || [];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Chat #{chatId}</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">{mensajes.length} mensajes</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-3 text-slate-600 dark:text-slate-300">Cargando conversación...</p>
            </div>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center h-full">
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg text-center">
              <p className="font-semibold">⚠️ Error al cargar</p>
              <p className="text-sm mt-1">No se pudo conectar con el servidor</p>
            </div>
          </div>
        )}

        {!isLoading && !isError && mensajes.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-500 dark:text-slate-400">
              <p className="text-4xl mb-2">💬</p>
              <p className="font-medium">Aún no hay mensajes</p>
              <p className="text-sm mt-1">¡Inicia la conversación!</p>
            </div>
          </div>
        )}

        {mensajes.map((m: Mensaje) => (
          <div
            key={m.id}
            className={`flex ${
              m.direccion === "saliente" ? "justify-end" : "justify-start"
            }`}
            onMouseEnter={() => setHoveredId(m.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="flex gap-2 max-w-xs lg:max-w-md items-end group">
              <div
                className={`px-4 py-2 rounded-lg shadow-sm relative ${
                  m.direccion === "saliente"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-none border border-slate-200 dark:border-slate-600"
                }`}
              >
                <p className="break-words">{m.contenido}</p>
                <p
                  className={`text-xs mt-1 ${
                    m.direccion === "saliente"
                      ? "text-blue-100"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {formatTime(m.created_at || m.createdAt)}
                </p>
              </div>

              {/* Delete Button */}
              {hoveredId === m.id && m.direccion === "saliente" && (
                <div className="relative">
                  {confirmDelete === m.id ? (
                    <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-lg p-2 flex gap-1 whitespace-nowrap">
                      <button
                        onClick={() => deleteMutation.mutate(m.id)}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                        disabled={deleteMutation.isPending}
                      >
                        Eliminar
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-2 py-1 text-xs bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white rounded hover:bg-slate-400"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(m.id)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition"
                      title="Eliminar"
                    >
                      <svg
                        className="w-4 h-4 text-slate-400 hover:text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 shadow-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-3 rounded-full border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            disabled={mutation.isPending}
          />

          <button
            onClick={enviar}
            disabled={!input.trim() || mutation.isPending}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-full font-medium transition disabled:cursor-not-allowed flex items-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Enviando...
              </>
            ) : (
              <>
                Enviar
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
                </svg>
              </>
            )}
          </button>
        </div>
        {!input.trim() && input.length > 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">El mensaje no puede estar vacío</p>
        )}
      </div>
    </div>
  );
}