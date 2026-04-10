export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[] | undefined;
  fields?:FormField[];
  validation?: any;
  dependsOn?: string;
  dependsOnValue?: string | string[];
  showWhen?: 'equals' | 'includes' | 'notEquals';
}