import type { FormStructure } from "./FormStructure";

export interface DynamicFormGeneratorProps {
  formStructure: FormStructure | null;
  onChange:(jsonData:any)=>void;
  jsonText:string;
  setJsonText:(text:string)=>void;
}