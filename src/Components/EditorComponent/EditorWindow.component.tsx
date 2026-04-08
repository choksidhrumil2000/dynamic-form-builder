import { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import Ajv from 'ajv';
// import { parse } from 'json-source-map';
import ButtonComponent from '../ButtonComponent/ButtonComponent.component';
import type { JsonEditorProps } from '../../types/JsonEditorProps';

// interface JsonEditorProps {
//   onChange?: (jsonData: any) => void;
//   initialValue?: string;
//   height?: string;
//   theme?: 'light' | 'dark';
// }

const ajv = new Ajv({ allErrors: true, strict: false });

// Define schema for form structure
const formSchema = {
  type: 'object',
  properties: {
    formTitle: { type: 'string' },
    formDescription: { type: 'string' },
    fields: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string', enum: ['text', 'email', 'number', 'select', 'checkbox', 'radio', 'textarea', 'date'] },
          label: { type: 'string' },
          placeholder: { type: 'string' },
          required: { type: 'boolean' },
          fields: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string', enum: ['text', 'email', 'number', 'select', 'checkbox', 'radio', 'textarea', 'date'] },
          label: { type: 'string' },
          placeholder: { type: 'string' },
          required: { type: 'boolean' },
          validation: { type: 'object' },
          options: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                value: { type: 'string' },
                label: { type: 'string' },
              },
            },
          },
        },},},
          validation: { type: 'object' },
          options: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                value: { type: 'string' },
                label: { type: 'string' },
              },
            },
          },
        },
        required: ['id', 'type', 'label'],
      },
    },
  },
  required: ['formTitle', 'fields'],
};

const validate = ajv.compile(formSchema);

export default function EditorWindow({
  onChange,
  // initialValue = '',
  height = '500px',
  // theme = 'dark',
  jsonText,
  setJsonText
}: JsonEditorProps) {
  // const [jsonText, setJsonText] = useState(initialValue);
  const [editorReady, setEditorReady] = useState(false);
  const [errors, setErrors] = useState<any[]>([]);
  const [isValidJson, setIsValidJson] = useState(true);

  const monacoRef = useRef<any>(null);
  const modelRef = useRef<any>(null);

  const handleMount = (editor: any, monaco: any) => {
    monacoRef.current = monaco;
    modelRef.current = editor.getModel();
    setEditorReady(true);

    // Set default editor options
    editor.updateOptions({
      formatOnPaste: true,
      formatOnType: true,
      autoIndent: 'full',
    });
  };

  const changeEffectOnOutputWindow = (value:string) => {
    // Call parent onChange callback
    if (onChange) {
      try {
        const parsed = JSON.parse(value);
        onChange(parsed);
      } catch {
        onChange(null);
      }
    }
  }

  const validateJSON = (text: string) => {
    if (!monacoRef.current || !modelRef.current) return;

    const markers: any[] = [];
    let parsedData: any = null;

    try {
      // Try to parse JSON
      parsedData = JSON.parse(text);
      setIsValidJson(true);

      // Validate against schema
      const valid = validate(parsedData);

      if (!valid && validate.errors) {
        setErrors(validate.errors);
        validate.errors.forEach((err) => {
          const errorPath = err.instancePath || '/';
          const lineMatch = text.split('\n').findIndex((line) =>
            line.includes(err.keyword) || line.includes(errorPath.split('/').pop() || '')
          );

          markers.push({
            startLineNumber: lineMatch > 0 ? lineMatch + 1 : 1,
            startColumn: 1,
            endLineNumber: lineMatch > 0 ? lineMatch + 1 : 1,
            endColumn: 100,
            message: `Schema Error: ${err.message} at ${errorPath}`,
            severity: monacoRef.current.MarkerSeverity.Warning,
          });
        });
      } else {
        setErrors([]);
      }
    } catch (err: any) {
      setIsValidJson(false);
      setErrors([{ message: 'Invalid JSON: ' + err.message }]);

      // Mark the error line
      const errorLine = err.message.match(/position (\d+)/);
      if (errorLine) {
        const errorPos = parseInt(errorLine[1]);
        const lineNum = text.substring(0, errorPos).split('\n').length;

        markers.push({
          startLineNumber: lineNum,
          startColumn: 1,
          endLineNumber: lineNum,
          endColumn: 100,
          message: `JSON Syntax Error: ${err.message}`,
          severity: monacoRef.current.MarkerSeverity.Error,
        });
      }
    }

    // Set markers in editor
    monacoRef.current.editor.setModelMarkers(modelRef.current, 'validation', markers);
  // console.log(errors);
  };

  useEffect(()=>{
    try{
      if(localStorage.getItem("JsonText")){
        const storedJson = localStorage.getItem("JsonText") || '';
        // console.log("local storage get json executed useEffect in Editor Window",storedJson);
        setJsonText(JSON.parse(JSON.stringify(storedJson)));
      }
    }catch(err){
      console.error("Error parsing JSON from localStorage:", err);
    }
  },[]);

  useEffect(() => {
    // console.log("Editor Ready:", editorReady);
    // console.log("Current JSON Text:", jsonText);
    if (editorReady && jsonText) {
      localStorage.setItem("JsonText",jsonText);
      validateJSON(jsonText);
      if(isValidJson){
        changeEffectOnOutputWindow(jsonText);
      }
    }
    // console.log("JSon Text",jsonText);
  }, [jsonText, editorReady]);

  

  const handleChange = (value: string | undefined) => {
    const newValue = value || '';
    setJsonText(newValue);
    localStorage.setItem("JsonText",newValue);
    changeEffectOnOutputWindow(newValue);
    
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
    } catch (err) {
      alert('Invalid JSON - Cannot format');
    }
  };

