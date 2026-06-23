export async function getChats() {
  const res = await fetch(`/api/chats`);
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return res.json();
}

export async function getMensajes(chatId: string) {
  const res = await fetch(`/api/chats/${chatId}/mensajes`);
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return res.json();
}

export async function sendMensaje(chatId: string, contenido: string) {
  const res = await fetch(`/api/chats/${chatId}/mensajes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contenido }),
  });
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return res.json();
}

export async function deleteMensaje(chatId: string, id: number) {
  const res = await fetch(`/api/chats/mensajes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return res.json();
}