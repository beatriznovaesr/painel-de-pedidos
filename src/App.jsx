import { Routes, Route } from "react-router-dom"
import Pedidos from "./pages/pedidos"
import DetalhesPedido from "./pages/detalhesPedidos"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Pedidos />} />
      <Route path="/pedido/:id" element={<DetalhesPedido />} />
    </Routes>
  )
}

export default App

