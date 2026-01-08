import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, Shield, Code2 } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, role, signIn, signUp, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const defaultTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';
  const userType = searchParams.get('type') || 'admin'; // 'admin' or 'developer'

  useEffect(() => {
    if (user && !authLoading) {
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'developer') {
        navigate('/developer/dashboard');
      }
    }
  }, [user, role, authLoading, navigate]);

  const handleSubmit = async (isLogin: boolean) => {
    try {
      const validation = authSchema.safeParse({ email, password });
      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        return;
      }

      setLoading(true);

      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Logged in successfully!');
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Account created! Redirecting...');
          // For developers, redirect to onboarding
          if (userType === 'developer') {
            navigate('/developer/onboarding');
          }
        }
      }
    } finally {
      setLoading(false);
    }
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
      <main className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-md border-border">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                {userType === 'developer' ? (
                  <Code2 className="h-6 w-6 text-primary" />
                ) : (
                  <Shield className="h-6 w-6 text-primary" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {userType === 'developer' ? 'Developer Portal' : 'Admin Login'}
              </CardTitle>
              <CardDescription>
                {userType === 'developer' 
                  ? 'Join our team of developers' 
                  : 'Access the admin dashboard'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={defaultTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(true); }} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(false); }} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {userType === 'developer' && (
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Looking for admin access?{' '}
                  <a href="/auth?type=admin" className="text-primary hover:underline">
                    Admin Login
                  </a>
                </p>
              )}
              {userType === 'admin' && (
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Want to join as a developer?{' '}
                  <a href="/auth?type=developer&tab=signup" className="text-primary hover:underline">
                    Developer Portal
                  </a>
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
