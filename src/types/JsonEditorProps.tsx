export interface JsonEditorProps {
  onChange?: (jsonData: any) => void;
  initialValue?: string;
  height?: string;
  theme?: 'light' | 'dark';
  jsonText:string;
  setJsonText:(text:string)=>void;
}