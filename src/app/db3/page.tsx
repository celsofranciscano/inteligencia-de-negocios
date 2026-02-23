// app/neon-core/page.tsx
import { db3 } from "@/lib/db3";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Database,
  Table,
  Users,
  UserCog,
  HeartPulse,
  Stethoscope,
  Calendar,
  Activity,
  Pill,
  FileText,
  FileWarning,
  DollarSign,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

async function getTableData(table: string) {
  const totalResult = await db3.query(
    `SELECT COUNT(*)::int AS total FROM ${table}`,
  );

  const rowsResult = await db3.query(`SELECT * FROM ${table} LIMIT 10`);

  return {
    total: totalResult.rows[0].total as number,
    rows: rowsResult.rows as Record<string, any>[],
  };
}

const tableIcons: Record<string, React.ComponentType<any>> = {
  personas: Users,
  personal_medico: UserCog,
  pacientes: HeartPulse,
  diagnosticos: Stethoscope,
  servicios: LayoutDashboard,
  citas: Calendar,
  atenciones: Activity,
  diagnosticos_atencion: FileText,
  procedimientos: Pill,
  prescripciones: FileWarning,
  ausencias: ChevronRight,
  facturacion: DollarSign,
};

export default async function NeonCoreDashboard() {
  const tables = [
    "personas",
    "personal_medico",
    "pacientes",
    "diagnosticos",
    "servicios",
    "citas",
    "atenciones",
    "diagnosticos_atencion",
    "procedimientos",
    "prescripciones",
    "ausencias",
    "facturacion",
  ];

  const data = await Promise.all(
    tables.map(async (table) => ({
      table,
      ...(await getTableData(table)),
    })),
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="group flex min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-950 to-indigo-950/30">
        {/* Sidebar */}
        <Sidebar collapsible="icon" className="border-r border-slate-800/60">
          <SidebarHeader className="border-b border-slate-800/60 px-4 py-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                <Database className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold tracking-tight text-white">
                  Neon Core
                </span>
                <span className="text-xs text-slate-400">Clínica DB</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 text-slate-400/80 uppercase text-xs tracking-wider font-medium pt-5 pb-2">
                Tablas Principales
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {tables.map((table) => {
                    const Icon = tableIcons[table] || Table;
                    return (
                      <SidebarMenuItem key={table}>
                        <SidebarMenuButton
                          asChild
                          tooltip={table.replace(/_/g, " ")}
                          className="hover:bg-slate-800/50 active:bg-slate-800/70"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="size-4.5 text-slate-300" />
                            <span className="capitalize truncate">
                              {table.replace(/_/g, " ")}
                            </span>
                            <Badge
                              variant="secondary"
                              className="ml-auto bg-indigo-950/60 text-indigo-300 hover:bg-indigo-950/80 border border-indigo-800/40 text-xs"
                            >
                              {data.find((d) => d.table === table)?.total ?? 0}
                            </Badge>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarRail />
        </Sidebar>

        {/* Contenido principal */}
        <div className="flex flex-1 flex-col">
          {/* Header fijo */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-800/60 bg-slate-950/80 px-6 backdrop-blur-sm">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Neon DB Dashboard
              </h1>
              <Badge variant="outline" className="border-slate-700 text-slate-400">
                Core 12 Tablas
              </Badge>
            </div>
          </header>

          {/* Contenido */}
          <main className="flex-1 overflow-auto p-6 lg:p-8">
            <ScrollArea className="h-full">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.map((t) => {
                  const Icon = tableIcons[t.table] || Table;

                  return (
                    <Card
                      key={t.table}
                      className="border-slate-800/60 bg-slate-900/70 backdrop-blur-sm transition-all hover:border-indigo-700/50 hover:shadow-xl hover:shadow-indigo-950/10"
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="flex items-center gap-2.5 text-base font-semibold capitalize text-slate-100">
                          <Icon className="size-5 text-indigo-400" />
                          {t.table.replace(/_/g, " ")}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="border-indigo-800/50 bg-indigo-950/40 text-indigo-300"
                        >
                          {t.total} registros
                        </Badge>
                      </CardHeader>

                      <CardContent>
                        {t.rows.length > 0 ? (
                          <div className="overflow-x-auto rounded-lg border border-slate-800/60 bg-slate-950/50">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b border-slate-800/70 bg-slate-900/70">
                                  {Object.keys(t.rows[0]).map((col) => (
                                    <th
                                      key={col}
                                      className="px-4 py-3 text-left font-medium uppercase tracking-wider text-slate-400"
                                    >
                                      {col}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/40">
                                {t.rows.map((row, i) => (
                                  <tr
                                    key={i}
                                    className="transition-colors hover:bg-slate-800/40"
                                  >
                                    {Object.values(row).map((value, idx) => (
                                      <td
                                        key={idx}
                                        className="max-w-[180px] truncate px-4 py-3 text-slate-300"
                                      >
                                        {value == null
                                          ? "—"
                                          : String(value)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="rounded-lg border border-dashed border-slate-700/60 p-8 text-center text-slate-500">
                            Sin registros aún
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-10 text-center text-sm text-slate-500">
                <p>Neon Core • Sistema de Gestión Clínica • {new Date().getFullYear()}</p>
              </div>
            </ScrollArea>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}