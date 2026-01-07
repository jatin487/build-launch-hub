import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LiveChat } from '@/components/chat/LiveChat';
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Project Type', description: 'What do you need?' },
  { id: 2, title: 'Features', description: 'What features do you need?' },
  { id: 3, title: 'Budget & Timeline', description: 'What\'s your budget?' },
  { id: 4, title: 'Contact Info', description: 'How can we reach you?' },
];

const projectTypes = [
  { value: 'new_website', label: 'New Website', description: 'Build a brand new website from scratch' },
  { value: 'shopify_store', label: 'Shopify Store', description: 'Launch your e-commerce store on Shopify' },
  { value: 'website_redesign', label: 'Website Redesign', description: 'Refresh and modernize your existing site' },
  { value: 'maintenance', label: 'Maintenance', description: 'Ongoing support and updates' },
];

const featuresList = [
  'User Authentication',
  'Payment Integration',
  'Admin Dashboard',
  'Blog/CMS',
  'E-commerce Features',
  'Search Functionality',
  'Email Notifications',
  'Analytics Integration',
  'Social Media Integration',
  'API Development',
  'Mobile Responsive',
  'SEO Optimization',
];

const budgetRanges = [
  { value: '1000-3000', label: '$1,000 - $3,000' },
  { value: '3000-5000', label: '$3,000 - $5,000' },
  { value: '5000-10000', label: '$5,000 - $10,000' },
  { value: '10000-25000', label: '$10,000 - $25,000' },
  { value: '25000+', label: '$25,000+' },
];

const timelineOptions = [
  { value: 'asap', label: 'ASAP (Rush)' },
  { value: '1-2months', label: '1-2 Months' },
  { value: '2-3months', label: '2-3 Months' },
  { value: '3+months', label: '3+ Months' },
  { value: 'flexible', label: 'Flexible' },
];

export default function StartProject() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    projectType: '',
    features: [] as string[],
    customRequirements: '',
    budget: '',
    timeline: '',
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!formData.projectType;
      case 2:
        return formData.features.length > 0 || formData.customRequirements.trim();
      case 3:
        return !!formData.budget && !!formData.timeline;
      case 4:
        return formData.name.trim() && formData.email.trim();
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    const budgetParts = formData.budget.split('-');
    const budgetMin = parseInt(budgetParts[0].replace(/\D/g, '')) || null;
    const budgetMax = budgetParts[1] 
      ? parseInt(budgetParts[1].replace(/\D/g, '')) 
      : budgetParts[0].includes('+') ? null : budgetMin;

    const { error } = await supabase
      .from('project_submissions')
      .insert({
        project_type: formData.projectType as 'new_website' | 'shopify_store' | 'website_redesign' | 'maintenance',
        features: formData.features,
        custom_requirements: formData.customRequirements.trim() || null,
        budget_min: budgetMin,
        budget_max: budgetMax,
        timeline: formData.timeline,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        company: formData.company.trim() || null,
      });

    setLoading(false);

    if (error) {
      toast.error('Failed to submit. Please try again.');
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-lg border-border">
              <CardContent className="py-16 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <Check className="h-8 w-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Project Request Submitted!
                </h2>
                <p className="text-muted-foreground mb-8">
                  Thank you for your interest! We've received your project details and will get back to you within 24 hours.
                </p>
                <Button asChild>
                  <a href="/">Back to Home</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
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
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm text-accent-foreground mb-4">
              <Sparkles className="h-4 w-4" />
              Project Requirement Check
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Tell Us About Your Project
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Complete this quick form to help us understand your needs and provide an accurate quote.
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
                      step.id
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-1 w-12 sm:w-24 lg:w-32 mx-2 rounded-full transition-colors",
                        currentStep > step.id ? "bg-primary" : "bg-border"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-sm">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "text-center",
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <span className="hidden sm:block">{step.title}</span>
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
              {/* Step 1: Project Type */}
              {currentStep === 1 && (
                <RadioGroup
                  value={formData.projectType}
                  onValueChange={(value) => setFormData({ ...formData, projectType: value })}
                  className="space-y-3"
                >
                  {projectTypes.map((type) => (
                    <div key={type.value} className="flex items-start space-x-3">
                      <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                      <Label htmlFor={type.value} className="cursor-pointer flex-1">
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-muted-foreground">{type.description}</div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {/* Step 2: Features */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {featuresList.map((feature) => (
                      <div key={feature} className="flex items-center space-x-3">
                        <Checkbox
                          id={feature}
                          checked={formData.features.includes(feature)}
                          onCheckedChange={() => handleFeatureToggle(feature)}
                        />
                        <Label htmlFor={feature} className="cursor-pointer text-sm">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom">Additional Requirements</Label>
                    <Textarea
                      id="custom"
                      rows={4}
                      placeholder="Describe any specific features or requirements..."
                      value={formData.customRequirements}
                      onChange={(e) => setFormData({ ...formData, customRequirements: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Budget & Timeline */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Budget Range *</Label>
                    <RadioGroup
                      value={formData.budget}
                      onValueChange={(value) => setFormData({ ...formData, budget: value })}
                      className="space-y-2"
                    >
                      {budgetRanges.map((range) => (
                        <div key={range.value} className="flex items-center space-x-3">
                          <RadioGroupItem value={range.value} id={`budget-${range.value}`} />
                          <Label htmlFor={`budget-${range.value}`} className="cursor-pointer">
                            {range.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="space-y-3">
                    <Label>Timeline *</Label>
                    <RadioGroup
                      value={formData.timeline}
                      onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                      className="space-y-2"
                    >
                      {timelineOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-3">
                          <RadioGroupItem value={option.value} id={`timeline-${option.value}`} />
                          <Label htmlFor={`timeline-${option.value}`} className="cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Step 4: Contact Info */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mt-6 p-4 bg-accent rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Project Summary</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium">Type:</span>{' '}
                        {projectTypes.find((t) => t.value === formData.projectType)?.label || '-'}
                      </p>
                      <p>
                        <span className="font-medium">Features:</span>{' '}
                        {formData.features.length > 0 ? formData.features.join(', ') : 'None selected'}
                      </p>
                      <p>
                        <span className="font-medium">Budget:</span>{' '}
                        {budgetRanges.find((b) => b.value === formData.budget)?.label || '-'}
                      </p>
                      <p>
                        <span className="font-medium">Timeline:</span>{' '}
                        {timelineOptions.find((t) => t.value === formData.timeline)?.label || '-'}
                      </p>
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
                        Submit Request
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
      <LiveChat />
    </div>
  );
}
