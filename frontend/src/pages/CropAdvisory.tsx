import { useState } from 'react';
import { useGetSmartCropAdvisory } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen,
  Sprout,
  Shield,
  Leaf,
  Loader2,
  FlaskConical,
  Droplets,
  MapPin,
  ChevronRight,
} from 'lucide-react';

export default function CropAdvisory() {
  const [soilType, setSoilType] = useState('');
  const [pHLevel, setPHLevel] = useState('');
  const [moisture, setMoisture] = useState('');
  const [region, setRegion] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const advisoryMutation = useGetSmartCropAdvisory();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!soilType.trim()) newErrors.soilType = 'Soil type is required';
    const ph = parseFloat(pHLevel);
    if (isNaN(ph) || ph < 0 || ph > 14) newErrors.pHLevel = 'Enter a valid pH (0–14)';
    const moist = parseFloat(moisture);
    if (isNaN(moist) || moist < 0 || moist > 100) newErrors.moisture = 'Enter moisture % (0–100)';
    if (!region.trim()) newErrors.region = 'Region is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await advisoryMutation.mutateAsync({
      soilType: soilType.trim(),
      pHLevel: parseFloat(pHLevel),
      moisture: parseFloat(moisture),
      region: region.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Smart Crop Advisory</h1>
              <p className="text-muted-foreground text-sm">
                Enter your soil parameters to get personalized crop recommendations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FlaskConical className="w-5 h-5 text-primary" />
                Soil Parameters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="soilType">Soil Type</Label>
                  <div className="relative">
                    <Leaf className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="soilType"
                      placeholder="e.g. Clay, Sandy, Loam"
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className={`pl-9 ${errors.soilType ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.soilType && <p className="text-xs text-destructive">{errors.soilType}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pHLevel">pH Level (0–14)</Label>
                  <div className="relative">
                    <FlaskConical className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="pHLevel"
                      type="number"
                      step="0.1"
                      min="0"
                      max="14"
                      placeholder="e.g. 6.5"
                      value={pHLevel}
                      onChange={(e) => setPHLevel(e.target.value)}
                      className={`pl-9 ${errors.pHLevel ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.pHLevel && <p className="text-xs text-destructive">{errors.pHLevel}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="moisture">Moisture Level (%)</Label>
                  <div className="relative">
                    <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="moisture"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      placeholder="e.g. 45"
                      value={moisture}
                      onChange={(e) => setMoisture(e.target.value)}
                      className={`pl-9 ${errors.moisture ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.moisture && <p className="text-xs text-destructive">{errors.moisture}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="region">Region / Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="region"
                      placeholder="e.g. Midwest, Iowa"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className={`pl-9 ${errors.region ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.region && <p className="text-xs text-destructive">{errors.region}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={advisoryMutation.isPending}
                  className="w-full bg-primary text-primary-foreground"
                >
                  {advisoryMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Get Crop Advisory
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-4">
            {advisoryMutation.isPending && (
              <div className="space-y-4">
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
              </div>
            )}

            {advisoryMutation.data && (
              <>
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Sprout className="w-5 h-5 text-green-600" />
                      Recommended Crops
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {advisoryMutation.data.crops.map((crop, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <ChevronRight className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-foreground">{crop}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Leaf className="w-5 h-5 text-primary" />
                      Sustainable Practices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {advisoryMutation.data.sustainablePractices.map((practice, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 bg-primary/5 rounded-lg">
                          <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{practice}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Shield className="w-5 h-5 text-amber-600" />
                      Risk Reduction Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {advisoryMutation.data.riskReductionTips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                          <ChevronRight className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {!advisoryMutation.data && !advisoryMutation.isPending && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div
                  className="w-full h-48 rounded-xl mb-4 bg-cover bg-center opacity-60"
                  style={{ backgroundImage: 'url(/assets/generated/soil-texture-bg.dim_800x400.png)' }}
                />
                <p className="text-muted-foreground text-sm">
                  Fill in your soil parameters and click "Get Crop Advisory" to see personalized recommendations.
                </p>
              </div>
            )}

            {advisoryMutation.isError && (
              <Card className="border border-destructive/30 bg-destructive/5">
                <CardContent className="p-4">
                  <p className="text-destructive text-sm">
                    Failed to get advisory. Please try again.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
