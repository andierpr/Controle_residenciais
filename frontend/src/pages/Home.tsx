import { Link } from "react-router-dom";
import LayoutAutenticado from "../components/LayoutAutenticado";
import "../styles/global.css";
import "../components/css/Dashboard.css";


export default function Home() {
  return (
    <LayoutAutenticado>
      <h1>Dashboard</h1>
      <p style={{ color: "#6b7280", marginTop: "4px" }}>
        Acesso rápido aos cadastros principais do sistema
      </p>

      <div className="dashboard-grid">
        <Link to="/pessoas" className="dashboard-card">
          <h3>Pessoas</h3>
          <span>Cadastro ativo</span>
        </Link>

        <Link to="/categorias" className="dashboard-card">
          <h3>Categorias</h3>
          <span>Organização financeira</span>
        </Link>

        <Link to="/transacoes" className="dashboard-card">
          <h3>Transações</h3>
          <span>Controle financeiro</span>
        </Link>
      </div>
    </LayoutAutenticado>
  );
}
