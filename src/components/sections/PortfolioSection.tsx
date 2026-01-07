import { useState, useEffect } from 'react';
import { ExternalLink, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  category: string;
  client_name: string | null;
  project_url: string | null;
  technologies: string[];
  featured: boolean;
}

const categories = ['All', 'Web', 'Shopify', 'Full-Stack'];

export function PortfolioSection() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('featured', { ascending: false });

      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    }

    fetchProjects();
  }, []);

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter((p) => p.category === filter);

  return (
    <section id="portfolio" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Portfolio</span>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            Our Recent Work
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore some of our latest projects and see how we've helped businesses achieve their digital goals.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="group relative overflow-hidden border-border bg-card cursor-pointer transition-all duration-300 hover:shadow-card-hover"
                onClick={() => setSelectedProject(project)}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Eye className="h-8 w-8 text-background" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {project.category}
                      </Badge>
                      <h3 className="font-semibold text-foreground">{project.title}</h3>
                      {project.client_name && (
                        <p className="text-sm text-muted-foreground">for {project.client_name}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Project Modal */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="sm:max-w-2xl">
            {selectedProject && (
              <>
                <div className="aspect-video overflow-hidden rounded-lg mb-4">
                  <img
                    src={selectedProject.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'}
                    alt={selectedProject.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{selectedProject.category}</Badge>
                    {selectedProject.client_name && (
                      <span className="text-sm text-muted-foreground">
                        for {selectedProject.client_name}
                      </span>
                    )}
                  </div>
                  <DialogTitle className="text-2xl">{selectedProject.title}</DialogTitle>
                  <DialogDescription className="text-base">
                    {selectedProject.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                {selectedProject.project_url && (
                  <div className="mt-6">
                    <Button asChild className="gap-2">
                      <a href={selectedProject.project_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        View Live Project
                      </a>
                    </Button>
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
