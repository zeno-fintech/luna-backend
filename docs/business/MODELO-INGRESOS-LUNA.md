# 💰 LUNA - Modelo de Ingresos y Planes

Este documento describe:
- Fuentes de ingresos principales y secundarias.
- Cómo se diferencian los **planes para usuarios finales** vs **planes para tenants/partners/empresas**.
- Ideas de monetización adicional (publicidad, partnerships, etc.).

---

## 1. Visión General de Monetización

LUNA es un **SaaS multi-tenant B2B2C** con 3 grandes tipos de clientes:

1. **Usuarios finales** (personas/colaboradores) → Nivel 3.
2. **Marcas propias / Tenants directos** (ej: `lunafinance.com`, `finanzasfacil.cl`).
3. **Partners / Empresas** (B2B2C y empresas que usan LUNA para sus usuarios/clientes).

El modelo de ingresos combina:
- **Suscripciones** (mensuales/anuales).
- **Cobros por volumen de usuarios**.
- **Servicios adicionales** (setup, integración, desarrollo custom).
- **Publicidad/afiliados** (especialmente en planes gratuitos).

---

## 2. Planes para Usuarios Finales (Nivel 3)

Estos son los planes que ve una persona normal al entrar a la app/web de LUNA (marca propia).

### 2.1 Estructura base de planes

Ejemplo de 3 niveles:

- **Plan Free**
  - Precio: $0
  - Objetivo: máxima adopción, generación de datos, funnel hacia planes pagados.
  - Incluye:
    - Registro de ingresos/gastos manuales.
    - 1 sistema financiero individual.
    - Presupuesto básico.
    - Reportes simples mensuales.
    - Publicidad NO intrusiva.

- **Plan Premium** (medio)
  - Precio: ~US$3–5/mes (o equivalente local).
  - Objetivo: monetizar usuarios con necesidades medias.
  - Incluye todo lo del Free +
    - Varios sistemas financieros.
    - Soporte de múltiples monedas.
    - Metas avanzadas y alertas.
    - Exportación básica de datos.
    - Menos publicidad o sin publicidad.

- **Plan Pro / Elite** (alto)
  - Precio: ~US$7–12/mes.
  - Objetivo: capturar más valor de usuarios avanzados.
  - Incluye todo lo anterior +
    - OCR/voz (cuando se implemente).
    - Recomendaciones de IA.
    - Presupuesto inteligente y simulaciones.
    - Score financiero avanzado.
    - Soporte prioritario.

### 2.2 Lógica de upgrades

- El **Plan Free** funciona como un funnel:
  - Muestra valor rápido (primer dashboard en minutos).
  - Tiene límites visibles (número de cuentas/sistemas, features bloqueadas) que incentivan el upgrade.

- Los planes pagos deben:
  - Hacer **obvio** el beneficio: ahorro de tiempo, claridad, paz mental.
  - Ofrecer **descuentos anuales** (ej: 2 meses gratis).

---

## 3. Planes para Tenants / Partners / Empresas (Nivel 1 y 2)

Aquí hablamos de **quienes ofrecen LUNA a otros**: marcas propias, partners B2B2C, empresas que usan LUNA para empleados/clientes.

### 3.1 Ingresos por Tenants / Partners B2B2C

Ejemplo de estructura híbrida:

- **Fee base de plataforma**
  - Cobro fijo mensual/anual por usar la plataforma LUNA como servicio.
  - Ej: US$500–2.000/mes según tamaño y SLA.

- **Cobro por volumen de usuarios activos**
  - Tarifa variable según cantidad de usuarios activos asignados a ese Tenant/Partner.
  - Ej: US$1–3 por usuario activo/mes.
  - Se pueden definir tramos:
    - 0–1.000 usuarios: US$2/usuario.
    - 1.001–10.000: US$1,5/usuario.
    - 10.001+: US$1/usuario.

- **Revenue share (cuando el partner cobra a sus usuarios)**
  - El partner vende planes premium a sus usuarios.
  - Se comparte el ingreso (ej: 70% para el partner, 30% para LUNA Group).

- **Setup / Implementación inicial**
  - Cobro único por onboarding técnico y de negocio.
  - Ej: US$5.000–25.000 según complejidad.
  - Incluye:
    - Branding/white-label.
    - Integraciones con sistemas existentes (SSO, HR, payroll, etc.).
    - Entrenamiento de equipos.

- **Desarrollo e integraciones custom**
  - Hora/hombre o paquetes cerrados.
  - Ej: US$100–200/hora o proyectos definidos.

### 3.2 Ingresos por Empresas/Personas que usan LUNA como servicio

Casos: influencers, contadores, empresas de gestión de arriendos que quieren usar LUNA con sus clientes.

