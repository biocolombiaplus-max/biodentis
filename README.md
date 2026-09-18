# BioDentis

Software de gestión para consultorios odontológicos en Colombia: landing page personalizable, historia clínica digital, odontograma, consentimientos informados con firma electrónica, agenda, facturación, generación de archivos RIPS y un asistente de inteligencia artificial de apoyo clínico y administrativo.

Este repositorio está pensado para desplegarse **una instancia por consultorio**: cada instalación tiene su propia base de datos, su propia marca (logo, colores, textos e imágenes) y sus propios usuarios.

## Puesta en marcha

Necesitas una base de datos PostgreSQL corriendo (local, Docker, o un servicio como Neon/Supabase/Vercel Postgres).

```bash
npm install
cp .env.example .env   # ajusta DATABASE_URL, SESSION_SECRET y NEXT_PUBLIC_APP_URL
npx prisma migrate dev --name init
npm run db:seed        # crea un consultorio, un admin y datos de ejemplo
npm run dev
```

Credenciales del consultorio de ejemplo (cámbialas o crea las tuyas antes de producción):

- URL: `http://localhost:3000`
- Panel del consultorio / administración: `http://localhost:3000/login`
- Usuario: `admin@sonrisasana.com.co`
- Contraseña: `BioDentis2026*`

## Stack técnico

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** con un sistema de marca fucsia personalizable por consultorio (variables CSS `--brand-*`, editables desde `/admin/marca`)
- **Prisma ORM** + **PostgreSQL** (funciona con cualquier proveedor: Neon, Vercel Postgres, Supabase, RDS, un Postgres propio, etc.)
- **jose** para sesiones firmadas (JWT en cookie httpOnly) y **bcryptjs** para contraseñas
- **@anthropic-ai/sdk** para el asistente de inteligencia artificial (Claude)

## Estructura principal

```
src/app/                  → páginas (App Router)
  (landing) "/"           → landing pública, contenido editable desde /admin
  /login                  → acceso de usuarios del consultorio
  /admin/*                → panel de personalización (solo rol ADMIN)
  /app/*                  → panel clínico/administrativo (usuarios autenticados)
  /firmar/[token]         → firma remota de consentimientos (pública, sin login)
  /api/*                  → endpoints auxiliares (ej. autocompletar pacientes)
src/lib/                  → lógica de negocio, acciones de servidor y acceso a datos
src/components/           → UI reutilizable (landing, admin, pacientes, historias, etc.)
prisma/schema.prisma      → modelo de datos completo
prisma/seed.ts            → datos de ejemplo (clínica, plan, paciente, plantillas)
```

## Personalización (marca blanca)

Desde `/admin` (rol ADMIN) se puede configurar, sin tocar código:

- Logo, favicon y datos de contacto del consultorio
- Colores de marca (primario, secundario, acento) — se aplican a toda la app vía variables CSS
- Título, subtítulo e imagen de fondo de cada sección de la landing
- Planes y precios mostrados en la landing
- Testimonios (reemplaza los de ejemplo por opiniones reales antes de publicar)

Las imágenes subidas se guardan automáticamente en **Vercel Blob** si la variable `BLOB_READ_WRITE_TOKEN` está configurada; si no, caen a `public/uploads` (válido para correr en tu propio servidor, pero no en plataformas serverless con disco efímero).

## Despliegue en Vercel

