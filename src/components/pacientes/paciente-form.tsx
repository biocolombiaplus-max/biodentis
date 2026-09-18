"use client";

import { useActionState } from "react";
import { crearPacienteAction, actualizarPacienteAction, type FormState } from "@/lib/pacientes/actions";
import type { Paciente } from "@prisma/client";

const initialState: FormState = {};

const DEPARTAMENTOS = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá", "Caldas", "Caquetá",
  "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Bogotá D.C.", "Guainía",
  "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta", "Nariño", "Norte de Santander",
  "Putumayo", "Quindío", "Risaralda", "San Andrés y Providencia", "Santander", "Sucre",
  "Tolima", "Valle del Cauca", "Vaupés", "Vichada",
];

function toDateInputValue(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

export function PacienteForm({ paciente }: { paciente?: Paciente }) {
  const action = paciente ? actualizarPacienteAction : crearPacienteAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  const input = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20";
  const label = "mb-1 block text-sm font-medium text-slate-700";

  return (
    <form action={formAction} className="space-y-8">
      {paciente ? <input type="hidden" name="id" value={paciente.id} /> : null}

      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-bold text-[var(--brand-accent)]">Identificación</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label>
            <span className={label}>Tipo de documento</span>
            <select name="tipoDocumento" defaultValue={paciente?.tipoDocumento ?? "CC"} className={input}>
              <option value="CC">Cédula de ciudadanía</option>
              <option value="TI">Tarjeta de identidad</option>
              <option value="RC">Registro civil</option>
              <option value="CE">Cédula de extranjería</option>
              <option value="PA">Pasaporte</option>
              <option value="PEP">Permiso especial de permanencia</option>
              <option value="MS">Menor sin identificación</option>
              <option value="AS">Adulto sin identificación</option>
              <option value="CN">Certificado nacido vivo</option>
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className={label}>Número de documento</span>
            <input name="numeroDocumento" required defaultValue={paciente?.numeroDocumento} className={input} />
          </label>

          <label>
            <span className={label}>Primer nombre</span>
            <input name="primerNombre" required defaultValue={paciente?.primerNombre} className={input} />
          </label>
          <label>
            <span className={label}>Segundo nombre</span>
            <input name="segundoNombre" defaultValue={paciente?.segundoNombre ?? ""} className={input} />
          </label>
          <label>
            <span className={label}>Fecha de nacimiento</span>
            <input
              type="date"
              name="fechaNacimiento"
              required
              defaultValue={paciente ? toDateInputValue(paciente.fechaNacimiento) : ""}
              className={input}
            />
          </label>

          <label>
            <span className={label}>Primer apellido</span>
            <input name="primerApellido" required defaultValue={paciente?.primerApellido} className={input} />
          </label>
          <label>
            <span className={label}>Segundo apellido</span>
            <input name="segundoApellido" defaultValue={paciente?.segundoApellido ?? ""} className={input} />
          </label>
          <label>
            <span className={label}>Sexo</span>
            <select name="sexo" defaultValue={paciente?.sexo ?? "F"} className={input}>
              <option value="F">Femenino</option>
              <option value="M">Masculino</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-bold text-[var(--brand-accent)]">Afiliación en salud</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label>
            <span className={label}>Régimen de afiliación</span>
            <select name="regimenAfiliacion" defaultValue={paciente?.regimenAfiliacion ?? "PARTICULAR"} className={input}>
              <option value="CONTRIBUTIVO">Contributivo</option>
              <option value="SUBSIDIADO">Subsidiado</option>
              <option value="ESPECIAL">Especial</option>
              <option value="EXCEPCION">Excepción</option>
              <option value="PARTICULAR">Particular</option>
              <option value="NO_ASEGURADO">No asegurado</option>
            </select>
          </label>
          <label>
            <span className={label}>EPS</span>
            <input name="eps" defaultValue={paciente?.eps ?? ""} className={input} />
          </label>
          <label>
            <span className={label}>Zona de residencia</span>
            <select name="zonaResidencia" defaultValue={paciente?.zonaResidencia ?? "U"} className={input}>
              <option value="U">Urbana</option>
              <option value="R">Rural</option>
            </select>
          </label>
          <label>
            <span className={label}>Departamento</span>
            <input list="departamentos" name="departamento" defaultValue={paciente?.departamento ?? ""} className={input} />
            <datalist id="departamentos">
              {DEPARTAMENTOS.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </label>
          <label>
            <span className={label}>Municipio</span>
            <input name="municipio" defaultValue={paciente?.municipio ?? ""} className={input} />
          </label>
          <label>
            <span className={label}>Grupo étnico</span>
            <input name="grupoEtnico" defaultValue={paciente?.grupoEtnico ?? ""} className={input} />
          </label>
          <label>
            <span className={label}>Discapacidad</span>
            <input name="discapacidad" defaultValue={paciente?.discapacidad ?? ""} className={input} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-bold text-[var(--brand-accent)]">Contacto</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label>
            <span className={label}>Dirección</span>
            <input name="direccion" defaultValue={paciente?.direccion ?? ""} className={input} />
          </label>
          <label>
            <span className={label}>Teléfono fijo</span>
            <input name="telefono" defaultValue={paciente?.telefono ?? ""} className={input} />
          </label>
          <label>
            <span className={label}>Celular</span>
            <input name="celular" defaultValue={paciente?.celular ?? ""} className={input} />
          </label>
          <label>
            <span className={label}>Correo electrónico</span>
            <input type="email" name="email" defaultValue={paciente?.email ?? ""} className={input} />
          </label>
          <label>
            <span className={label}>Ocupación</span>
            <input name="ocupacion" defaultValue={paciente?.ocupacion ?? ""} className={input} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-bold text-[var(--brand-accent)]">Acudiente (si aplica: menores de edad)</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label>
            <span className={label}>Nombre del acudiente</span>
            <input name="acudienteNombre" defaultValue={paciente?.acudienteNombre ?? ""} className={input} />
          </label>
          <label>
            <span className={label}>Teléfono del acudiente</span>
            <input name="acudienteTelefono" defaultValue={paciente?.acudienteTelefono ?? ""} className={input} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--brand-primary)]/20 bg-[var(--brand-mist)] p-6">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="habeasDataAceptado"
            defaultChecked={paciente?.habeasDataAceptado ?? false}
            className="mt-1"
          />
          <span className="text-sm text-slate-700">
            El paciente (o su acudiente) autoriza el tratamiento de sus datos personales y su historia clínica de
            acuerdo con la Ley 1581 de 2012 y la política de tratamiento de datos del consultorio.
          </span>
        </label>
      </section>

      {state.error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="brand-gradient rounded-xl px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Guardando..." : paciente ? "Guardar cambios" : "Registrar paciente"}
      </button>
    </form>
  );
}
