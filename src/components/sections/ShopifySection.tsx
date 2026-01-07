import { Link } from 'react-router-dom';
import { ShoppingBag, Palette, Zap, TrendingUp, CreditCard, Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Palette,
    title: 'Custom Theme Design',
    description: 'Stand out with a unique, branded store design that reflects your business identity.',
  },
  {
    icon: Zap,
    title: 'Performance Optimized',
    description: 'Lightning-fast load times that keep customers engaged and improve SEO rankings.',
  },
  {
    icon: TrendingUp,
    title: 'Conversion Focused',
    description: 'Strategic layouts and features designed to maximize sales and customer lifetime value.',
  },
  {
    icon: CreditCard,
    title: 'Payment Integration',
    description: 'Seamless checkout with support for all major payment gateways and currencies.',
  },
  {
    icon: Truck,
    title: 'Shipping Setup',
    description: 'Automated shipping calculations and integrations with major carriers.',
  },
  {
    icon: ShoppingBag,
    title: 'Inventory Management',
    description: 'Track stock levels, variants, and automate reorder notifications.',
  },
];

export function ShopifySection() {
  return (
    <section id="shopify" className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/30 -skew-x-12 translate-x-1/4" />

      <div className="container mx-auto px-4 relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Shopify Experts</span>
            <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
              Launch Your E-Commerce Empire
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We specialize in creating high-converting Shopify stores that turn visitors into loyal customers. From theme customization to complete store builds, we've got you covered.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
                    <feature.icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link to="/start-project">
                  Start Your Store
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/#portfolio">View Shopify Projects</Link>
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"
                alt="E-commerce success"
                className="h-full w-full object-cover mix-blend-overlay"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-primary-foreground">
                  <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-80" />
                  <span className="text-2xl font-bold opacity-80">Shopify Partner</span>
                </div>
              </div>
            </div>
            {/* Floating stats */}
            <div className="absolute -bottom-6 -left-6 rounded-xl bg-card p-4 shadow-soft border border-border">
              <div className="text-2xl font-bold text-foreground">250%</div>
              <div className="text-sm text-muted-foreground">Avg. Revenue Increase</div>
            </div>
            <div className="absolute -top-6 -right-6 rounded-xl bg-card p-4 shadow-soft border border-border">
              <div className="text-2xl font-bold text-foreground">50+</div>
              <div className="text-sm text-muted-foreground">Stores Launched</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
