import React, { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useAnalyzeSoilImage } from '../hooks/useQueries';
import type { SoilAnalysisResult } from '../backend';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Camera, Upload, Loader2, CheckCircle2, AlertCircle,
  Sprout, ShieldCheck, ArrowLeft, ImageIcon, RefreshCw, ShoppingBag
} from 'lucide-react';

export default function SoilAnalysis() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const analyzeMutation = useAnalyzeSoilImage();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBytes, setImageBytes] = useState<Uint8Array | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<SoilAnalysisResult | null>(null);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!identity) {
    navigate({ to: '/auth' });
    return null;
  }

  const handleFileSelect = (file: File) => {
    setError('');
    setResult(null);
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    const arrayReader = new FileReader();
    arrayReader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      setImageBytes(new Uint8Array(buffer));
    };
    arrayReader.readAsArrayBuffer(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleAnalyze = async () => {
    if (!imageBytes) return;
    setError('');
    setResult(null);

    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) { clearInterval(interval); return 90; }
        return prev + 15;
      });
    }, 200);

    try {
      const analysisResult = await analyzeMutation.mutateAsync(imageBytes);
      clearInterval(interval);
      setUploadProgress(100);
      setResult(analysisResult);
    } catch {
      clearInterval(interval);
      setUploadProgress(0);
      setError('Analysis failed. Please ensure you are logged in and try again.');
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImageBytes(null);
    setResult(null);
    setError('');
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/dashboard' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Soil Image Analysis</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Upload a photo of your soil to get crop recommendations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              {selectedImage ? (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-muted">
                    <img
                      src={selectedImage}
                      alt="Selected soil"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={handleReset}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Analyzing...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                  <Button
                    className="w-full h-11 font-bold"
                    onClick={handleAnalyze}
                    disabled={analyzeMutation.isPending}
                  >
                    {analyzeMutation.isPending ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Analyzing Soil...</>
                    ) : (
                      <><Sprout className="h-4 w-4 mr-2" /> Analyze This Soil</>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">Upload Soil Photo</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Take a clear photo of your soil or upload an existing one
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => cameraInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Camera className="h-4 w-4" /> Take Photo
                    </Button>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" /> Upload Image
                    </Button>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInputChange}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileInputChange}
              />
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-amber-800">📸 Tips for Best Results</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm text-amber-700 space-y-1.5">
                <li>• Take photo in natural daylight</li>
                <li>• Capture a close-up of the soil surface</li>
                <li>• Avoid shadows or reflections</li>
                <li>• Include a small area (30cm × 30cm) of soil</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!result && !analyzeMutation.isPending && (
            <Card className="border-dashed border-2 border-border">
              <CardContent className="py-16 text-center">
                <Sprout className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">Analysis results will appear here</p>
                <p className="text-muted-foreground/60 text-sm mt-1">Upload a soil image to get started</p>
              </CardContent>
            </Card>
          )}

          {analyzeMutation.isPending && (
            <Card>
              <CardContent className="py-16 text-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-3" />
                <p className="font-semibold text-lg">Analyzing your soil...</p>
                <p className="text-muted-foreground text-sm mt-1">This may take a few seconds</p>
              </CardContent>
            </Card>
          )}

          {result && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">Soil Analysis Complete!</span>
              </div>

              {/* Recommended Crops */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                    <Sprout className="h-5 w-5" />
                    Recommended Crops
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    Best crops to grow on this soil type
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {result.recommendedCrops.map((crop, i) => (
                      <Badge
                        key={i}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm font-semibold"
                      >
                        🌱 {crop}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Prevention Tips */}
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                    <ShieldCheck className="h-5 w-5" />
                    Care & Prevention Tips
                  </CardTitle>
                  <CardDescription className="text-amber-700">
                    Follow these practices for a healthy harvest
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {result.preventionTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                        <span className="text-amber-500 font-bold mt-0.5">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate({ to: '/marketplace' })}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Find Fertilizers & Seeds Nearby
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
