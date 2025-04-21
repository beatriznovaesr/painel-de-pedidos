import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  getPedidos,
  getItensPedido,
  getProdutos
} from "../services/api"

function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [valoresTotais, setValoresTotais] = useState({})
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function fetchTudo() {
      try {
        const [pedidosRes, itensRes, produtosRes] = await Promise.all([
          getPedidos(),
          getItensPedido(),
          getProdutos()
        ])

        setPedidos(pedidosRes)

        const mapaProdutos = {}
        produtosRes.forEach(prod => {
          mapaProdutos[prod.id] = prod.valor
        })

        const valores = {}

        pedidosRes.forEach(pedido => {
          const itensDoPedido = itensRes.filter(
            item => item.pedido === pedido.id
          )

          const total = itensDoPedido.reduce((soma, item) => {
            const valorUnitario = mapaProdutos[item.produto] || 0
            return soma + item.quantidade * valorUnitario
          }, 0)

          valores[pedido.id] = total
        })

        setValoresTotais(valores)
      } catch (err) {
        console.error(err)
        setErro("Erro ao carregar dados.")
      }
    }

    fetchTudo()
  }, [])

  if (erro) return <p className="text-red-500 p-4">{erro}</p>
  if (!pedidos.length) return <p className="p-4">Carregando pedidos...</p>

  return (
    <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {pedidos.map((pedido) => (
        <Card key={pedido.id}>
          <CardHeader>
            <CardTitle>Pedido {pedido.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Cliente: {pedido.cliente}</p>
            <p>Data: {pedido.data}</p>
            <p>
              Valor total:{" "}
              <span className="font-semibold text-green-600">
                R$ {valoresTotais[pedido.id]?.toFixed(2) || "0,00"}
              </span>
            </p>
            <Link to={`/pedido/${pedido.id}`}>
              <Button>Ver detalhes</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Pedidos
