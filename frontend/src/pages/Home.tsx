import LayoutAutenticado from "../components/LayoutAutenticado";
import "../styles/global.css";

export default function Home() {
  return (
    <LayoutAutenticado>
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Pessoas</h3>
          <span>Cadastro ativo</span>
        </div>

        <div className="dashboard-card">
          <h3>Categorias</h3>
          <span>Organização financeira</span>
        </div>

        <div className="dashboard-card">
          <h3>Transações</h3>
          <span>Controle financeiro</span>
        </div>
      </div>
    </LayoutAutenticado>
  );
}
