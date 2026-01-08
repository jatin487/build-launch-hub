import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, ArrowRight, Check, Loader2, Upload, X, 
  User, Code, Briefcase, Clock
} from 'lucide-react';

const steps = [
  { id: 1, title: 'Basic Info', description: 'Tell us about yourself', icon: User },
  { id: 2, title: 'Skills', description: 'Your expertise', icon: Code },
  { id: 3, title: 'Portfolio', description: 'Showcase your work', icon: Briefcase },
  { id: 4, title: 'Availability', description: 'Your schedule', icon: Clock },
];

const skillsList = [
  'React', 'Vue.js', 'Angular', 'Next.js', 'TypeScript', 'JavaScript',
  'Node.js', 'Python', 'PHP', 'Ruby', 'Go', 'Rust',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
  'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes',
  'Shopify', 'WordPress', 'Webflow',
  'Figma', 'UI/UX Design', 'Tailwind CSS',
];

const roleOptions = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'DevOps Engineer',
  'UI/UX Designer',
  'Shopify Developer',
];

const projectTypeOptions = [
  'New Websites',
  'E-commerce',
  'Web Apps',
  'Mobile Apps',
  'Shopify Stores',
  'Maintenance',
];

export default function DeveloperOnboarding() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [screenshots, setScreenshots] = useState<{ url: string; name: string }[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    experienceYears: '',
    location: '',
    skills: [] as { name: string; years: number }[],
    githubUrl: '',
    portfolioUrl: '',
    weeklyHours: '40',
    preferredProjectTypes: [] as string[],
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?type=developer&tab=signup');
    }
  }, [user, authLoading, navigate]);

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => {
      const exists = prev.skills.find(s => s.name === skill);
      if (exists) {
        return { ...prev, skills: prev.skills.filter(s => s.name !== skill) };
      }
      return { ...prev, skills: [...prev.skills, { name: skill, years: 1 }] };
    });
  };

  const updateSkillYears = (skill: string, years: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map(s => s.name === skill ? { ...s, years } : s),
    }));
  };

  const handleProjectTypeToggle = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredProjectTypes: prev.preferredProjectTypes.includes(type)
        ? prev.preferredProjectTypes.filter(t => t !== type)
        : [...prev.preferredProjectTypes, type],
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    setUploading(true);
    
    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('developer-portfolio')
        .upload(fileName, file);

      if (uploadError) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('developer-portfolio')
        .getPublicUrl(fileName);

      setScreenshots(prev => [...prev, { url: urlData.publicUrl, name: file.name }]);
    }

    setUploading(false);
    e.target.value = '';
  };

  const removeScreenshot = (url: string) => {
    setScreenshots(prev => prev.filter(s => s.url !== url));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() && formData.role && formData.experienceYears;
      case 2:
        return formData.skills.length > 0;
      case 3:
        return true; // Optional step
      case 4:
        return formData.weeklyHours;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);

    // Create developer profile
    const { data: devData, error: devError } = await supabase
      .from('developers')
      .insert({
        user_id: user.id,
        name: formData.name.trim(),
        email: user.email || '',
        role: formData.role,
        experience_years: parseInt(formData.experienceYears),
        location: formData.location.trim() || null,
        github_url: formData.githubUrl.trim() || null,
        portfolio_url: formData.portfolioUrl.trim() || null,
        weekly_hours: parseInt(formData.weeklyHours),
        preferred_project_types: formData.preferredProjectTypes,
      })
      .select()
      .single();

    if (devError) {
      toast.error('Failed to create profile. You may already have one.');
      setLoading(false);
      return;
    }

    // Add developer role
    await supabase.from('user_roles').insert({
      user_id: user.id,
      role: 'developer',
    });

    // Add skills
    if (formData.skills.length > 0) {
      await supabase.from('developer_skills').insert(
        formData.skills.map(skill => ({
          developer_id: devData.id,
          skill_name: skill.name,
          years_experience: skill.years,
        }))
      );
    }

    // Add screenshots
    if (screenshots.length > 0) {
      await supabase.from('developer_screenshots').insert(
        screenshots.map(s => ({
          developer_id: devData.id,
          file_url: s.url,
          file_name: s.name,
        }))
      );
    }

    setLoading(false);
    toast.success('Profile created! Awaiting approval.');
    navigate('/developer/dashboard');
  };

  if (authLoading) {
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
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Developer Onboarding
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Complete your profile to join our team of developers
            </p>
          </div>

          {/* Progress */}
          <div className="mx-auto max-w-3xl mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                      currentStep >= step.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-1 w-8 sm:w-16 lg:w-24 mx-2 rounded-full transition-colors",
                        currentStep > step.id ? "bg-primary" : "bg-border"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <Card className="mx-auto max-w-2xl border-border">
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience *</Label>
                    <Select value={formData.experienceYears} onValueChange={(value) => setFormData({ ...formData, experienceYears: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((year) => (
                          <SelectItem key={year} value={year.toString()}>{year}+ years</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Skills */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {skillsList.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={formData.skills.some(s => s.name === skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                        />
                        <Label htmlFor={skill} className="cursor-pointer text-sm">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {formData.skills.length > 0 && (
                    <div className="space-y-3 pt-4 border-t">
                      <Label>Years of experience per skill</Label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {formData.skills.map((skill) => (
                          <div key={skill.name} className="flex items-center gap-2">
                            <span className="text-sm flex-1">{skill.name}</span>
                            <Select 
                              value={skill.years.toString()} 
                              onValueChange={(value) => updateSkillYears(skill.name, parseInt(value))}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((year) => (
                                  <SelectItem key={year} value={year.toString()}>{year} yr</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Portfolio */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input
                      id="github"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio / Live Projects URL</Label>
                    <Input
                      id="portfolio"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Upload Screenshots</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="screenshot-upload"
                        disabled={uploading}
                      />
                      <label htmlFor="screenshot-upload" className="cursor-pointer">
                        {uploading ? (
                          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                        ) : (
                          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        )}
                        <p className="mt-2 text-sm text-muted-foreground">
                          Click to upload project screenshots
                        </p>
                      </label>
                    </div>
                    {screenshots.length > 0 && (
                      <div className="grid gap-2 sm:grid-cols-3 mt-4">
                        {screenshots.map((screenshot) => (
                          <div key={screenshot.url} className="relative group">
                            <img
                              src={screenshot.url}
                              alt={screenshot.name}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeScreenshot(screenshot.url)}
                              className="absolute top-1 right-1 p-1 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3 text-destructive-foreground" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Availability */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="hours">Weekly Hours Available *</Label>
                    <Select value={formData.weeklyHours} onValueChange={(value) => setFormData({ ...formData, weeklyHours: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 hours/week</SelectItem>
                        <SelectItem value="20">20 hours/week</SelectItem>
                        <SelectItem value="30">30 hours/week</SelectItem>
                        <SelectItem value="40">40 hours/week (Full-time)</SelectItem>
                        <SelectItem value="50">50+ hours/week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label>Preferred Project Types</Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {projectTypeOptions.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={formData.preferredProjectTypes.includes(type)}
                            onCheckedChange={() => handleProjectTypeToggle(type)}
                          />
                          <Label htmlFor={type} className="cursor-pointer text-sm">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((s) => s - 1)}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                {currentStep < 4 ? (
                  <Button
                    onClick={() => setCurrentStep((s) => s + 1)}
                    disabled={!canProceed()}
                    className="gap-2"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed() || loading}
                    className="gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Complete Profile
                        <Check className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
