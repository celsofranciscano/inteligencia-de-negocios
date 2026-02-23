"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function BIReportsChart({ report1, report2, report3 }: Props) {
  // Config colores y etiquetas de Shadcn
  const config1 = {
    count: { label: "Cantidad de atenciones", color: "#4ade80" },
  } satisfies ChartConfig;

  const config2 = {
    atenciones: { label: "Atenciones por paciente", color: "#60a5fa" },
  } satisfies ChartConfig;

  const config3 = {
    total_income: { label: "Ingresos (Bs)", color: "#facc15" },
    service_count: { label: "Cantidad de servicios", color: "#f87171" },
  } satisfies ChartConfig;

  return (
    <div className="grid grid-cols-1  gap-6 p-64">
      {/* Reporte 1 */}
      <Card>
        <CardHeader>
          <CardTitle>Servicios más solicitados</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config1} className="min-h-[250px] w-full">
            <BarChart data={report1}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="servicio" axisLine={false} tickLine={false} />
              <YAxis />
              <ChartTooltip
                content={
                  <ChartTooltipContent labelKey="count" nameKey="servicio" />
                }
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="servicio" />}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Reporte 2 */}
      <Card>
        <CardHeader>
          <CardTitle>Pacientes con más atenciones</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config2} className="min-h-[250px] w-full">
            <BarChart data={report2}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="paciente_id" axisLine={false} tickLine={false} />
              <YAxis />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelKey="atenciones"
                    nameKey="paciente_id"
                  />
                }
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="paciente_id" />}
              />
              <Bar
                dataKey="atenciones"
                fill="var(--color-atenciones)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Reporte 3 */}
      <Card>
        <CardHeader>
          <CardTitle>Impacto financiero por diagnóstico</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config3} className="min-h-[300px] w-full">
            <BarChart data={report3}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="diagnosis" axisLine={false} tickLine={false} />
              <YAxis />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelKey="total_income"
                    nameKey="diagnosis"
                  />
                }
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="diagnosis" />}
              />
              <Bar
                dataKey="total_income"
                fill="var(--color-total_income)"
                radius={4}
              />
              <Bar
                dataKey="service_count"
                fill="var(--color-service_count)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
