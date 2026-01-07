import { Link } from 'react-router-dom';
import { ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { value: '150+', label: 'Projects Delivered' },
  { value: '50+', label: 'Happy Clients' },
  { value: '98%', label: 'Success Rate' },
  { value: '5+', label: 'Years Experience' },
];

const highlights = [
  'Custom Web Development',
  'Shopify Store Setup',
  'UI/UX Design',
  'Full-Stack Solutions',
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-muted-foreground">Now accepting new projects</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Build Websites.
            <br />
            <span className="text-primary">Launch Shopify Stores.</span>
            <br />
            Hire Developers.
          </h1>

          {/* Subheadline */}
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
            We're a full-service web development agency helping businesses create stunning digital experiences. From concept to launch, we've got you covered.
          </p>

          {/* CTAs */}
          <div className="mb-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link to="/start-project">
                Start Your Project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/#portfolio">
                <Play className="h-4 w-4" />
                View Our Work
              </Link>
            </Button>
          </div>

          {/* Highlights */}
          <div className="mb-16 flex flex-wrap items-center justify-center gap-4">
            {highlights.map((highlight) => (
              <div
                key={highlight}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-success" />
                {highlight}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-foreground lg:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
