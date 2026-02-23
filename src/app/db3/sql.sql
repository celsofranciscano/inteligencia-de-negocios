-- ==============================================
-- SISTEMA DE GESTIÓN CLÍNICA - CORE 12 TABLAS GRUPO 3
-- PostgreSQL 16
-- ==============================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =================================================
-- 1. PERSONAS
-- =================================================
CREATE TABLE personas (
    id_persona UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_documento VARCHAR(20),
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    nombre_completo VARCHAR(200) NOT NULL,
    fecha_nacimiento DATE,
    genero VARCHAR(10) CHECK (genero IN ('M','F','OTRO')),
    telefono VARCHAR(20),
    email VARCHAR(255),
    direccion TEXT,
    tipo_persona VARCHAR(20) CHECK (tipo_persona IN ('PACIENTE','MEDICO','ADMIN','ENFERMERO')),
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- =================================================
-- 2. PERSONAL MÉDICO
-- =================================================
CREATE TABLE personal_medico (
    id_personal UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_persona UUID NOT NULL UNIQUE,
    codigo_empleado VARCHAR(50) UNIQUE NOT NULL,
    especialidad VARCHAR(150),
    cargo VARCHAR(100),
    numero_colegiatura VARCHAR(50),
    fecha_ingreso DATE,
    salario_base DECIMAL(12,2),
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_personal_persona
        FOREIGN KEY (id_persona)
        REFERENCES personas(id_persona)
        ON DELETE CASCADE
);

-- =================================================
-- 3. PACIENTES
-- =================================================
CREATE TABLE pacientes (
    id_paciente UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_persona UUID NOT NULL UNIQUE,
    numero_historia_clinica VARCHAR(50) UNIQUE NOT NULL,
    tipo_seguro VARCHAR(50),
    alergias TEXT,
    enfermedades_cronicas TEXT,
    antecedentes_quirurgicos TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_paciente_persona
        FOREIGN KEY (id_persona)
        REFERENCES personas(id_persona)
        ON DELETE CASCADE
);

-- =================================================
-- 4. DIAGNOSTICOS
-- =================================================
CREATE TABLE diagnosticos (
    id_diagnostico UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_cie10 VARCHAR(20),
    nombre VARCHAR(500) NOT NULL,
    categoria VARCHAR(100),
    es_cronico BOOLEAN DEFAULT FALSE,
    es_quirurgico BOOLEAN DEFAULT FALSE,
    es_infeccioso BOOLEAN DEFAULT FALSE
);

-- =================================================
-- 5. SERVICIOS
-- =================================================
CREATE TABLE servicios (
    id_servicio UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    tipo VARCHAR(30) CHECK (tipo IN 
        ('CONSULTA','CIRUGIA','LABORATORIO','IMAGEN','HOSPITALIZACION','EMERGENCIA')),
    especialidad VARCHAR(150),
    costo DECIMAL(12,2) NOT NULL,
    duracion_minutos INTEGER
);

-- =================================================
-- 6. CITAS
-- =================================================
CREATE TABLE citas (
    id_cita UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_paciente UUID NOT NULL,
    id_personal UUID NOT NULL,
    id_servicio UUID NOT NULL,
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    estado VARCHAR(20) CHECK (estado IN 
        ('PROGRAMADA','CONFIRMADA','COMPLETADA','CANCELADA','NO_ASISTIO')),
    tipo_cita VARCHAR(20) CHECK (tipo_cita IN 
        ('PRIMERA_VEZ','CONTROL','EMERGENCIA','CIRUGIA')),
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo_consulta TEXT,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    FOREIGN KEY (id_personal) REFERENCES personal_medico(id_personal),
    FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio)
);

-- =================================================
-- 7. ATENCIONES
-- =================================================
CREATE TABLE atenciones (
    id_atencion UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_cita UUID,
    id_paciente UUID NOT NULL,
    id_medico UUID NOT NULL,
    fecha_atencion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diagnostico_principal UUID,
    tipo_diagnostico VARCHAR(20) CHECK (tipo_diagnostico IN ('PRESUNTIVO','DEFINITIVO')),
    plan_tratamiento TEXT,
    requiere_cirugia BOOLEAN DEFAULT FALSE,
    es_emergencia BOOLEAN DEFAULT FALSE,
    pronostico VARCHAR(20) CHECK (pronostico IN ('FAVORABLE','RESERVADO','GRAVE')),
    FOREIGN KEY (id_cita) REFERENCES citas(id_cita),
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    FOREIGN KEY (id_medico) REFERENCES personal_medico(id_personal),
    FOREIGN KEY (diagnostico_principal) REFERENCES diagnosticos(id_diagnostico)
);

