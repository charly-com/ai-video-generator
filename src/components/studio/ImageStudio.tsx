
// ══════════════════════════════════════════════════════════════
// components/studio/ImageStudio.tsx
// ══════════════════════════════════════════════════════════════
'use client';
 
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { FAL_MODELS } from '../../lib/fal/client';
import Image from 'next/image';
 
const schema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(2000),
  negativePrompt: z.string().optional(),
  model: z.string(),
  width: z.coerce.number(),
  height: z.coerce.number(),
  numInferenceSteps: z.coerce.number(),
  guidanceScale: z.coerce.number(),
  outputFormat: z.enum(['jpeg', 'png', 'webp']),
});
 
type FormValues = z.infer<typeof schema>;
 
const MODEL_OPTIONS = [
  { value: FAL_MODELS.FLUX_DEV, label: 'FLUX Dev (best quality)' },
  { value: FAL_MODELS.FLUX_SCHNELL, label: 'FLUX Schnell (fastest)' },
  { value: FAL_MODELS.FLUX_PRO, label: 'FLUX Pro (premium)' },
  { value: FAL_MODELS.AURA_FLOW, label: 'Aura Flow' },
  { value: FAL_MODELS.IDEOGRAM, label: 'Ideogram v2' },
];
 
export function ImageStudio() {
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
 
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      model: FAL_MODELS.FLUX_DEV,
      width: 1024,
      height: 1024,
      numInferenceSteps: 28,
      guidanceScale: 3.5,
      outputFormat: 'png',
    },
  });
 
  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true);
    setGeneratedUrl(null);
    try {
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Generation failed');
      setGeneratedUrl(json.url);
      toast.success('Image generated!');
    } catch (err) {
      toast.error(String(err));
    } finally {
      setIsGenerating(false);
    }
  };
 
  const handleOptimizePrompt = async () => {
    const roughIdea = watch('prompt');
    if (!roughIdea) return toast.error('Enter a prompt first');
    try {
      const res = await fetch('/api/ai/optimize-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roughIdea, targetModel: watch('model'), contentType: 'image' }),
      });
      const data = await res.json();
      setValue('prompt', data.optimizedPrompt);
      setValue('negativePrompt', data.negativePrompt);
      toast.success('Prompt optimized by Claude');
    } catch {
      toast.error('Failed to optimize prompt');
    }
  };
 
  return (
    <div className="grid grid-cols-[280px_1fr_260px] gap-5 h-[calc(100vh-200px)]">
      {/* Left panel */}
      <div className="border rounded-xl p-4 overflow-y-auto space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">FAL model</label>
          <Select onValueChange={v => setValue('model', v)} defaultValue={FAL_MODELS.FLUX_DEV}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {MODEL_OPTIONS.map(m => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Prompt</label>
            <button onClick={handleOptimizePrompt} className="text-[10px] text-violet-600 hover:underline">
              Optimize with Claude ↗
            </button>
          </div>
          <Textarea {...register('prompt')} placeholder="A vibrant product photo..." className="min-h-[100px]" />
          {errors.prompt && <p className="text-xs text-destructive mt-1">{errors.prompt.message}</p>}
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Negative prompt</label>
          <Textarea {...register('negativePrompt')} placeholder="blurry, watermark..." className="min-h-[60px]" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Width</label>
            <Select onValueChange={(v: string) => setValue('width', Number(v))} defaultValue="1024">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[512, 768, 1024, 1280, 1536].map(n => <SelectItem key={n} value={String(n)}>{n}px</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Height</label>
            <Select onValueChange={(v: string) => setValue('height', Number(v))} defaultValue="1024">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[512, 768, 1024, 1280, 1536].map(n => <SelectItem key={n} value={String(n)}>{n}px</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleSubmit(onSubmit)} disabled={isGenerating} className="w-full">
          {isGenerating ? 'Generating...' : 'Generate image'}
        </Button>
      </div>
 
      {/* Canvas */}
      <div className="border rounded-xl flex items-center justify-center bg-background overflow-hidden">
        {!generatedUrl && !isGenerating && (
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Your image will appear here</p>
            <p className="text-xs mt-1 opacity-60">Configure settings and click generate</p>
          </div>
        )}
        {isGenerating && (
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-muted border-t-violet-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Generating with FAL AI...</p>
          </div>
        )}
        {generatedUrl && (
          <div className="flex flex-col items-center gap-4 p-4">
            <Image src={generatedUrl} alt="Generated" width={512} height={512} className="rounded-lg max-h-[60vh] object-contain" />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild><a href={generatedUrl} download>Download</a></Button>
              <Button size="sm">Publish to social</Button>
            </div>
          </div>
        )}
      </div>
 
      {/* Right panel */}
      <div className="border rounded-xl p-4 overflow-y-auto space-y-4">
        <p className="text-sm font-medium">Output & publishing</p>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Format</label>
          <Select onValueChange={v => setValue('outputFormat', v as 'jpeg' | 'png' | 'webp')} defaultValue="png">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <hr className="border-border" />
        <p className="text-xs font-medium">Save to library automatically</p>
        <p className="text-xs text-muted-foreground">All generated images are saved to your library for easy reuse and publishing.</p>
      </div>
    </div>
  );
}