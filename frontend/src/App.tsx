import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Categorias } from "./pages/Categorias";
import { Pessoas } from "./pages/Pessoas";
import  {Transacoes} from "./pages/Transacoes";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/categorias"
        element={
          <ProtectedRoute>
            <Categorias />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pessoas"
        element={
          <ProtectedRoute>
            <Pessoas />
          </ProtectedRoute>
        }
      />

      <Route
        path="/transacoes"
        element={
          <ProtectedRoute>
            <Transacoes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
