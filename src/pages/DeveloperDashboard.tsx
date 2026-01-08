import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Clock, CheckCircle, XCircle, Briefcase, Edit } from 'lucide-react';

interface Developer {
  id: string;
  name: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  is_available: boolean;
  weekly_hours: number | null;
}

interface Assignment {
  id: string;
  status: string;
  assigned_at: string;
  project_submissions: {
    name: string;
    project_type: string;
    timeline: string | null;
  } | null;
}

export default function DeveloperDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?type=developer');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDeveloperData();
    }
  }, [user]);

  const fetchDeveloperData = async () => {
    if (!user) return;

    // Check if developer profile exists
    const { data: devData, error: devError } = await supabase
      .from('developers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (devError || !devData) {
      // No profile, redirect to onboarding
      navigate('/developer/onboarding');
      return;
    }

    setDeveloper(devData);

    // Fetch assignments
    const { data: assignmentsData } = await supabase
      .from('project_assignments')
      .select(`
        *,
        project_submissions (name, project_type, timeline)
      `)
      .eq('developer_id', devData.id)
      .order('assigned_at', { ascending: false });

    setAssignments(assignmentsData || []);
    setLoading(false);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          badge: <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" /> Pending Review</Badge>,
          message: 'Your profile is being reviewed by our team. We\'ll notify you once it\'s approved.',
        };
      case 'approved':
        return {
          badge: <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" /> Approved</Badge>,
          message: 'You\'re approved! You\'ll be assigned to projects soon.',
        };
      case 'rejected':
        return {
          badge: <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Rejected</Badge>,
          message: 'Unfortunately, your application was not approved. Contact us for more details.',
        };
      default:
        return { badge: null, message: '' };
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!developer) {
    return null;
  }

  const statusInfo = getStatusInfo(developer.status);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome, {developer.name}!</h1>
              <p className="text-muted-foreground">{developer.role}</p>
            </div>
            <Button variant="outline" onClick={signOut}>Sign Out</Button>
          </div>

          {/* Status Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile Status</CardTitle>
                {statusInfo.badge}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{statusInfo.message}</p>
              {developer.status === 'approved' && (
                <div className="mt-4 flex items-center gap-4">
                  <Badge variant={developer.is_available ? 'default' : 'secondary'}>
                    {developer.is_available ? 'Available for work' : 'Currently unavailable'}
                  </Badge>
                  {developer.weekly_hours && (
                    <span className="text-sm text-muted-foreground">
                      {developer.weekly_hours} hours/week
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignments */}
          {developer.status === 'approved' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Your Assignments
                </CardTitle>
                <CardDescription>Projects you've been assigned to</CardDescription>
              </CardHeader>
              <CardContent>
                {assignments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No assignments yet.</p>
                    <p className="text-sm">You'll be notified when you're assigned to a project.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">
                            {assignment.project_submissions?.name || 'Unknown Project'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {assignment.project_submissions?.project_type?.replace('_', ' ')}
                            {assignment.project_submissions?.timeline && (
                              <span> • {assignment.project_submissions.timeline}</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Assigned {new Date(assignment.assigned_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge>{assignment.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
