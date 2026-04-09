// ══════════════════════════════════════════════════════════════
// app/(dashboard)/studio/page.tsx
// ══════════════════════════════════════════════════════════════
'use client';
 
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageStudio } from '@/components/studio/ImageStudio';
import { VideoStudio } from '@/components/studio/VideoStudio';
import { EditStudio } from '@/components/studio/EditStudio';
import { ScriptStudio } from '@/components/studio/ScriptStudio';
 
export default function StudioPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-medium">Content Studio</h1>
        <p className="text-muted-foreground mt-1">Generate images, videos, and scripts using AI.</p>
      </div>
      <Tabs defaultValue="image">
        <TabsList>
          <TabsTrigger value="image">Image generation</TabsTrigger>
          <TabsTrigger value="video">Video generation</TabsTrigger>
          <TabsTrigger value="edit">Edit image</TabsTrigger>
          <TabsTrigger value="script">Script & prompts</TabsTrigger>
        </TabsList>
        <TabsContent value="image" className="mt-4"><ImageStudio /></TabsContent>
        <TabsContent value="video" className="mt-4"><VideoStudio /></TabsContent>
        <TabsContent value="edit" className="mt-4"><EditStudio /></TabsContent>
        <TabsContent value="script" className="mt-4"><ScriptStudio /></TabsContent>
      </Tabs>
    </div>
  );
}
