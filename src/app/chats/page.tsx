"use client";

export default function ChatsPage() {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center">
        <p className="text-4xl mb-4">💬</p>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Selecciona un chat
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Elige una conversación del sidebar para comenzar
        </p>
      </div>
    </div>
  );
}