- Modelo sugerido:
  - **Plan SaaS por "workspace"** (empresa/influencer):
    - Plan Starter: hasta 100 usuarios → fee fijo mensual (ej: US$99/mes).
    - Plan Growth: hasta 1.000 usuarios → fee mayor (ej: US$499/mes).
    - Plan Enterprise: >1.000 usuarios → precio negociado.
  - Opcionalmente, cobrar **por usuario extra** sobre los límites.

- Valor añadido para ellos:
  - Pueden ofrecer LUNA como parte de su servicio.
  - Acceden a dashboards agregados de sus clientes.

---

## 4. Otras Fuentes de Ingresos (además de suscripciones)

### 4.1 Publicidad (especialmente en planes gratuitos)

- **Ubicación en app/dashboard**:
  - Secciones específicas de "ofertas relevantes".
  - Banners discretos en dashboard o páginas de insights.
  - Nunca publicidad invasiva que rompa la experiencia financiera.

- **Tipo de anuncios**:
  - Productos financieros alineados con mejorar la vida del usuario:
    - Seguros (salud, vida, hogar).
    - Productos de ahorro/inversión.
    - Bancos digitales o tarjetas con beneficios.
  - Anuncios educativos o de bienestar (no puro consumo irresponsable).

- **Modelos de ingreso**:
  - CPM/CPC estándar (pago por impresiones/clicks).
  - **Afiliados**: comisión por leads o cuentas abiertas.
  - **Revenue share** con partners financieros.

> Importante: la publicidad debe respetar la **ética** del producto: ayudar a mejorar la salud financiera, no dañarla.

### 4.2 Afiliados y Productos Financieros

- Integraciones con:
  - Plataformas de inversión.
  - Bancos/fintechs.
  - Seguros.

- Modelos:
  - Comisión por usuario referido que contrata un producto.
  - Revenue share por fees cobrados al usuario.

### 4.3 Servicios de Consultoría/Asesoría (a empresas)

- Para grandes empresas/partners:
  - Paquetes de consultoría basados en los datos agregados:
    - Diseño de programas de bienestar financiero.
    - Medición del impacto de beneficios (bonos, aguinaldos, subidas de sueldo).
  - Cobros:
    - Proyectos cerrados (ej: US$10.000 por estudio).
    - Retainers mensuales (ej: US$2.000/mes por acompañamiento y reportes).

### 4.4 Datos agregados y estudios (respetando privacidad)

- Venta de **estudios anónimos** a:
  - Gobiernos.
  - Instituciones académicas.
  - Grandes empresas.

- Siempre usando datos **agregados y anonimizados** (sin PII):
  - Ej: "Ingresos promedio por región e industria", "evolución del endeudamiento", etc.

---

## 5. Estrategia sugerida de monetización (Fases)

### 5.1 Fase 1 – Lanzamiento (MVP con marca propia)

- Objetivo: **tracción y validación**.
- Acciones:
  - Lanzar marca propia (ej: LUNA) con **Plan Free + 1 plan Premium simple**.
  - Sin publicidad al principio (enfocarse en experiencia y valor).
  - Medir: adquisición, retención, uso de features, disposición a pagar.

### 5.2 Fase 2 – Escalar usuarios y lanzar planes Pro

- Objetivo: **monetizar usuarios finales y estabilizar MRR**.
- Acciones:
  - Introducir **Plan Pro** con features avanzadas (IA, OCR, simulaciones).
  - Empezar a probar **publicidad discreta** en Plan Free.
  - Testear pricing y bundles (mensual vs anual, descuentos).

### 5.3 Fase 3 – Modelo Partner y Enterprise

- Objetivo: **crecer con Partners B2B2C y empresas grandes**.
- Acciones:
  - Formalizar **planes para Tenants/Partners** (fees base + por usuario + setup).
  - Ofrecer **white-label completo** y consultoría.
  - Integraciones con productos financieros para afiliados.

---

## 6. Conexión con Métricas de Negocio

Para que el modelo de ingresos funcione bien, es clave medir:

- **Para usuarios finales**:
  - Conversión Free → Premium → Pro.
  - ARPU (Average Revenue Per User).
  - LTV y churn.

- **Para Tenants/Partners**:
  - MRR por Tenant.
  - Usuarios activos por Tenant y por Company.
  - Uso de features (para justificar upsell / cross-sell).

- **Para publicidad/afiliados**:
  - eCPM, CTR, conversiones reales.
  - Impacto en experiencia de usuario (no sacrificar NPS).

---

## 7. Resumen

- **Usuarios finales** → Planes Free, Premium, Pro.
- **Tenants/Partners/Empresas** → Fees base + por usuario + revenue share + servicios.
- **Extras** → Publicidad ética, afiliados, consultoría, estudios anónimos.

El backend multi-tenant de LUNA debe soportar:
- Diferentes tipos de planes por **nivel** (usuario final vs tenant/partner).
- Cálculo y tracking de ingresos **por Tenant, Company y User**.
- Integración con sistemas de billing y analytics para entender qué está funcionando.

