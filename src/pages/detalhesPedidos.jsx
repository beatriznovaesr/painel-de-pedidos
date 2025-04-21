import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  getPedidoById,
  getClienteById,
  getItensPedido,
  getProdutos
} from "../services/api"

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

function DetalhesPedido() {
  const { id } = useParams()
  const [pedido, setPedido] = useState(null)
  const [cliente, setCliente] = useState(null)
  const [itens, setItens] = useState([])
  const [produtos, setProdutos] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    async function fetchDetalhes() {
      try {
        const pedidoRes = await getPedidoById(id)
        setPedido(pedidoRes)

        const clienteRes = await getClienteById(pedidoRes.cliente)
        setCliente(clienteRes)

        const itensRes = await getItensPedido()
        const itensFiltrados = itensRes.filter(item => item.pedido == id)
        setItens(itensFiltrados)

        const produtosRes = await getProdutos()
        setProdutos(produtosRes)

        const mapaProdutos = {}
        produtosRes.forEach(p => (mapaProdutos[p.id] = p))

        const totalPedido = itensFiltrados.reduce((acc, item) => {
          const valor = (mapaProdutos[item.produto]?.valor || 0) * item.quantidade
          return acc + valor
        }, 0)

        setTotal(totalPedido)
      } catch (error) {
        console.error("Erro ao carregar detalhes do pedido:", error)
      }
    }

    fetchDetalhes()
  }, [id])

  if (!pedido || !cliente || !produtos.length) return <p className="p-4">Carregando...</p>

  const mapaProdutos = {}
  produtos.forEach(p => (mapaProdutos[p.id] = p))

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Detalhes do Pedido {pedido.id}</h2>

      {/* Tabela de dados do cliente */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Dados do Cliente</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Data do Pedido</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{cliente.nome}</TableCell>
              <TableCell>{cliente.cpf}</TableCell>
              <TableCell>{cliente.email}</TableCell>
              <TableCell>{pedido.data}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Tabela de itens do pedido */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Itens do Pedido</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itens.map((item, idx) => {
              const produto = mapaProdutos[item.produto]
              return (
                <TableRow key={idx}>
                  <TableCell>{produto?.id}</TableCell>
                  <TableCell>{produto?.nome}</TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>
                    R$ {(produto?.valor * item.quantidade).toFixed(2)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Valor total */}
      <div className="text-right text-lg font-bold pr-4">
        Valor total do pedido:{" "}
        <span className="text-green-600">R$ {total.toFixed(2)}</span>
      </div>
    </div>
  )
}

export default DetalhesPedido
