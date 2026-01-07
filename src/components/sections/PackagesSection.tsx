import { Link } from 'react-router-dom';
import { Check, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const packages = [
  {
    name: 'UI Only',
    description: 'Perfect for projects that need stunning frontend design',
    price: '2,999',
    period: 'starting at',
    features: [
      'Custom UI/UX Design',
      'Responsive Development',
      'Up to 10 Pages',
      'Interactive Prototypes',
      'Design System',
      '2 Revision Rounds',
    ],
    popular: false,
  },
  {
    name: 'Backend Only',
    description: 'For projects requiring robust server-side solutions',
    price: '3,499',
    period: 'starting at',
    features: [
      'API Development',
      'Database Design',
      'Authentication System',
      'Cloud Deployment',
      'Documentation',
      'Security Audit',
    ],
    popular: false,
  },
  {
    name: 'Full Stack',
    description: 'Complete end-to-end web application development',
    price: '5,999',
    period: 'starting at',
    features: [
      'Everything in UI Only',
      'Everything in Backend Only',
      'Admin Dashboard',
      'User Management',
      'Analytics Integration',
      '3 Months Support',
    ],
    popular: true,
  },
  {
    name: 'Shopify Store',
    description: 'Launch your e-commerce store with everything you need',
    price: '1,999',
    period: 'starting at',
    features: [
      'Custom Theme Setup',
      'Product Upload (up to 50)',
      'Payment Integration',
      'Shipping Configuration',
      'SEO Optimization',
      'Training Session',
    ],
    popular: false,
  },
];

export function PackagesSection() {
  return (
    <section id="packages" className="py-20 lg:py-32 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Pricing</span>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            Transparent Pricing, No Surprises
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the package that fits your needs. All packages include project management, communication, and quality assurance.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg) => (
            <Card
              key={pkg.name}
              className={cn(
                "relative flex flex-col border-border bg-background transition-all duration-300 hover:shadow-card-hover",
                pkg.popular && "border-primary shadow-card-hover ring-1 ring-primary"
              )}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    <Star className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <CardDescription className="text-muted-foreground min-h-[48px]">
                  {pkg.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-sm text-muted-foreground">{pkg.period}</span>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">${pkg.price}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-4">
                <Button
                  asChild
                  variant={pkg.popular ? "default" : "outline"}
                  className="w-full gap-2"
                >
                  <Link to="/start-project">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Custom Quote */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Need a custom solution?{' '}
            <Link to="/start-project" className="text-primary hover:underline">
              Request a custom quote
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
