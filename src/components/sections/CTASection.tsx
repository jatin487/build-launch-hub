import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section id="contact" className="py-20 lg:py-32 bg-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-primary-foreground/5 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary-foreground/5 translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground mb-6">
            <Sparkles className="h-4 w-4" />
            Ready to get started?
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
            Let's Build Something Amazing Together
          </h2>
          <p className="mt-6 text-lg text-primary-foreground/80 max-w-xl mx-auto">
            Whether you need a stunning website, a powerful Shopify store, or talented developers, we're here to help you succeed.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <Link to="/start-project">
                Start Your Project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/jobs">
                Join Our Team
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
