import Link from "next/link";
import { Database, Users, Layers, ArrowRight, HeartPulse } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center px-6 py-28 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl">
          <Database className="h-10 w-10 text-white" />
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Sistema de Gestión Clínica
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          Plataforma académica para el análisis estructural de bases de datos.
          Proyecto desarrollado para la materia de Base de Datos – UPDS.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/db3"
            className="group flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-500"
          >
            <HeartPulse className="h-4 w-4" />
            Nuestra Base de Datos
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>

          <Link
            href="/db1"
            className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
          >
            <Users className="h-4 w-4" />
            Grupo 1
          </Link>

          <Link
            href="/db2"
            className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
          >
            <Layers className="h-4 w-4" />
            Grupo 2
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} UPDS • Proyecto Académico Base de Datos
      </footer>
    </div>
  );
}
