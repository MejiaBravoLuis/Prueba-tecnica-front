"use client";

import { useQuery } from "@tanstack/react-query";
import { getChats } from "@/lib/api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Chat = {
  id: number;
  nombre: string;
  telefono: string;
  empresa_nombre?: string;
  nombre_empresa?: string;
};

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
  });

  const chats: Chat[] = data?.chats || [];
  const currentChatId = pathname.split("/").pop();

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Chats
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {chats.length} conversaciones
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="p-4 text-center">
            <div className="inline-block animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Cargando...
            </p>
          </div>
        )}

        {isError && (
          <div className="p-4 text-center">
            <p className="text-xs text-red-500">Error al cargar</p>
          </div>
        )}

        {!isLoading && !isError && chats.length === 0 && (
          <div className="p-4 text-center text-slate-500 dark:text-slate-400">
            <p className="text-sm">Sin chats</p>
          </div>
        )}

        {chats.map((chat: Chat) => (
          <Link
            key={chat.id}
            href={`/chats/${chat.id}`}
            onClick={() => setSidebarOpen(false)}
            className={`block p-4 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition ${
              currentChatId === String(chat.id)
                ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-500"
                : ""
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-white truncate">
                  {chat.nombre}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {chat.telefono}
                </p>
                {(chat.empresa_nombre || chat.nombre_empresa) && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                    {chat.empresa_nombre || chat.nombre_empresa}
                  </p>
                )}
              </div>
              {currentChatId === String(chat.id) && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 text-center">
        Chat Application
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900">
      <div className="hidden lg:flex lg:w-64 flex-col border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <SidebarContent />
      </div>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`lg:hidden fixed top-0 left-0 z-50 h-screen w-64 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } border-r border-slate-200 dark:border-slate-700 flex flex-col bg-slate-50 dark:bg-slate-800`}
      >
        <SidebarContent />
      </div>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        {sidebarOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
