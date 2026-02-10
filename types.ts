
export enum ToolCategory {
  IMAGE = 'Image',
  VIDEO = 'Video',
  EDIT = 'Edit',
  CHARACTER = 'Character',
  INPAINT = 'Inpaint',
  MUSIC = 'Music'
}

export type ParameterType = 'select' | 'range' | 'toggle' | 'text' | 'image_upload';

export interface ToolParameter {
  id: string;
  label: string;
  type: ParameterType;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue: any;
  icon?: string;
  group?: string; // Для логической группировки в UI
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  apiId: number;
  icon: string;
  parameters: ToolParameter[];
  isNew?: boolean;
  isBeta?: boolean;
  isTop?: boolean;
  isBest?: boolean;
  isModel?: boolean;
  thumbnail?: string;
}

export interface GenerationRequest {
  toolId: number;
  prompt: string;
  params: Record<string, any>;
}
