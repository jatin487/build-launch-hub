import { Palette, Server, Layers, ShoppingBag, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Create beautiful, intuitive interfaces that delight users and drive conversions. From wireframes to high-fidelity prototypes.',
    features: ['User Research', 'Wireframing', 'Visual Design', 'Prototyping'],
  },
  {
    icon: Server,
    title: 'Backend Development',
    description: 'Build robust, scalable server-side solutions with modern technologies. APIs, databases, and cloud infrastructure.',
    features: ['API Development', 'Database Design', 'Cloud Architecture', 'Security'],
  },
  {
    icon: Layers,
    title: 'Full-Stack Development',
    description: 'End-to-end web applications combining stunning frontends with powerful backends. Complete solutions for your business.',
    features: ['React/Next.js', 'Node.js/Python', 'PostgreSQL/MongoDB', 'DevOps'],
  },
  {
    icon: ShoppingBag,
    title: 'Shopify Development',
    description: 'Launch and scale your e-commerce business with custom Shopify stores. Theme customization, apps, and integrations.',
    features: ['Custom Themes', 'App Integration', 'Payment Setup', 'SEO Optimization'],
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 lg:py-32 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Services</span>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            Everything You Need to Succeed Online
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From design to deployment, we offer comprehensive development services tailored to your business needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card
              key={service.title}
              className="group relative overflow-hidden border-border bg-background transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
            >
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                  <service.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" size="sm" className="mt-6 gap-1 group-hover:text-primary" asChild>
                  <Link to="/start-project">
                    Learn More
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