1. **Sube el repositorio a GitHub** (ya está en `biocolombiaplus-max/biodentis`, rama `claude/dazzling-hawking-1bz49b` o la que uses como base).
2. **Crea una base de datos Postgres.** La forma más simple: en el dashboard de Vercel, ve a **Storage → Create Database → Postgres** (usa Neon por debajo) y conéctala a tu proyecto — esto agrega automáticamente `DATABASE_URL` a las variables de entorno. También puedes usar Neon, Supabase o cualquier Postgres externo y pegar tú mismo la connection string.
3. **Crea un Blob store** para que los logos e imágenes que se suban desde `/admin` persistan: **Storage → Create Database → Blob**, conéctalo al proyecto (agrega `BLOB_READ_WRITE_TOKEN` automáticamente).
4. **Importa el proyecto en Vercel:** [vercel.com/new](https://vercel.com/new) → "Import Git Repository" → selecciona `biocolombiaplus-max/biodentis` → Framework detectado: Next.js (no cambies nada del build command, ya está configurado en `package.json` para correr `prisma generate && prisma migrate deploy && next build`).
5. **Variables de entorno** (Project Settings → Environment Variables), además de las que Vercel ya agregó por los pasos 2 y 3:
   - `SESSION_SECRET`: una cadena aleatoria larga (por ejemplo, generada con `openssl rand -base64 32`).
   - `NEXT_PUBLIC_APP_URL`: la URL pública que te asigne Vercel (ej. `https://tu-consultorio.vercel.app`) — se usa para armar los enlaces de firma remota de consentimientos. Puedes dejarla vacía en el primer deploy y actualizarla después con la URL real (requiere un redeploy para tomar efecto).
   - `ANTHROPIC_API_KEY` (opcional): actívala si quieres el asistente de IA.
6. **Deploy.** Vercel instala dependencias, corre las migraciones contra tu base de datos y compila la app.
7. **Carga los datos de tu consultorio real** (una sola vez): con `DATABASE_URL` de producción en tu `.env` local, corre `npm run db:seed` para tener una clínica de partida, o mejor aún, edita `prisma/seed.ts` con el nombre, NIT, colores y el usuario administrador reales de tu cliente antes de correrlo, así el primer login ya es el definitivo.
8. Entra a `https://tu-dominio/admin` con el usuario creado y personaliza logo, colores, textos y planes desde ahí — no hace falta volver a tocar código ni redeploy para eso.

Cada vez que hagas `git push` a la rama conectada, Vercel vuelve a desplegar automáticamente (y vuelve a correr `prisma migrate deploy`, aplicando solo las migraciones nuevas).

## Cumplimiento normativo — qué cubre esta base y qué falta validar

Este software fue diseñado teniendo en cuenta la normativa colombiana vigente, pero **no reemplaza la revisión de un asesor legal/de calidad en salud** antes de operar un consultorio real. Resumen de cobertura:

### Historia clínica — Resolución 3100 de 2019
El modelo `HistoriaClinica` (`prisma/schema.prisma`) incluye los contenidos mínimos exigidos: identificación del prestador y del profesional, motivo de consulta, enfermedad actual, antecedentes, examen clínico (extraoral/intraoral y odontograma), diagnósticos (CIE-10), plan de tratamiento, procedimientos realizados (CUPS), evolución/observaciones y firma del profesional. Una vez firmada (`firmadaEn` + `bloqueada = true`) el registro queda protegido en la capa de aplicación para no modificarse, en línea con el principio de integridad de la historia clínica.

**Pendiente antes de producción:** definir la política de retención y custodia (mínimo 15 años según normativa vigente), backups cifrados fuera del servidor de aplicación, y pistas de auditoría más detalladas (quién accedió, cuándo) si el volumen de pacientes lo amerita.

### Consentimiento informado y Habeas Data — Ley 23 de 1981, Ley 1581 de 2012
- El módulo de consentimientos permite firma en el dispositivo del consultorio o firma remota por enlace único (`ConsentimientoInformado.tokenFirmaRemota`), con registro de fecha, IP y dispositivo como evidencia.
- El registro de paciente exige explícitamente marcar la autorización de tratamiento de datos (`habeasDataAceptado`) antes de operar.

**Pendiente:** publicar una política de tratamiento de datos propia del consultorio (texto legal) y enlazarla desde el formulario de aceptación; hoy el campo es un booleano de control interno.

### RIPS — Resolución 866 de 2021 y normativa relacionada
`src/lib/rips/generar.ts` genera archivos planos base (AC – consultas, AP – procedimientos, US – usuarios atendidos) a partir de las historias clínicas del periodo. La estructura de columnas sigue el esquema general histórico de RIPS.

**Importante:** el anexo técnico de RIPS ha tenido varias actualizaciones (incluida la transición hacia reporte por servicio web contemplada en la Resolución 2275 de 2023). **Valida la estructura exacta de campos contra el anexo técnico vigente del Ministerio de Salud y, si aplica, contra el mecanismo de reporte de tu EPS/IPS de referencia antes de reportar oficialmente.** Esta funcionalidad debe tratarse como punto de partida, no como certificación de cumplimiento.

### Facturación electrónica — DIAN
El módulo de facturación (`Factura`) genera un documento equivalente interno con numeración consecutiva por consultorio. **No está integrado con un proveedor tecnológico autorizado por la DIAN** ni genera CUFE/firma electrónica válida ante la autoridad tributaria: el campo `cufe` existe en el modelo para cuando se conecte un proveedor de facturación electrónica habilitado. Antes de facturar oficialmente, integra un proveedor autorizado (o su API) y ajusta este módulo para consumirlo.

### Interoperabilidad de historia clínica — HL7 FHIR
La base de datos está modelada de forma que cada historia clínica, paciente y procedimiento puede mapearse a recursos FHIR estándar (`Patient`, `Encounter`, `Condition`, `Procedure`, `Observation`). Aún no incluye un endpoint FHIR ni el conector al sistema nacional de interoperabilidad; es el siguiente paso natural para cumplir con los lineamientos de interoperabilidad de historia clínica electrónica cuando el consultorio esté listo para conectarse a la red.

## Asistente de inteligencia artificial

El asistente (`src/lib/ai`) usa la API de Claude (Anthropic) para sugerir posibles códigos CIE-10 y ayudar a redactar evoluciones clínicas a partir de notas breves del odontólogo. Está apagado por defecto: actívalo configurando `ANTHROPIC_API_KEY` en `.env`. Las sugerencias siempre deben ser revisadas por el profesional responsable de la atención — así se indica explícitamente en la interfaz.

## Planes y precios

Los 4 planes (`Básico`, `Profesional` — recomendado, `Clínica`, `Red de Clínicas`) están pensados para el mercado colombiano de consultorios pequeños y medianos, con precios en pesos colombianos y descuento por pago anual. Se editan desde `/admin/planes` sin tocar código.

## Próximos pasos sugeridos

1. Integrar un proveedor de facturación electrónica autorizado por la DIAN.
2. Validar y ajustar el generador de RIPS contra el anexo técnico vigente.
3. Sumar autenticación de dos factores para el rol ADMIN.
4. Publicar la política de tratamiento de datos personales y de habeas data del consultorio.
5. Si vas a operar varios consultorios distintos, evalúa mover de "una instancia por consultorio" a un modelo multi-tenant real (hoy cada instalación asume una sola clínica activa).
