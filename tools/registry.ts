
import React from 'react';
import { ToolDefinition, ToolCategory } from '../types';

import KlingWorkspace from './video/kling/KlingWorkspace';
import NanoBananaWorkspace from './image/nano-banana/NanoBananaWorkspace';

export interface ToolEntry extends ToolDefinition {
  component: React.FC<{ tool: ToolDefinition; user: any; onUserUpdate: (userData: any) => void }>;
}

export const TOOLS: ToolEntry[] = [
  {
    id: 'nano-banana',
    name: 'Nano Banana',
    description: 'Ultra-fast image generation (Google Flash 2.5)',
    category: ToolCategory.IMAGE,
    apiId: 385,
    icon: 'banana',
    isTop: true,
    isModel: true,
    parameters: [
      { id: 'img_model', label: 'Model', type: 'select', options: ['img-google/flash-25', 'img-flux/kontext-max', 'img-flux/pro1.1'], defaultValue: 'img-google/flash-25' },
      { id: 'aspect_ratio', label: '1:1', type: 'select', options: ['1:1', '4:3', '16:9', '9:16'], defaultValue: '1:1' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    component: NanoBananaWorkspace
  },
  {
    id: 'kling-video',
    name: 'Kling Video 2.6',
    description: 'Cinematic AI video generation',
    category: ToolCategory.VIDEO,
    apiId: 601,
    icon: 'video',
    isBest: true,
    isModel: true,
    parameters: [],
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400',
    component: KlingWorkspace as any
  }
];
