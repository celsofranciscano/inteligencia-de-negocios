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
import { Button } from "@/components/ui/button";

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

const tables = ["pacientes", "personal", "atenciones", "diagnosticos"];

export default async function NeonCoreDashboard() {
  const data = await Promise.all(
    tables.map(async (table) => ({
      table,
      ...(await getTableData(table)),
    })),
  );

  return (
    <SidebarProvider defaultOpen={true}>
      {/* ─── CONTENEDOR PRINCIPAL ─────────────────────────────── */}
      <div className="flex w-full h-screen">
        {/* ─── SIDEBAR ──────────────────────────────────────────────── */}
        <Sidebar
          collapsible="icon"
          className="border-r border-border bg-background/95 backdrop-blur-md flex-shrink-0"
        >
          <SidebarHeader className="border-b border-border px-4 py-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <Database className="size-5.5" />
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 pt-6 pb-2 uppercase text-xs tracking-widest font-semibold text-muted-foreground">
                Tablas principales
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {tables.map((table) => {
                    const Icon = tableIcons[table] || Table;
                    const total =
                      data.find((d) => d.table === table)?.total ?? 0;

                    return (
                      <SidebarMenuItem key={table}>
                        <SidebarMenuButton
                          asChild
                          className="hover:bg-accent/20 active:bg-accent/30 data-[active=true]:bg-accent/30"
                        >
                          <a
                            href={`#${table}`}
                            className="flex items-center gap-3 py-2.5"
                          >
                            <Icon className="size-4.5 text-foreground" />
                            <span className="capitalize font-medium">
                              {table}
                            </span>
                            <Badge
                              variant="outline"
                              className="ml-auto border-border bg-background text-foreground text-xs font-medium px-2 py-0.5"
                            >
                              {total}
                            </Badge>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarRail className="bg-muted/30" />
        </Sidebar>

        {/* ─── MAIN CONTENT ─────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background/90 backdrop-blur-lg px-6 lg:px-8 flex-shrink-0">
            <SidebarTrigger className="text-foreground hover:text-primary" />
            <Separator orientation="vertical" className="h-7" />
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Clínica G1 — Core
            </h1>
            <a href="/db1/diagnosticos"> INSERTS</a>
          </header>

          <main className="flex-1 overflow-auto p-6 lg:p-8">
            <ScrollArea className="h-full">
              <div className=" gap-10 pb-16 grid grid-cols-1">
                {data.map((t) => {
                  const Icon = tableIcons[t.table] || Table;

                  return (
                    <section
                      key={t.table}
                      id={t.table}
                      className="scroll-mt-20"
                    >
                      <Card className="border bg-background/40 backdrop-blur-sm shadow-sm">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                              <Icon className="size-6" />
                              <span className="capitalize">{t.table}</span>
                            </CardTitle>

                            <Badge
                              variant="outline"
                              className="px-3 py-1 text-sm"
                            >
                              {t.total} registros
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent>
                          {t.rows.length > 0 ? (
                            <div className="overflow-x-auto rounded-xl border bg-background/70">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b bg-muted/30">
                                    {Object.keys(t.rows[0]).map((col) => (
                                      <th
                                        key={col}
                                        className="px-5 py-4 text-left font-semibold uppercase tracking-wide text-muted-foreground text-xs"
                                      >
                                        {col}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-muted/30">
                                  {t.rows.map((row, i) => (
                                    <tr
                                      key={i}
                                      className="hover:bg-accent/20 transition-colors duration-150"
                                    >
                                      {Object.values(row).map((value, idx) => (
                                        <td
                                          key={idx}
                                          className="px-5 py-3.5 max-w-[220px] truncate"
                                        >
                                          {value == null ? (
                                            <span className="text-muted-foreground">
                                              —
                                            </span>
                                          ) : (
                                            String(value)
                                          )}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                              No hay registros en esta tabla
                            </div>
                          )}

                          <div className="mt-5 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="hover:bg-accent/20"
                            >
                              <a href="#top">↑ Volver arriba</a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </section>
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
