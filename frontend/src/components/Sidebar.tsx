import { NavLink } from "react-router-dom";
import "./css/Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Controle</h2>
      <nav>
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/pessoas">Pessoas</NavLink>
        <NavLink to="/categorias">Categorias</NavLink>
        <NavLink to="/transacoes">Transações</NavLink>
      </nav>
    </aside>
  );
}
