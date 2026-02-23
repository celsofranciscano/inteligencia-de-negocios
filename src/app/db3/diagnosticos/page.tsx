// app/components/BIReportsServer.tsx
import { db3 } from "@/lib/db3";
import BIReportsChart from "./BIReportsChart";

export type Report1Data = { servicio: string; count: number };
export type Report2Data = { paciente_id: number; atenciones: number };
export type Report3Data = {
  diagnosis: string;
  total_income: number;
  service_count: number;
};

async function getReport1(): Promise<Report1Data[]> {
  const result = await db3.query(`
    SELECT s.nombre AS servicio, COUNT(a.id_atencion) AS count
    FROM atenciones a
    JOIN citas c ON a.id_cita = c.id_cita
    JOIN servicios s ON c.id_servicio = s.id_servicio
    GROUP BY s.nombre
    ORDER BY count DESC
   LIMIT 1000
  `);

  return result.rows.map((r: any) => ({
    servicio: r.servicio,
    count: parseInt(r.count, 10),
  }));
}

async function getReport2(): Promise<Report2Data[]> {
  const result = await db3.query(`
    SELECT p.id_paciente AS paciente_id, COUNT(a.id_atencion) AS atenciones
    FROM pacientes p
    LEFT JOIN atenciones a ON p.id_paciente = a.id_paciente
    GROUP BY p.id_paciente
    ORDER BY atenciones DESC
   LIMIT 1000
  `);

  return result.rows.map((r: any) => ({
    paciente_id: r.paciente_id,
    atenciones: parseInt(r.atenciones, 10),
  }));
}
async function getReport3(): Promise<Report3Data[]> {
  const result = await db3.query(`
    SELECT d.nombre AS diagnosis,
           SUM(f.monto_total) AS total_income,
           COUNT(a.id_atencion) AS service_count
    FROM facturacion f
    JOIN atenciones a ON f.id_atencion = a.id_atencion
    JOIN diagnosticos_atencion da ON a.id_atencion = da.id_atencion
    JOIN diagnosticos d ON da.id_diagnostico = d.id_diagnostico
    GROUP BY d.nombre
    ORDER BY total_income DESC
   LIMIT 1000
  `);

  return result.rows.map((r: any) => ({
    diagnosis: r.diagnosis,
    total_income: parseFloat(r.total_income),
    service_count: parseInt(r.service_count, 10),
  }));
}

export default async function BIReportsServer() {
  const [report1, report2, report3] = await Promise.all([
    getReport1(),
    getReport2(),
    getReport3(),
  ]);

  return (
    <BIReportsChart report1={report1} report2={report2} report3={report3} />
  );
}
