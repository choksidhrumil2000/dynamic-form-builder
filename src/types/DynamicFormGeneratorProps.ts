import type { Dispatch, SetStateAction } from "react";
import type { FormStructure } from "./FormStructure";

export interface DynamicFormGeneratorProps {
  formStructure?: FormStructure | null;
  // onChange?:(jsonData:FormStructure | string | null)=>void
  // onChange?:(jsonData:Dispatch<SetStateAction<FormStructure | null>>)=>void;
  // onChange?:((prev:FormStructure)=>Dispatch<SetStateAction<FormStructure | null>>)=>void;
  onChange?:Dispatch<SetStateAction<FormStructure | null>>;
  jsonText?:string;
  setJsonText?:(text:string)=>void;
  open?:boolean;
  setOpen?:(open:boolean)=>void;
  modalFormJson?:FormStructure | null;
}