"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Props {
  reportClientes: { mes: string; internos: number; externos: number }[];
  reportPacientes: {
    especialidad: string;
    gestion: number;
    pacientes: number;
  }[];
  reportEspecialidades: {
    enfermedad: string;
    especialidad: string;
    gestion: number;
    count: number;
  }[];
}

export default function BIReportsChart({
  reportClientes,
  reportPacientes,
  reportEspecialidades,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 p-6">
      {/* CLIENTES INTERNOS vs EXTERNOS */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes internos vs externos por mes</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart width={800} height={300} data={reportClientes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="internos" fill="#4ade80" />
            <Bar dataKey="externos" fill="#60a5fa" />
          </BarChart>
        </CardContent>
      </Card>

      {/* PACIENTES POR ESPECIALIDAD */}
      <Card>
        <CardHeader>
          <CardTitle>
            Pacientes atendidos por especialidad (por gestión)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart width={800} height={300} data={reportPacientes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="especialidad" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pacientes" fill="#facc15" />
          </BarChart>
        </CardContent>
      </Card>

      {/* ESPECIALIDADES POR ENFERMEDAD */}
      <Card>
        <CardHeader>
          <CardTitle>
            Especialidades que diagnosticaron la misma enfermedad (por gestión)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart width={800} height={400} data={reportEspecialidades}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="enfermedad" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#f87171" />
          </BarChart>
        </CardContent>
      </Card>
    </div>
  );
}
