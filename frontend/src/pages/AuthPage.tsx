import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Leaf, LogIn, User, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, loginStatus, identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState<{ username?: string; location?: string }>({});

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched && userProfile !== null) {
      navigate({ to: '/dashboard' });
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Login error:', err);
      toast.error('Login failed. Please try again.');
    }
  };

  const validateProfile = () => {
    const newErrors: { username?: string; location?: string } = {};
    if (!username.trim()) newErrors.username = 'Name is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfile()) return;
    try {
      await saveProfile.mutateAsync({ username: username.trim(), location: location.trim() });
      toast.success('Profile saved! Welcome to FarmSmart.');
      navigate({ to: '/dashboard' });
    } catch {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center">
          <img
            src="/assets/generated/farmer-illustration.dim_400x400.png"
            alt="Farmer illustration"
            className="w-80 h-80 object-contain rounded-2xl"
          />
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Smart Farming Starts Here</h2>
            <p className="text-muted-foreground max-w-xs">
              Join thousands of farmers using AI-powered tools to grow smarter and earn more.
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div>
          {!isAuthenticated ? (
            <Card className="border border-border shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <Leaf className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">Welcome to FarmSmart</CardTitle>
                <CardDescription>
                  Sign in to access AI soil analysis, crop advisory, and the farming marketplace.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full bg-primary text-primary-foreground h-12 text-base font-semibold"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Login with Internet Identity
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Secure, decentralized authentication powered by the Internet Computer.
                </p>
              </CardContent>
            </Card>
          ) : showProfileSetup ? (
            <Card className="border border-border shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">Set Up Your Profile</CardTitle>
                <CardDescription>
                  Tell us a bit about yourself to personalize your FarmSmart experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="username">Your Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="username"
                        placeholder="e.g. John Farmer"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`pl-9 ${errors.username ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.username && (
                      <p className="text-xs text-destructive">{errors.username}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="location">Your Location / Region</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="e.g. Iowa, USA"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={`pl-9 ${errors.location ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.location && (
                      <p className="text-xs text-destructive">{errors.location}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={saveProfile.isPending}
                    className="w-full bg-primary text-primary-foreground h-12 text-base font-semibold"
                  >
                    {saveProfile.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Save & Continue
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
              <p className="text-muted-foreground">Redirecting to dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
