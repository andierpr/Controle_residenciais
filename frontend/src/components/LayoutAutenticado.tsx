import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./css/LayoutAutenticado.css";

export default function LayoutAutenticado({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-content">
        <Navbar />
        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  );
}
