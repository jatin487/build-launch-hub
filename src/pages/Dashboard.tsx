import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Loader2, FolderKanban, FileText, Mail, Phone, Link as LinkIcon,
  Briefcase, Calendar, DollarSign
} from 'lucide-react';

interface ProjectSubmission {
  id: string;
  project_type: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  budget_min: number | null;
  budget_max: number | null;
  timeline: string | null;
  features: string[];
  custom_requirements: string | null;
  created_at: string;
}

interface JobApplication {
  id: string;
  job_title: string;
  job_type: 'frontend' | 'backend' | 'fullstack';
  name: string;
  email: string;
  phone: string | null;
  portfolio_url: string | null;
  cover_letter: string | null;
  resume_url: string | null;
  created_at: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, role, loading: authLoading, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectSubmission[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, role]);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch project submissions (both admin and developer can see)
    const { data: projectsData } = await supabase
      .from('project_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    setProjects(projectsData || []);

    // Only admin can see job applications
    if (role === 'admin') {
      const { data: jobAppsData } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      setJobApplications(jobAppsData || []);
    }

    setLoading(false);
  };

  const getJobTypeBadge = (type: string) => {
    switch (type) {
      case 'frontend':
        return <Badge className="bg-blue-500">Frontend</Badge>;
      case 'backend':
        return <Badge className="bg-green-500">Backend</Badge>;
      case 'fullstack':
        return <Badge className="bg-purple-500">Full Stack</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const formatProjectType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                {role === 'admin' 
                  ? 'Manage job applications and project submissions' 
                  : 'View project submissions'}
              </p>
            </div>
            <Button variant="outline" onClick={signOut}>Sign Out</Button>
          </div>

          {/* Stats */}
          <div className={`grid gap-4 mb-8 ${role === 'admin' ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Project Submissions</CardTitle>
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
              </CardContent>
            </Card>
            {role === 'admin' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Job Applications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobApplications.length}</div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList>
              <TabsTrigger value="projects">Project Submissions</TabsTrigger>
              {role === 'admin' && (
                <TabsTrigger value="job-applications">Job Applications</TabsTrigger>
              )}
            </TabsList>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-4">
              {projects.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <FolderKanban className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No project submissions yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <Card key={project.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{project.name}</h3>
                              <Badge variant="outline">{formatProjectType(project.project_type)}</Badge>
                            </div>
                            
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>{project.email}</span>
                              </div>
                              {project.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  <span>{project.phone}</span>
                                </div>
                              )}
                              {project.company && (
                                <div className="flex items-center gap-2">
                                  <Briefcase className="h-4 w-4" />
                                  <span>{project.company}</span>
                                </div>
                              )}
                            </div>

                            <div className="mt-3 flex flex-wrap gap-4 text-sm">
                              {(project.budget_min || project.budget_max) && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4 text-primary" />
                                  <span>
                                    {project.budget_min?.toLocaleString()} - {project.budget_max?.toLocaleString()}
                                  </span>
                                </div>
                              )}
                              {project.timeline && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4 text-primary" />
                                  <span>{project.timeline}</span>
                                </div>
                              )}
                            </div>

                            {project.features && project.features.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1">
                                {project.features.map((feature) => (
                                  <Badge key={feature} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {project.custom_requirements && (
                              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                                {project.custom_requirements}
                              </p>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(project.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Job Applications Tab (Admin Only) */}
            {role === 'admin' && (
              <TabsContent value="job-applications" className="space-y-4">
                {jobApplications.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>No job applications yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {jobApplications.map((app) => (
                      <Card key={app.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{app.name}</h3>
                                {getJobTypeBadge(app.job_type)}
                              </div>
                              <p className="text-muted-foreground text-sm font-medium mb-2">{app.job_title}</p>
                              
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  <a href={`mailto:${app.email}`} className="hover:text-primary">
                                    {app.email}
                                  </a>
                                </div>
                                {app.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span>{app.phone}</span>
                                  </div>
                                )}
                                {app.portfolio_url && (
                                  <div className="flex items-center gap-2">
                                    <LinkIcon className="h-4 w-4" />
                                    <a 
                                      href={app.portfolio_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="hover:text-primary"
                                    >
                                      Portfolio
                                    </a>
                                  </div>
                                )}
                              </div>

                              {app.cover_letter && (
                                <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                                  {app.cover_letter}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="text-xs text-muted-foreground">
                                {new Date(app.created_at).toLocaleDateString()}
                              </span>
                              {app.resume_url && (
                                <Button size="sm" variant="outline" asChild>
                                  <a href={app.resume_url} target="_blank" rel="noopener noreferrer">
                                    View Resume
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
