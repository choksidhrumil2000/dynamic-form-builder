import type { FormField } from "./FormField";

export interface FormStructure {
  formTitle: string;
  formDescription?: string;
  fields: FormField[];
}