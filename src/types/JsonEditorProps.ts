export interface JsonEditorProps {
  // onChange?: (jsonData: any) => void;
  // onChange?: Dispatch<SetStateAction<string|null>>
  onChange?: (value: unknown) => void;
  initialValue?: string;
  height?: string;
  theme?: 'light' | 'dark';
  jsonText:string;
  setJsonText:(text:string)=>void;
}