const BASE_URL = "https://sistemalift1.com.br/lift_ps/api"

export async function getPedidos() {
  const res = await fetch(`${BASE_URL}/Pedidos`)
  if (!res.ok) throw new Error("Erro ao buscar pedidos")
  return res.json()
}

export async function getPedidoById(id) {
  const res = await fetch(`${BASE_URL}/Pedidos/${id}`)
  if (!res.ok) throw new Error("Erro ao buscar pedido")
  return res.json()
}

export async function getItensPedido() {
  const res = await fetch("https://sistemalift1.com.br/lift_ps/api/ItensPedido")
  if (!res.ok) throw new Error("Erro ao buscar itens de pedido")
  return res.json()
}

export async function getProdutos() {
  const res = await fetch("https://sistemalift1.com.br/lift_ps/api/Produtos")
  if (!res.ok) throw new Error("Erro ao buscar produtos")
  return res.json()
}

export async function getClienteById(id) {
  const res = await fetch(`${BASE_URL}/Clientes/${id}`)
  return await res.json()
}