-- =================================================
-- 8. DIAGNOSTICOS_ATENCION (N:M)
-- =================================================
CREATE TABLE diagnosticos_atencion (
    id_atencion UUID NOT NULL,
    id_diagnostico UUID NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('PRINCIPAL','SECUNDARIO','COMPLICACION')),
    PRIMARY KEY (id_atencion, id_diagnostico),
    FOREIGN KEY (id_atencion) REFERENCES atenciones(id_atencion) ON DELETE CASCADE,
    FOREIGN KEY (id_diagnostico) REFERENCES diagnosticos(id_diagnostico)
);

-- =================================================
-- 9. PROCEDIMIENTOS
-- =================================================
CREATE TABLE procedimientos (
    id_procedimiento UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_atencion UUID NOT NULL,
    id_servicio UUID NOT NULL,
    id_paciente UUID NOT NULL,
    id_cirujano UUID,
    fecha_procedimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diagnostico_asociado UUID,
    resultado TEXT,
    complicaciones TEXT,
    tiempo_quirurgico_minutos INTEGER,
    FOREIGN KEY (id_atencion) REFERENCES atenciones(id_atencion),
    FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio),
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    FOREIGN KEY (id_cirujano) REFERENCES personal_medico(id_personal),
    FOREIGN KEY (diagnostico_asociado) REFERENCES diagnosticos(id_diagnostico)
);

-- =================================================
-- 10. PRESCRIPCIONES
-- =================================================
CREATE TABLE prescripciones (
    id_prescripcion UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_atencion UUID NOT NULL,
    id_paciente UUID NOT NULL,
    id_medico UUID NOT NULL,
    medicamento VARCHAR(300) NOT NULL,
    dosis VARCHAR(100),
    frecuencia VARCHAR(100),
    duracion_dias INTEGER,
    fecha_prescripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_atencion) REFERENCES atenciones(id_atencion),
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    FOREIGN KEY (id_medico) REFERENCES personal_medico(id_personal)
);

-- =================================================
-- 11. AUSENCIAS
-- =================================================
CREATE TABLE ausencias (
    id_ausencia UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_personal UUID NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    tipo VARCHAR(30) CHECK (tipo IN ('INCAPACIDAD','VACACIONES','LICENCIA','PERMISO')),
    diagnostico_asociado UUID,
    motivo TEXT,
    estado VARCHAR(20) CHECK (estado IN ('APROBADO','PENDIENTE','RECHAZADO')),
    FOREIGN KEY (id_personal) REFERENCES personal_medico(id_personal),
    FOREIGN KEY (diagnostico_asociado) REFERENCES diagnosticos(id_diagnostico)
);

-- =================================================
-- 12. FACTURACION
-- =================================================
CREATE TABLE facturacion (
    id_factura UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_paciente UUID NOT NULL,
    id_atencion UUID,
    id_servicio UUID,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    monto_total DECIMAL(12,2) NOT NULL,
    estado_pago VARCHAR(20) CHECK (estado_pago IN ('PAGADO','PENDIENTE','ANULADO')),
    metodo_pago VARCHAR(30) CHECK (metodo_pago IN ('EFECTIVO','TARJETA','TRANSFERENCIA')),
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    FOREIGN KEY (id_atencion) REFERENCES atenciones(id_atencion),
    FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio)
);

-- =================================================
-- ÍNDICES PARA ANÁLISIS Y RENDIMIENTO
-- =================================================
CREATE INDEX idx_citas_fecha ON citas(fecha_cita);
CREATE INDEX idx_atenciones_fecha ON atenciones(fecha_atencion);
CREATE INDEX idx_facturacion_fecha ON facturacion(fecha_emision);
CREATE INDEX idx_diagnostico_categoria ON diagnosticos(categoria);