// ===============================
// ENUMS
// ===============================
export type Genero = "M" | "F" | "OTRO";
export type TipoPersona = "PACIENTE" | "MEDICO" | "ADMIN" | "ENFERMERO";

export type TipoServicio =
  | "CONSULTA"
  | "CIRUGIA"
  | "LABORATORIO"
  | "IMAGEN"
  | "HOSPITALIZACION"
  | "EMERGENCIA";

export type EstadoCita =
  | "PROGRAMADA"
  | "CONFIRMADA"
  | "COMPLETADA"
  | "CANCELADA"
  | "NO_ASISTIO";

export type TipoCita = "PRIMERA_VEZ" | "CONTROL" | "EMERGENCIA" | "CIRUGIA";

export type TipoDiagnosticoAtencion =
  | "PRINCIPAL"
  | "SECUNDARIO"
  | "COMPLICACION";

export type TipoDiagnostico = "PRESUNTIVO" | "DEFINITIVO";

export type Pronostico = "FAVORABLE" | "RESERVADO" | "GRAVE";

export type TipoAusencia =
  | "INCAPACIDAD"
  | "VACACIONES"
  | "LICENCIA"
  | "PERMISO";

export type EstadoAusencia = "APROBADO" | "PENDIENTE" | "RECHAZADO";

export type EstadoPago = "PAGADO" | "PENDIENTE" | "ANULADO";

export type MetodoPago = "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";

// ===============================
// 1. PERSONAS
// ===============================
export interface Persona {
  id_persona: string;
  tipo_documento: string | null;
  numero_documento: string;
  nombre_completo: string;
  fecha_nacimiento: string | null;
  genero: Genero | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  tipo_persona: TipoPersona | null;
  activo: boolean;
  fecha_registro: string;
}

// ===============================
// 2. PERSONAL MÉDICO
// ===============================
export interface PersonalMedico {
  id_personal: string;
  id_persona: string;
  codigo_empleado: string;
  especialidad: string | null;
  cargo: string | null;
  numero_colegiatura: string | null;
  fecha_ingreso: string | null;
  salario_base: string | null;
  activo: boolean;
}

// ===============================
// 3. PACIENTES
// ===============================
export interface Paciente {
  id_paciente: string;
  id_persona: string;
  numero_historia_clinica: string;
  tipo_seguro: string | null;
  alergias: string | null;
  enfermedades_cronicas: string | null;
  antecedentes_quirurgicos: string | null;
  fecha_registro: string;
}

// ===============================
// 4. DIAGNOSTICOS
// ===============================
export interface Diagnostico {
  id_diagnostico: string;
  codigo_cie10: string | null;
  nombre: string;
  categoria: string | null;
  es_cronico: boolean;
  es_quirurgico: boolean;
  es_infeccioso: boolean;
}

// ===============================
// 5. SERVICIOS
// ===============================
export interface Servicio {
  id_servicio: string;
  codigo: string;
  nombre: string;
  tipo: TipoServicio | null;
  especialidad: string | null;
  costo: string;
  duracion_minutos: number | null;
}

// ===============================
// 6. CITAS
// ===============================
export interface Cita {
  id_cita: string;
  id_paciente: string;
  id_personal: string;
  id_servicio: string;
  fecha_cita: string;
  hora_cita: string;
  estado: EstadoCita | null;
  tipo_cita: TipoCita | null;
  fecha_solicitud: string;
  motivo_consulta: string | null;
}

// ===============================
// 7. ATENCIONES
// ===============================
export interface Atencion {
  id_atencion: string;
  id_cita: string | null;
  id_paciente: string;
  id_medico: string;
  fecha_atencion: string;
  diagnostico_principal: string | null;
  tipo_diagnostico: TipoDiagnostico | null;
  plan_tratamiento: string | null;
  requiere_cirugia: boolean;
  es_emergencia: boolean;
  pronostico: Pronostico | null;
}

// ===============================
// 8. DIAGNOSTICOS_ATENCION
// ===============================
export interface DiagnosticoAtencion {
  id_atencion: string;
  id_diagnostico: string;
  tipo: TipoDiagnosticoAtencion | null;
}

// ===============================
// 9. PROCEDIMIENTOS
// ===============================
export interface Procedimiento {
  id_procedimiento: string;
  id_atencion: string;
  id_servicio: string;
  id_paciente: string;
  id_cirujano: string | null;
  fecha_procedimiento: string;
  diagnostico_asociado: string | null;
  resultado: string | null;
  complicaciones: string | null;
  tiempo_quirurgico_minutos: number | null;
}

// ===============================
// 10. PRESCRIPCIONES
// ===============================
export interface Prescripcion {
  id_prescripcion: string;
  id_atencion: string;
  id_paciente: string;
  id_medico: string;
  medicamento: string;
  dosis: string | null;
  frecuencia: string | null;
  duracion_dias: number | null;
  fecha_prescripcion: string;
}

// ===============================
// 11. AUSENCIAS
// ===============================
export interface Ausencia {
  id_ausencia: string;
  id_personal: string;
  fecha_inicio: string;
  fecha_fin: string;
  tipo: TipoAusencia | null;
  diagnostico_asociado: string | null;
  motivo: string | null;
  estado: EstadoAusencia | null;
}

// ===============================
// 12. FACTURACION
// ===============================
export interface Factura {
  id_factura: string;
  id_paciente: string;
  id_atencion: string | null;
  id_servicio: string | null;
  fecha_emision: string;
  monto_total: string;
  estado_pago: EstadoPago | null;
  metodo_pago: MetodoPago | null;
}
