import type { Dispatch, SetStateAction } from "react";
import type { FormStructure } from "./FormStructure";

export interface JsonEditorProps {
  // onChange?: (jsonData: any) => void;
  // onChange?: Dispatch<SetStateAction<string|null>>
  // onChange?: (value: unknown) => void;
  onChange?:Dispatch<SetStateAction<FormStructure|null>>
  // onChange?: (value: FormStructure | null | Dispatch<SetStateAction<FormStructure | null>>) => void | Dispatch<SetStateAction<FormStructure | null>>;
  initialValue?: string;
  height?: string;
  theme?: 'light' | 'dark';
  jsonText:string;
  // setJsonText:(text:string)=>void;
    setJsonText:Dispatch<SetStateAction<string>>;

}