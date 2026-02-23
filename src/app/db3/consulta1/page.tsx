// app/components/BIReportsServer.tsx
import { db3 } from "@/lib/db3";
import BIReportsChart from "./BIReportsChart";

export type ReportClientesData = {
  mes: string;
  internos: number;
  externos: number;
};
export type ReportPacientesData = {
  especialidad: string;
  gestion: number;
  pacientes: number;
};
export type ReportEspecialidadesData = {
  enfermedad: string;
  especialidad: string;
  gestion: number;
  count: number;
};

// ======================
// CONSULTAS CORREGIDAS
// ======================

// 1️⃣ Diferencia de clientes internos vs externos por mes
async function getReportClientes(): Promise<ReportClientesData[]> {
  const result = await db3.query(`
    SELECT 
      TO_CHAR(fecha_registro,'YYYY-MM') AS mes,
      COUNT(*) FILTER (WHERE tipo_persona IN ('ADMIN','MEDICO','ENFERMERO')) AS internos,
      COUNT(*) FILTER (WHERE tipo_persona='PACIENTE') AS externos
    FROM personas
    GROUP BY TO_CHAR(fecha_registro,'YYYY-MM')
    ORDER BY mes;
  `);

  return result.rows.map((r: any) => ({
    mes: r.mes,
    internos: parseInt(r.internos),
    externos: parseInt(r.externos),
  }));
}

// 2️⃣ Cantidad de pacientes atendidos por especialidad y gestión
async function getReportPacientesEspecialidad(): Promise<
  ReportPacientesData[]
> {
  const result = await db3.query(`
    SELECT 
      s.nombre AS especialidad,
      EXTRACT(YEAR FROM a.fecha_atencion) AS gestion,
      COUNT(DISTINCT a.id_paciente) AS pacientes
    FROM atenciones a
    JOIN citas c ON a.id_cita = c.id_cita
    JOIN servicios s ON c.id_servicio = s.id_servicio
    GROUP BY s.nombre, EXTRACT(YEAR FROM a.fecha_atencion)
    ORDER BY gestion, especialidad;
  `);

  return result.rows.map((r: any) => ({
    especialidad: r.especialidad,
    gestion: parseInt(r.gestion),
    pacientes: parseInt(r.pacientes),
  }));
}

// 3️⃣ Especialidades que diagnosticaron una misma enfermedad por gestión
async function getReportEspecialidadesEnfermedad(): Promise<
  ReportEspecialidadesData[]
> {
  const result = await db3.query(`
    SELECT 
      d.nombre AS enfermedad,
      s.nombre AS especialidad,
      EXTRACT(YEAR FROM a.fecha_atencion) AS gestion,
      COUNT(a.id_atencion) AS count
    FROM diagnosticos d
    JOIN diagnosticos_atencion da ON d.id_diagnostico = da.id_diagnostico
    JOIN atenciones a ON da.id_atencion = a.id_atencion
    JOIN citas c ON a.id_cita = c.id_cita
    JOIN servicios s ON c.id_servicio = s.id_servicio
    GROUP BY d.nombre, s.nombre, EXTRACT(YEAR FROM a.fecha_atencion)
    ORDER BY gestion, enfermedad, especialidad;
  `);

  return result.rows.map((r: any) => ({
    enfermedad: r.enfermedad,
    especialidad: r.especialidad,
    gestion: parseInt(r.gestion),
    count: parseInt(r.count),
  }));
}

// ======================
// SERVER COMPONENT
// ======================
export default async function BIReportsServer() {
  const [reportClientes, reportPacientes, reportEspecialidades] =
    await Promise.all([
      getReportClientes(),
      getReportPacientesEspecialidad(),
      getReportEspecialidadesEnfermedad(),
    ]);

  return (
    <BIReportsChart
      reportClientes={reportClientes}
      reportPacientes={reportPacientes}
      reportEspecialidades={reportEspecialidades}
    />
  );
}