//   const defaultTemplate = `{
//   "formTitle": "User Registration",
//   "formDescription": "Please fill in your details",
//   "fields": [
//     {
//       "id": "name",
//       "type": "text",
//       "label": "Full Name",
//       "placeholder": "Enter your full name",
//       "required": true
//     },
//     {
//       "id": "email",
//       "type": "email",
//       "label": "Email Address",
//       "placeholder": "Enter your email",
//       "required": true
//     },
//     {
//       "id": "country",
//       "type": "select",
//       "label": "Country",
//       "required": true,
//       "options": [
//         { "value": "usa", "label": "United States" },
//         { "value": "uk", "label": "United Kingdom" },
//         { "value": "canada", "label": "Canada" }
//       ]
//     },
//     {
//       "id": "terms",
//       "type": "checkbox",
//       "label": "I agree to the terms and conditions",
//       "required": true
//     }
//   ]
// }`;

 const defaultTemplate = `{
  "formTitle": "User Registration with Conditional Fields",
  "formDescription": "Fill in your details. Admin-specific fields will appear when applicable.",
  "fields": [
    {
      "id": "name",
      "type": "text",
      "label": "Full Name",
      "placeholder": "Enter your full name",
      "required": true
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email Address",
      "placeholder": "Enter your email",
      "required": true
    },
    {
      "id": "role",
      "type": "select",
      "label": "User Role",
      "required": true,
      "options": [
        { "value": "user", "label": "Regular User" },
        { "value": "admin", "label": "Administrator" },
        { "value": "moderator", "label": "Moderator" }
      ]
    },
    {
      "id": "adminCode",
      "type": "text",
      "label": "Admin Authorization Code",
      "placeholder": "Enter your admin code",
      "required": true,
      "dependsOn": "role",
      "dependsOnValue": ["admin"],
      "showWhen": "includes"
    },
    {
      "id": "moderationArea",
      "type": "select",
      "label": "Moderation Area",
      "required": true,
      "dependsOn": "role",
      "dependsOnValue": ["admin", "moderator"],
      "showWhen": "includes",
      "options": [
        { "value": "content", "label": "Content Moderation" },
        { "value": "users", "label": "User Management" },
        { "value": "reports", "label": "Report Handling" }
      ]
    },
    {
      "id":"gender",
      "type":"radio",
      "label":"gender",
      "required":true,
      "options":[
        {"value":"male","label":"Male"},
        {"value":"female","label":"Female"}
      ]
    },
    {
      "id": "standardUserBenefit",
      "type": "checkbox",
      "label": "I want to receive newsletters",
      "dependsOn": "role",
      "dependsOnValue": "admin",
      "showWhen": "notEquals"
    }
  ]
}`;

const handleLoadTemplate = () => {
    setJsonText(defaultTemplate);
    changeEffectOnOutputWindow(defaultTemplate);
}

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">JSON Editor</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isValidJson ? '✅ Valid JSON' : '❌ Invalid JSON'}
          </p>
        </div>
        <div className="flex gap-2">
          {/* <button
            onClick={handleFormatJson}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Format JSON
          </button> */}
          <ButtonComponent buttonfield={{
            type:"button",
            onClick:handleFormatJson,
            buttonClasses:"px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition",
            text:"Format JSON"
          }} />
          {/* <button
            onClick={() => setJsonText(defaultTemplate)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Load Template
          </button> */}
          <ButtonComponent buttonfield={{
            type:"button",
            onClick:handleLoadTemplate, 
            buttonClasses:"px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition",
            text:"Load Template"
          }} />
        </div>
      </div>

      {/* Editor */}
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <Editor
          height={height}
          defaultLanguage="json"
          // theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
          value={jsonText}
          onMount={handleMount}
          onChange={handleChange}
          options={{
            minimap: { enabled: true },
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            formatOnPaste: true,
          }}
        />
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h3 className="text-red-800 dark:text-red-300 font-semibold mb-2">Validation Errors:</h3>
          <ul className="space-y-1">
            {errors.map((err, idx) => (
              <li key={idx} className="text-red-700 dark:text-red-300 text-sm">
                • {err.message || err.instancePath}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}