import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/car-card";
import { ensureSuperAdminAndSeedSamples, getManagedCars } from "@/actions/home";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Car,
  Globe,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TrustIndicator = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-sm text-foreground/70">
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-accent/30 bg-background/80 text-accent">
      {icon}
    </span>
    <span>{text}</span>
  </div>
);

const ServiceCard = ({ icon, title, description, price }) => (
  <Card className="text-center transition-transform duration-200 hover:-translate-y-1">
    <CardHeader>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-accent/60 text-accent">
        {icon}
      </div>
      <CardTitle className="text-xl text-foreground">{title}</CardTitle>
      {price && (
        <p className="text-lg font-semibold text-foreground/80 tracking-tight">
          {price}
        </p>
      )}
    </CardHeader>
    <CardContent>
      <p className="text-sm text-foreground/70 leading-relaxed">{description}</p>
    </CardContent>
  </Card>
);

const HowItWorksStep = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center gap-4">
    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 text-accent">
      {icon}
    </span>
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-foreground/70 max-w-xs mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

export default async function Home() {
  const ownerEmail = "novapsiscorp@gmail.com";
  await ensureSuperAdminAndSeedSamples(ownerEmail);
  const featuredCars = await getManagedCars(ownerEmail, 9);

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 text-center space-y-10">
          <div className="space-y-4">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-accent/30 px-4 py-2 text-xs uppercase tracking-[0.4em] text-foreground/60">
              Concierge Automotriz
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
              Vende tu coche sin fricciones.
            </h1>
            <p className="mx-auto max-w-2xl text-base md:text-lg text-foreground/70 leading-relaxed">
              Gestión integral, fotografía profesional y negociación experta.
              Nos ocupamos de cada detalle para que disfrutes de una venta
              transparente y segura.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="px-8 text-base">
              Solicitar valoración gratuita
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-accent/70 text-foreground hover:bg-accent/20 hover:text-foreground px-8 text-base"
              asChild
            >
              <Link href="/cars">
                Ver flota
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="px-8 text-base text-foreground hover:bg-accent/20"
              asChild
            >
              <Link href="/publish">Publicar mi coche</Link>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <TrustIndicator
              icon={<Star className="h-4 w-4" />}
              text="+500 coches vendidos"
            />
            <TrustIndicator
              icon={<Award className="h-4 w-4" />}
              text="98% de satisfacción"
            />
            <TrustIndicator
              icon={<ShieldCheck className="h-4 w-4" />}
              text="Garantía total"
            />
            <TrustIndicator
              icon={<Globe className="h-4 w-4" />}
              text="Cobertura nacional"
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 text-center space-y-12">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Un proceso claro de principio a fin
            </h2>
            <p className="mx-auto max-w-2xl text-foreground/70 leading-relaxed">
              Coordinamos cada fase con precisión para que tu coche destaque y
              la venta se cierre a tu favor.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            <HowItWorksStep
              icon={<Search className="h-5 w-5" />}
              title="1. Valoración honesta"
              description="Te damos un precio competitivo en base a datos reales y al contexto actual del mercado."
            />
            <HowItWorksStep
              icon={<Car className="h-5 w-5" />}
              title="2. Preparación integral"
              description="Recogemos tu coche, lo acondicionamos y lo fotografiamos con estándares premium."
            />
            <HowItWorksStep
              icon={<Sparkles className="h-5 w-5" />}
              title="3. Publicación estratégica"
              description="Presentamos tu coche donde importa, con anuncios irresistibles y gestión de interesados."
            />
            <HowItWorksStep
              icon={<ArrowRight className="h-5 w-5" />}
              title="4. Venta segura"
              description="Negociamos, gestionamos el papeleo y te entregamos el pago con total transparencia."
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Planes diseñados para cada vehículo
            </h2>
            <p className="mx-auto max-w-2xl text-foreground/70 leading-relaxed">
              Selecciona el nivel de acompañamiento que mejor encaja con el
              valor y las necesidades de tu coche.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <ServiceCard
              icon={<Car className="h-5 w-5" />}
              title="Plan Bronze"
              price="490€"
              description="Para coches de hasta 15.000€. Incluye inspección, limpieza esencial y publicación optimizada."
            />
            <ServiceCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Plan Silver"
              price="690€"
              description="Para coches entre 15.000€ y 40.000€. Añade detailing avanzado y posicionamiento destacado."
            />
            <ServiceCard
              icon={<Award className="h-5 w-5" />}
              title="Plan Gold"
              price="990€"
              description="Para coches premium. Reparaciones menores, reportaje completo y negociación personalizada."
            />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-foreground">
                  Búsqueda personalizada
                </CardTitle>
                <CardDescription className="text-accent font-semibold">
                  Desde 149€
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  Te ayudamos a encontrar el próximo coche ideal según tus
                  requisitos de estilo, presupuesto y disponibilidad.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-foreground">
                  Tasación profesional
                </CardTitle>
                <CardDescription className="text-accent font-semibold">
                  89€
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  Informe detallado con análisis de mercado y recomendaciones
                  para maximizar el precio de venta.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-foreground">
                  Acondicionamiento preventa
                </CardTitle>
                <CardDescription className="text-accent font-semibold">
                  Desde 299€
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  Puesta a punto estética y mecánica para que tu coche impresione
                  desde el primer vistazo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {featuredCars.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 space-y-12">
            <div className="flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
              <div>
                <h2 className="text-3xl font-semibold text-foreground">
                  Vehículos en gestión
                </h2>
                <p className="text-foreground/70">
                  Selección actualizada de coches gestionados por nuestro equipo.
                </p>
              </div>
              <Button
                variant="outline"
                className="border-accent/70 text-foreground hover:bg-accent/20"
                asChild
              >
                <Link href="/cars">
                  Ver todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
            ¿Listo para empezar?
          </h2>
          <p className="mx-auto max-w-2xl text-foreground/70 leading-relaxed">
            Cientos de propietarios ya delegaron la venta de su coche en nosotros.
            Conversemos y descubre cómo podemos ayudarte.
          </p>
          <Button size="lg" className="px-8 text-base">
            Hablar con un experto
          </Button>
        </div>
      </section>
    </div>
  );
}
