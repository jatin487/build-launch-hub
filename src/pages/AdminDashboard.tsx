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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Loader2, Users, FolderKanban, CheckCircle, XCircle, 
  Clock, Eye, UserPlus, ToggleLeft, ToggleRight, Github, ExternalLink
} from 'lucide-react';

interface Developer {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  experience_years: number;
  location: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  weekly_hours: number | null;
  status: 'pending' | 'approved' | 'rejected';
  is_available: boolean;
  created_at: string;
  developer_skills?: { skill_name: string; years_experience: number }[];
}

interface ProjectSubmission {
  id: string;
  project_type: string;
  name: string;
  email: string;
  budget_min: number | null;
  budget_max: number | null;
  timeline: string | null;
  features: string[];
  created_at: string;
}

interface Assignment {
  id: string;
  developer_id: string;
  project_submission_id: string;
  status: string;
  assigned_at: string;
  developers?: { name: string };
  project_submissions?: { name: string; project_type: string };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, role, loading: authLoading, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [projects, setProjects] = useState<ProjectSubmission[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectSubmission | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || role !== 'admin')) {
      navigate('/auth?type=admin');
    }
  }, [user, role, authLoading, navigate]);

  useEffect(() => {
    if (user && role === 'admin') {
      fetchData();
    }
  }, [user, role]);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch developers with skills
    const { data: devsData } = await supabase
      .from('developers')
      .select(`
        *,
        developer_skills (skill_name, years_experience)
      `)
      .order('created_at', { ascending: false });

    // Fetch project submissions
    const { data: projectsData } = await supabase
      .from('project_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    // Fetch assignments
    const { data: assignmentsData } = await supabase
      .from('project_assignments')
      .select(`
        *,
        developers (name),
        project_submissions (name, project_type)
      `)
      .order('assigned_at', { ascending: false });

    setDevelopers(devsData || []);
    setProjects(projectsData || []);
    setAssignments(assignmentsData || []);
    setLoading(false);
  };

  const updateDeveloperStatus = async (developerId: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('developers')
      .update({ status })
      .eq('id', developerId);

    if (error) {
      toast.error('Failed to update developer status');
    } else {
      toast.success(`Developer ${status}`);
      fetchData();
    }
  };

  const toggleAvailability = async (developerId: string, currentAvailability: boolean) => {
    const { error } = await supabase
      .from('developers')
      .update({ is_available: !currentAvailability })
      .eq('id', developerId);

    if (error) {
      toast.error('Failed to update availability');
    } else {
      toast.success('Availability updated');
      fetchData();
    }
  };

  const assignDeveloper = async (developerId: string, projectId: string) => {
    const { error } = await supabase
      .from('project_assignments')
      .insert({
        developer_id: developerId,
        project_submission_id: projectId,
      });

    if (error) {
      if (error.code === '23505') {
        toast.error('Developer is already assigned to this project');
      } else {
        toast.error('Failed to assign developer');
      }
    } else {
      toast.success('Developer assigned successfully');
      setAssignDialogOpen(false);
      fetchData();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingDevs = developers.filter(d => d.status === 'pending').length;
  const approvedDevs = developers.filter(d => d.status === 'approved').length;
  const availableDevs = developers.filter(d => d.status === 'approved' && d.is_available).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage developers, projects, and assignments</p>
            </div>
            <Button variant="outline" onClick={signOut}>Sign Out</Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Developers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingDevs}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Developers</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedDevs}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Now</CardTitle>
                <ToggleRight className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{availableDevs}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="developers" className="space-y-6">
            <TabsList>
              <TabsTrigger value="developers">Developers</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
            </TabsList>

            {/* Developers Tab */}
            <TabsContent value="developers" className="space-y-4">
              {developers.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No developers have registered yet.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {developers.map((dev) => (
                    <Card key={dev.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{dev.name}</h3>
                              {getStatusBadge(dev.status)}
                              {dev.status === 'approved' && (
                                <Badge variant={dev.is_available ? 'default' : 'secondary'}>
                                  {dev.is_available ? 'Available' : 'Unavailable'}
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm">{dev.email}</p>
                            <div className="mt-2 text-sm">
                              <span className="font-medium">{dev.role}</span>
                              <span className="text-muted-foreground"> • {dev.experience_years} years exp</span>
                              {dev.location && <span className="text-muted-foreground"> • {dev.location}</span>}
                              {dev.weekly_hours && <span className="text-muted-foreground"> • {dev.weekly_hours}h/week</span>}
                            </div>
                            {dev.developer_skills && dev.developer_skills.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1">
                                {dev.developer_skills.map((skill) => (
                                  <Badge key={skill.skill_name} variant="outline" className="text-xs">
                                    {skill.skill_name} ({skill.years_experience}y)
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <div className="mt-3 flex gap-3">
                              {dev.github_url && (
                                <a href={dev.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                                  <Github className="h-4 w-4" />
                                </a>
                              )}
                              {dev.portfolio_url && (
                                <a href={dev.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {dev.status === 'pending' && (
                              <>
                                <Button size="sm" onClick={() => updateDeveloperStatus(dev.id, 'approved')}>
                                  <CheckCircle className="mr-1 h-4 w-4" /> Approve
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => updateDeveloperStatus(dev.id, 'rejected')}>
                                  <XCircle className="mr-1 h-4 w-4" /> Reject
                                </Button>
                              </>
                            )}
                            {dev.status === 'approved' && (
                              <Button size="sm" variant="outline" onClick={() => toggleAvailability(dev.id, dev.is_available)}>
                                {dev.is_available ? <ToggleRight className="mr-1 h-4 w-4" /> : <ToggleLeft className="mr-1 h-4 w-4" />}
                                {dev.is_available ? 'Set Unavailable' : 'Set Available'}
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

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-4">
              {projects.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No project submissions yet.
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
                              <Badge variant="outline">{project.project_type.replace('_', ' ')}</Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">{project.email}</p>
                            <div className="mt-2 text-sm text-muted-foreground">
                              {project.budget_min && project.budget_max && (
                                <span>${project.budget_min.toLocaleString()} - ${project.budget_max.toLocaleString()}</span>
                              )}
                              {project.timeline && <span> • {project.timeline}</span>}
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
                          </div>
                          <Dialog open={assignDialogOpen && selectedProject?.id === project.id} onOpenChange={(open) => {
                            setAssignDialogOpen(open);
                            if (open) setSelectedProject(project);
                          }}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <UserPlus className="mr-1 h-4 w-4" /> Assign Developer
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Assign Developer</DialogTitle>
                                <DialogDescription>
                                  Select an available developer to assign to this project.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                {developers.filter(d => d.status === 'approved' && d.is_available).length === 0 ? (
                                  <p className="text-muted-foreground text-center py-4">No available developers</p>
                                ) : (
                                  developers
                                    .filter(d => d.status === 'approved' && d.is_available)
                                    .map((dev) => (
                                      <div key={dev.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                          <p className="font-medium">{dev.name}</p>
                                          <p className="text-sm text-muted-foreground">{dev.role}</p>
                                        </div>
                                        <Button size="sm" onClick={() => assignDeveloper(dev.id, project.id)}>
                                          Assign
                                        </Button>
                                      </div>
                                    ))
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Assignments Tab */}
            <TabsContent value="assignments" className="space-y-4">
              {assignments.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No assignments yet. Assign developers to projects from the Projects tab.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {assignments.map((assignment) => (
                    <Card key={assignment.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{assignment.developers?.name || 'Unknown Developer'}</p>
                            <p className="text-sm text-muted-foreground">
                              Assigned to: {assignment.project_submissions?.name || 'Unknown Project'}
                              {assignment.project_submissions?.project_type && (
                                <span> ({assignment.project_submissions.project_type.replace('_', ' ')})</span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(assignment.assigned_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge>{assignment.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
