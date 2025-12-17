import "./css/Navbar.css";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <header className="navbar">
      <h1>Sistema Financeiro</h1>
      <button onClick={logout}>Sair</button>
    </header>
  );
}
