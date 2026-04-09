export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: any;
  dependsOn?: string;
  dependsOnValue?: string | string[];
  showWhen?: 'equals' | 'includes' | 'notEquals';
}