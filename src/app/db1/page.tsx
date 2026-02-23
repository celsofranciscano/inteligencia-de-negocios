// app/neon-core/page.tsx
import { db1 } from "@/lib/db1";
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
  HeartPulse,
  UserCog,
  Activity,
  Stethoscope,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

async function getTableData(table: string) {
  const totalResult = await db1.query(
    `SELECT COUNT(*)::int AS total FROM ${table}`,
  );

  const rowsResult = await db1.query(
    `SELECT * FROM ${table} ORDER BY 1 DESC LIMIT 10`,
  );

  return {
    total: totalResult.rows[0].total as number,
    rows: rowsResult.rows as Record<string, any>[],
  };
}

const tableIcons: Record<string, React.ComponentType<any>> = {
  pacientes: HeartPulse,
  personal: UserCog,
  atenciones: Activity,
  diagnosticos: Stethoscope,
};

export default async function NeonCoreDashboard() {
  const tables = ["pacientes", "personal", "atenciones", "diagnosticos"];

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
                  Clínica DB
                </span>
                <span className="text-xs text-slate-400">
                  4 Tablas Principales
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 text-slate-400/80 uppercase text-xs tracking-wider font-medium pt-5 pb-2">
                Tablas
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {tables.map((table) => {
                    const Icon = tableIcons[table] || Table;
                    const total =
                      data.find((d) => d.table === table)?.total ?? 0;

                    return (
                      <SidebarMenuItem key={table}>
                        <SidebarMenuButton asChild>
                          <div className="flex items-center gap-3">
                            <Icon className="size-4.5 text-slate-300" />
                            <span className="capitalize">{table}</span>
                            <Badge
                              variant="secondary"
                              className="ml-auto bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 text-xs"
                            >
                              {total}
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
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-800/60 bg-slate-950/80 px-6 backdrop-blur-sm">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-xl font-bold tracking-tight text-white">
              Dashboard Clínica
            </h1>
          </header>

          <main className="flex-1 overflow-auto p-6 lg:p-8">
            <ScrollArea className="h-full">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2">
                {data.map((t) => {
                  const Icon = tableIcons[t.table] || Table;

                  return (
                    <Card
                      key={t.table}
                      className="border-slate-800/60 bg-slate-900/70 backdrop-blur-sm"
                    >
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="flex items-center gap-2 text-base font-semibold capitalize text-slate-100">
                          <Icon className="size-5 text-indigo-400" />
                          {t.table}
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
                                  <tr key={i} className="hover:bg-slate-800/40">
                                    {Object.values(row).map((value, idx) => (
                                      <td
                                        key={idx}
                                        className="max-w-[180px] truncate px-4 py-3 text-slate-300"
                                      >
                                        {value == null ? "—" : String(value)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="rounded-lg border border-dashed border-slate-700/60 p-8 text-center text-slate-500">
                            Sin registros
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
