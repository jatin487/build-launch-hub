import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LiveChat } from '@/components/chat/LiveChat';
import { MapPin, Clock, Briefcase, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type JobType = 'frontend' | 'backend' | 'fullstack';

interface Job {
  id: string;
  title: string;
  type: JobType;
  level: string;
  location: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

const jobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    type: 'frontend',
    level: 'Mid-Level',
    location: 'Remote',
    description: 'Build beautiful, responsive user interfaces using React and TypeScript. Work closely with designers to bring mockups to life.',
    requirements: [
      '3+ years React experience',
      'Strong TypeScript skills',
      'CSS/Tailwind expertise',
      'Testing experience (Jest, RTL)',
    ],
    benefits: [
      'Competitive salary',
      'Remote-first culture',
      'Health insurance',
      'Learning budget',
    ],
  },
  {
    id: '2',
    title: 'Backend Developer',
    type: 'backend',
    level: 'Senior',
    location: 'Remote',
    description: 'Design and implement scalable backend systems using Node.js and PostgreSQL. Lead architectural decisions.',
    requirements: [
      '5+ years backend experience',
      'Node.js/Python proficiency',
      'PostgreSQL/MongoDB expertise',
      'Cloud experience (AWS/GCP)',
    ],
    benefits: [
      'Competitive salary',
      'Remote-first culture',
      'Stock options',
      'Flexible hours',
    ],
  },
  {
    id: '3',
    title: 'Full-Stack Developer',
    type: 'fullstack',
    level: 'Mid-Level',
    location: 'Hybrid (SF)',
    description: 'End-to-end feature development from database to UI. Perfect for developers who love variety.',
    requirements: [
      '4+ years full-stack experience',
      'React + Node.js proficiency',
      'Database design skills',
      'DevOps familiarity',
    ],
    benefits: [
      'Competitive salary',
      'Hybrid flexibility',
      'Team events',
      'Career growth',
    ],
  },
  {
    id: '4',
    title: 'Junior Frontend Developer',
    type: 'frontend',
    level: 'Junior',
    location: 'Remote',
    description: 'Great opportunity for developers starting their career. You\'ll be mentored by senior team members.',
    requirements: [
      '1+ years React experience',
      'HTML/CSS fundamentals',
      'JavaScript proficiency',
      'Eagerness to learn',
    ],
    benefits: [
      'Mentorship program',
      'Remote-first culture',
      'Learning resources',
      'Growth path',
    ],
  },
];

const filters = ['All', 'Frontend', 'Backend', 'Full-Stack'];

export default function Jobs() {
  const [filter, setFilter] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplication, setShowApplication] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    portfolio_url: '',
    cover_letter: '',
  });

  const filteredJobs = filter === 'All'
    ? jobs
    : jobs.filter((job) => {
        const filterLower = filter.toLowerCase().replace('-', '');
        return job.type === filterLower;
      });

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in required fields');
      return;
    }

    if (!selectedJob) return;

    setLoading(true);

    const { error } = await supabase
      .from('job_applications')
      .insert({
        job_title: selectedJob.title,
        job_type: selectedJob.type,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        portfolio_url: formData.portfolio_url.trim() || null,
        cover_letter: formData.cover_letter.trim() || null,
      });

    setLoading(false);

    if (error) {
      toast.error('Failed to submit application. Please try again.');
      return;
    }

    toast.success('Application submitted successfully!');
    setShowApplication(false);
    setSelectedJob(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      portfolio_url: '',
      cover_letter: '',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="py-20 lg:py-28 bg-card">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Careers</span>
              <h1 className="mt-2 text-4xl font-bold text-foreground sm:text-5xl">
                Join Our Team
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                We're looking for talented developers to help us build amazing digital experiences. Remote-friendly positions with competitive compensation.
              </p>
            </div>
          </div>
        </section>

        {/* Jobs List */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            {/* Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {filters.map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f}
                </Button>
              ))}
            </div>

            {/* Jobs Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="border-border bg-card transition-all duration-300 hover:shadow-card-hover"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {job.description}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{job.level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Full-time
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedJob(job)}
                      >
                        View Details
                      </Button>
                      <Button
                        className="gap-2"
                        onClick={() => {
                          setSelectedJob(job);
                          setShowApplication(true);
                        }}
                      >
                        Apply Now
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <LiveChat />

      {/* Job Details Modal */}
      <Dialog open={!!selectedJob && !showApplication} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedJob && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{selectedJob.level}</Badge>
                  <Badge variant="outline">{selectedJob.location}</Badge>
                </div>
                <DialogTitle className="text-2xl">{selectedJob.title}</DialogTitle>
                <DialogDescription className="text-base">
                  {selectedJob.description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Requirements</h4>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Benefits</h4>
                  <ul className="space-y-2">
                    {selectedJob.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-success mt-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6">
                <Button className="w-full gap-2" onClick={() => setShowApplication(true)}>
                  Apply for this Position
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Application Modal */}
      <Dialog open={showApplication} onOpenChange={(open) => {
        setShowApplication(open);
        if (!open) setSelectedJob(null);
      }}>
        <DialogContent className="sm:max-w-lg">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle>Apply for {selectedJob.title}</DialogTitle>
                <DialogDescription>
                  Fill out the form below to submit your application.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleApply} className="space-y-4 mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio URL</Label>
                    <Input
                      id="portfolio"
                      type="url"
                      placeholder="https://"
                      value={formData.portfolio_url}
                      onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cover">Cover Letter</Label>
                  <Textarea
                    id="cover"
                    rows={4}
                    placeholder="Tell us why you'd be a great fit..."
                    value={formData.cover_letter}
                    onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
