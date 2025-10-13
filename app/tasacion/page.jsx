export const metadata = {
  title: "Tasación Profesional | CochesToday",
  description: "Solicita la tasación premium de tu vehículo con revisión técnica y valoración real del mercado.",
};

const highlightItems = [
  {
    title: "Revisión integral",
    subtitle: "Escaneo electrónico + diagnóstico visual",
    description:
      "Realizamos un chequeo completo del vehículo con tecnología OBD, comprobamos historial de mantenimiento y evaluamos el estado de carrocería, neumáticos y elementos de desgaste.",
  },
  {
    title: "Informe de mercado",
    subtitle: "Benchmark en tiempo real",
    description:
      "Comparativa de precios con vehículos equivalentes en España y Europa, análisis de demanda y recomendaciones para posicionar tu anuncio en el precio óptimo de venta.",
  },
  {
    title: "Plan de revalorización",
    subtitle: "Checklist personalizado",
    description:
      "Te entregamos un plan de mejoras rápidas (detailing, fotografía, pequeños arreglos) que aumenta el valor percibido y agiliza la negociación con compradores.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Reserva tu cita",
    description:
      "Selecciona la fecha que mejor encaja. Nuestro especialista se desplaza a tu ubicación o te recibimos en nuestras instalaciones partner.",
  },
  {
    number: "02",
    title: "Diagnóstico premium",
    description:
      "En 60 minutos inspeccionamos el vehículo, extraemos el informe mecánico y documentamos el estado real con fotografía profesional.",
  },
  {
    number: "03",
    title: "Entrega del informe",
    description:
      "Recibirás un dossier digital con valoración comercial, márgenes de negociación sugeridos y el plan de revalorización listo para aplicar.",
  },
];

export default function TasacionPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.4em] text-foreground/60">
              Servicio concierge
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Tasación profesional con revisión certificada
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl">
              Ponemos a tu disposición un equipo de peritos independientes, mecánicos certificados y analistas de mercado. Obtén una valoración real, objetiva y respaldada por datos para vender tu coche al mejor precio.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <span className="inline-flex rounded-full border border-accent/35 px-4 py-2 text-sm font-medium text-foreground/80">
                Informe técnico firmado
              </span>
              <span className="inline-flex rounded-full border border-accent/35 px-4 py-2 text-sm font-medium text-foreground/80">
                Marketplace benchmarking
              </span>
              <span className="inline-flex rounded-full border border-accent/35 px-4 py-2 text-sm font-medium text-foreground/80">
                Plan de revalorización
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground px-6 py-3 text-sm font-semibold hover:bg-accent/90 transition"
              >
                Agenda tu tasación
              </a>
              <a
                href="/publish"
                className="inline-flex items-center justify-center rounded-full border border-accent/40 px-6 py-3 text-sm font-semibold text-foreground hover:border-accent hover:text-accent transition"
              >
                Volver a publicar coche
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-accent/20 bg-card/90 p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-foreground mb-4">Incluye:</h2>
            <ul className="space-y-4 text-sm text-foreground/80">
              <li>• Revisión técnica presencial con especialista certificado.</li>
              <li>• Informe digital con valoración de mercado y análisis de demanda.</li>
              <li>• Check-list de mejoras recomendadas para aumentar el valor.</li>
              <li>• Acompañamiento del concierge CochesToday para implementar el plan.</li>
            </ul>
            <div className="mt-6 rounded-2xl bg-accent/10 border border-accent/30 p-4 text-sm text-foreground">
              <p className="font-medium">Modalidades</p>
              <p className="text-foreground/70 mt-1">
                • Express (48h) | Ideal si ya tienes comprador.<br />
                • Completa (5 días) | Incluye reportaje fotográfico y publicación.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card/80 border-y border-accent/15">
        <div className="container mx-auto px-4 py-16 space-y-10">
          <h2 className="text-3xl font-semibold text-center">¿Qué recibes con nuestra tasación?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {highlightItems.map((item) => (
              <div key={item.title} className="rounded-3xl border border-accent/20 bg-background/90 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-foreground/50">
                  {item.subtitle}
                </p>
                <h3 className="text-xl font-semibold text-foreground mt-2">
                  {item.title}
                </h3>
                <p className="text-sm text-foreground/70 mt-3 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 space-y-10">
        <h2 className="text-3xl font-semibold text-foreground text-center">
          Proceso premium en tres pasos
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {processSteps.map((step) => (
            <div
              key={step.number}
              className="rounded-3xl border border-accent/20 bg-card/90 p-6 shadow-sm flex flex-col gap-4"
            >
              <span className="text-foreground/50 text-sm uppercase tracking-[0.4em]">
                Paso {step.number}
              </span>
              <h3 className="text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-accent/20 bg-card/95 p-6 text-sm text-foreground/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="font-medium text-foreground">¿Necesitas una valoración corporativa?</p>
            <p className="text-foreground/70">
              Realizamos tasaciones para flotas, concesionarios y financieras con informes homologados.
            </p>
          </div>
          <a
            href="mailto:tasacion@cochestoday.com"
            className="inline-flex items-center justify-center rounded-full border border-accent/40 px-5 py-2 text-sm font-semibold hover:border-accent hover:text-accent transition"
          >
            Contactar equipo B2B
          </a>
        </div>
      </section>
    </div>
  );
}
