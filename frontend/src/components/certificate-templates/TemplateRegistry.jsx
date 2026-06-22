import React from 'react';
import ModernMinimalist from './ModernMinimalist';
import CyberpunkGrid from './CyberpunkGrid';
import ExecutiveGlass from './ExecutiveGlass';
import OrgCustom01 from './OrgCustom01';

// Register system default templates here
export const systemTemplates = {
  modern: {
    name: 'Modern Minimalist',
    component: ModernMinimalist
  },
  cyberpunk: {
    name: 'Cyberpunk Grid',
    component: CyberpunkGrid
  },
  executive: {
    name: 'Executive Glass',
    component: ExecutiveGlass
  }
};

// Register custom client components here
export const customComponentRegistry = {
  'org-custom-01': OrgCustom01
};

// Helper function to get a template component by ID
export const getTemplateComponent = (templateId) => {
  return systemTemplates[templateId]?.component || customComponentRegistry[templateId] || ModernMinimalist;
};

// Helper function to get template details
export const getTemplateDetails = (templateId) => {
  if (systemTemplates[templateId]) return systemTemplates[templateId];
  if (customComponentRegistry[templateId]) return { name: 'Custom Template', component: customComponentRegistry[templateId] };
  return systemTemplates['modern'];
};

// Helper function to get default templates array (for dropdowns)
export const getDefaultTemplates = () => {
  return Object.keys(systemTemplates).map(key => ({
    id: key,
    name: systemTemplates[key].name
  }));
};
