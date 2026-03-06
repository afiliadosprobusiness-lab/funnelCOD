import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">FunnelCOD</p>
        <h1 className="mb-3 mt-2 text-5xl font-black text-white">404</h1>
        <p className="mb-6 text-sm text-slate-300">
          La página que buscabas no existe o fue movida.
        </p>
        <a
          href="/"
          className="inline-flex rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
