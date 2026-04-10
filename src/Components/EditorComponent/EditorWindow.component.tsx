import { useEffect, useState, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import Ajv from "ajv";
// import { parse } from 'json-source-map';
import ButtonComponent from "../ButtonComponent/ButtonComponent.component";
import type { editor } from "monaco-editor";
import type { ErrorObject } from "ajv"; 

import type { Dispatch, SetStateAction } from "react";
import type { FormStructure } from "../OutputWindow/OutputWindow.Component";

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

const ajv = new Ajv({ allErrors: true, strict: false });

//This is Old Schema............
// Define schema for form structure
// const formSchema = {
//   type: 'object',
//   properties: {
//     formTitle: { type: 'string' },
//     formDescription: { type: 'string' },
//     fields: {
//       type: 'array',
//       items: {
//         type: 'object',
//         properties: {
//           id: { type: 'string' },
//           type: { type: 'string', enum: ['text', 'email', 'number', 'select', 'checkbox', 'radio', 'textarea', 'date'] },
//           label: { type: 'string' },
//           placeholder: { type: 'string' },
//           required: { type: 'boolean' },
//           fields: {
//       type: 'array',
//       items: {
//         type: 'object',
//         properties: {
//           id: { type: 'string' },
//           type: { type: 'string', enum: ['text', 'email', 'number', 'select', 'checkbox', 'radio', 'textarea', 'date'] },
//           label: { type: 'string' },
//           placeholder: { type: 'string' },
//           required: { type: 'boolean' },
//           validation: { type: 'object' },
//           options: {
//             type: 'array',
//             items: {
//               type: 'object',
//               properties: {
//                 value: { type: 'string' },
//                 label: { type: 'string' },
//               },
//             },
//           },
//         },},},
//           validation: { type: 'object' },
//           options: {
//             type: 'array',
//             items: {
//               type: 'object',
//               properties: {
//                 value: { type: 'string' },
//                 label: { type: 'string' },
//               },
//             },
//           },
//         },
//         required: ['id', 'type', 'label'],
//       },
//     },
//   },
//   required: ['formTitle', 'fields'],
// };

//This is new Schema..................
const formSchema = {
  type: "object",
  properties: {
    formTitle: { type: "string" },
    formDescription: { type: "string" },
    fields: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          type: {
            type: "string",
            enum: [
              "text",
              "email",
              "number",
              "select",
              "checkbox",
              "radio",
              "textarea",
              "date",
            ],
          },
          label: { type: "string" },
          placeholder: { type: "string" },
          required: { type: "boolean" },
          validation: { type: "object" },
          dependsOn: { type: "string" },
          dependsOnValue: {
            oneOf: [
              { type: "string" },
              { type: "array", items: { type: "string" } },
            ],
          },
          showWhen: {
            type: "string",
            enum: ["includes", "notEquals", "equals"],
          },
          options: {
            type: "array",
            items: {
              type: "object",
              properties: {
                value: { type: "string" },
                label: { type: "string" },
              },
              additionalProperties: false,
            },
          },
          fields: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                type: {
                  type: "string",
                  enum: [
                    "text",
                    "email",
                    "number",
                    "select",
                    "checkbox",
                    "radio",
                    "textarea",
                    "date",
                  ],
                },
                label: { type: "string" },
                placeholder: { type: "string" },
                required: { type: "boolean" },
                validation: { type: "object" },
                dependsOn: { type: "string" },
                dependsOnValue: {
                  oneOf: [
                    { type: "string" },
                    { type: "array", items: { type: "string" } },
                  ],
                },
                showWhen: {
                  type: "string",
                  enum: ["includes", "notEquals", "equals"],
                },
                options: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      value: { type: "string" },
                      label: { type: "string" },
                    },
                    additionalProperties: false,
                  },
                },
              },
              required: ["id", "type", "label"],
              additionalProperties: false,
            },
          },
        },
        required: ["id", "type", "label"],
        additionalProperties: false, // <-- THE KEY CHANGE
      },
    },
  },
  required: ["formTitle", "fields"],
};

const validate = ajv.compile(formSchema);

export default function EditorWindow({
  onChange,
  // initialValue = '',
  height = "500px",
  // theme = 'dark',
  jsonText,
  setJsonText,
}: JsonEditorProps) {
  const [editorReady, setEditorReady] = useState(false);
  // const [errors, setErrors] = useState<any[]>([]);
  const [errors, setErrors] = useState<ErrorObject[]>([]);
  const [isValidJson, setIsValidJson] = useState(true);

  // const monacoRef = useRef<any>(null);
  // const modelRef = useRef<any>(null);

  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
  const modelRef = useRef<editor.ITextModel | null>(null);

  const handleMount: OnMount = (editor, monaco) => {
    monacoRef.current = monaco;
    modelRef.current = editor.getModel();
    setEditorReady(true);

    // Set default editor options
    editor.updateOptions({
      formatOnPaste: true,
      formatOnType: true,
      autoIndent: "full",
    });
  };

  const changeEffectOnOutputWindow = (value: string) => {
    // Call parent onChange callback
    if (onChange) {
      try {
        const parsed = JSON.parse(value);
        onChange(parsed);
      } catch {
        onChange(null);
      }
    }
  };

  // const validateJSON = (text: string) => {
  //   if (!monacoRef.current || !modelRef.current) return;

  //   const markers: any[] = [];
  //   let parsedData: any = null;

  //   try {
  //     // Try to parse JSON
  //     parsedData = JSON.parse(text);
  //     setIsValidJson(true);

  //     // Validate against schema
  //     const valid = validate(parsedData);

  //     if (!valid && validate.errors) {
  //       setErrors(validate.errors);
  //       validate.errors.forEach((err) => {
  //         const errorPath = err.instancePath || '/';
  //         const lineMatch = text.split('\n').findIndex((line) =>
  //           line.includes(err.keyword) || line.includes(errorPath.split('/').pop() || '')
  //         );

  //         markers.push({
  //           startLineNumber: lineMatch > 0 ? lineMatch + 1 : 1,
  //           startColumn: 1,
  //           endLineNumber: lineMatch > 0 ? lineMatch + 1 : 1,
  //           endColumn: 100,
  //           message: `Schema Error: ${err.message} at ${errorPath}`,
  //           severity: monacoRef.current.MarkerSeverity.Warning,
  //         });
  //       });
  //     } else {
  //       setErrors([]);
  //     }
  //   } catch (err: any) {
  //     setIsValidJson(false);
  //     setErrors([{ message: 'Invalid JSON: ' + err.message }]);

  //     // Mark the error line
  //     const errorLine = err.message.match(/position (\d+)/);
  //     if (errorLine) {
  //       const errorPos = parseInt(errorLine[1]);
  //       const lineNum = text.substring(0, errorPos).split('\n').length;

  //       markers.push({
  //         startLineNumber: lineNum,
  //         startColumn: 1,
  //         endLineNumber: lineNum,
  //         endColumn: 100,
  //         message: `JSON Syntax Error: ${err.message}`,
  //         severity: monacoRef.current.MarkerSeverity.Error,
  //       });
  //     }
  //   }

  //   // Set markers in editor
  //   monacoRef.current.editor.setModelMarkers(modelRef.current, 'validation', markers);
  // // console.log(errors);
  // };

  //This Updated function has correct marker placement for error------------
  const validateJSON = (text: string) => {
    if (!monacoRef.current || !modelRef.current) return;

    // const markers: any[] = [];
    const markers: editor.IMarkerData[] = [];
    const lines = text.split("\n");

    // Find 1-based line where "key"\s*: appears, searching forward from afterLine
    const findKeyLine = (key: string, afterLine = 0): number => {
      for (let i = afterLine; i < lines.length; i++) {
        // if (new RegExp(`"${CSS.escape ? key : key}"\\s*:`).test(lines[i]))
        if (new RegExp(`"${key}"\\s*:`).test(lines[i]))
          return i + 1;
      }
      return afterLine + 1;
    };

    // For a path like /fields/2/type:
    //   - find the opening of fields[2] block first (nth occurrence of "{" after "fields")
    //   - then find "type"\s*: after that
    //   This scopes the search to the correct array item, avoiding false matches
    const resolveValueLine = (
      instancePath: string,
    ): { keyLine: number; blockStart: number } => {
      const parts = instancePath.split("/").filter(Boolean);
      let searchFrom = 0;

      for (let p = 0; p < parts.length; p++) {
        const part = parts[p];

        if (!isNaN(Number(part))) {
          // Array index — skip forward to the Nth '{' after current searchFrom
          const targetIndex = parseInt(part);
          let count = -1;
          for (let i = searchFrom; i < lines.length; i++) {
            if (lines[i].includes("{")) {
              count++;
              if (count === targetIndex) {
                searchFrom = i; // 0-based, will be used as afterLine
                break;
              }
            }
          }
        } else {
          // Key segment — find it after current searchFrom
          searchFrom = findKeyLine(part, searchFrom) - 1; // store as 0-based
        }
      }

      return { keyLine: searchFrom + 1, blockStart: searchFrom };
    };

    // Navigate parsed object by instancePath to get actual runtime value
    // const getActualValue = (parsed: any, instancePath: string): any => {
    const getActualValue = (parsed: unknown, instancePath: string): unknown => {  
    const parts = instancePath.split("/").filter(Boolean);
      let cur:any = parsed;
      // let tmp:string = '';
      for (const part of parts) {
        if (cur == null) return undefined;
        cur = cur[part];
        // tmp = cur[part];
        // return tmp;
      }
      return cur;
    };

    // Find exact line of the value by looking for key+value on the SAME line,
    // then fallback to value-only search within the block
    const findValueLine = (
      blockStart: number,
      key: string,
      valueStr: string,
    ): number => {
      // Best: "key": <value> on the same line
      for (
        let i = blockStart;
        i < Math.min(lines.length, blockStart + 20);
        i++
      ) {
        if (
          new RegExp(`"${key}"\\s*:`).test(lines[i]) &&
          lines[i].includes(valueStr)
        ) {
          return i + 1;
        }
      }
      // Fallback: value on the line immediately after the key line
      for (
        let i = blockStart;
        i < Math.min(lines.length, blockStart + 20);
        i++
      ) {
        if (new RegExp(`"${key}"\\s*:`).test(lines[i])) {
          // Check same line and next line
          if (lines[i].includes(valueStr)) return i + 1;
          if (lines[i + 1]?.includes(valueStr)) return i + 2;
        }
      }
      return blockStart + 1;
    };

    // let parsed: any = null;
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(text);
      setIsValidJson(true);

      const valid = validate(parsed);

      if (!valid && validate.errors) {
        setErrors(validate.errors);

        validate.errors.forEach((err) => {
          let lineNumber = 1;
          let message = "";

          if (err.keyword === "additionalProperties") {
            const badKey = err.params.additionalProperty as string;
            // instancePath points to the parent object — find that block, then find the bad key inside it
            const { blockStart } = resolveValueLine(err.instancePath || "");
            lineNumber = findKeyLine(badKey, blockStart);
            message = `Unknown property "${badKey}" — not allowed here. Check for typos.`;
          } else if (err.keyword === "enum") {
            const path = err.instancePath; // e.g. /fields/0/type
            const key = path.split("/").pop() || "";
            const actual = getActualValue(parsed, path);
            const actualStr =
              typeof actual === "string" ? `"${actual}"` : String(actual);
            // Resolve the block containing this field, then pinpoint key+value line
            const parentPath = path.split("/").slice(0, -1).join("/"); // /fields/0
            const { blockStart } = resolveValueLine(parentPath);
            lineNumber = findValueLine(blockStart, key, actualStr);
            message = `Invalid value ${actualStr} for "${key}" — allowed: [${(err.params.allowedValues as string[]).join(", ")}]`;
          } else if (err.keyword === "type") {
            const path = err.instancePath;
            const key = path.split("/").pop() || "";
            const actual = getActualValue(parsed, path);
            const actualStr =
              typeof actual === "string" ? `"${actual}"` : String(actual);
            const parentPath = path.split("/").slice(0, -1).join("/");
            const { blockStart } = resolveValueLine(parentPath);
            lineNumber = findValueLine(blockStart, key, actualStr);
            message = `Wrong type for "${key}": expected ${err.params.type}, got ${typeof actual} (${actualStr})`;
          } else if (err.keyword === "required") {
            const missingKey = err.params.missingProperty as string;
            const { keyLine } = resolveValueLine(err.instancePath || "");
            lineNumber = keyLine;
            message = `Missing required property "${missingKey}"`;
          } else {
            const { keyLine } = resolveValueLine(err.instancePath || "");
            lineNumber = keyLine;
            message = `${err.message} at ${err.instancePath || "/"}`;
          }

          markers.push({
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: lines[lineNumber - 1]?.length + 1 || 100,
            message,
            severity:
              err.keyword === "additionalProperties"
                ? monacoRef.current!.MarkerSeverity.Error
                : monacoRef.current!.MarkerSeverity.Warning,
          });
        });
      } else {
        setErrors([]);
      }
    } catch (error:unknown) {
      const err = error as Error;
      setIsValidJson(false);
      setErrors([{ message: "Invalid JSON: " + err.message  } as ErrorObject]);

      const errorLine = err.message.match(/position (\d+)/);
      if (errorLine) {
        const errorPos = parseInt(errorLine[1]);
        const lineNum = text.substring(0, errorPos).split("\n").length;
        markers.push({
          startLineNumber: lineNum,
          startColumn: 1,
          endLineNumber: lineNum,
          endColumn: lines[lineNum - 1]?.length + 1 || 100,
          message: `JSON Syntax Error: ${err.message}`,
          severity: monacoRef.current.MarkerSeverity.Error,
        });
      }
    }

    monacoRef.current.editor.setModelMarkers(
      modelRef.current,
      "validation",
      markers,
    );
  };

  useEffect(() => {
    try {
      if (localStorage.getItem("JsonText")) {
        const storedJson = localStorage.getItem("JsonText") || "";
        // setJsonText(JSON.parse(JSON.stringify(storedJson)));
        setJsonText(storedJson);
      }
    } catch (err) {
      console.error("Error parsing JSON from localStorage:", err);
    }
  }, []);

  useEffect(() => {
    // if(!editorReady && !jsonText) return;
    if (editorReady && jsonText) {
      localStorage.setItem("JsonText", jsonText);
      validateJSON(jsonText);
      if (isValidJson) {
        changeEffectOnOutputWindow(jsonText);
      }
    }
    // console.log("JSon Text",jsonText);
  }, [jsonText, editorReady]);

  // const handleChange = (value: string | undefined) => {
  const handleChange: (value: string | undefined) => void = (value) => {  
  const newValue = value || "";
    setJsonText(newValue);
    localStorage.setItem("JsonText", newValue);
    changeEffectOnOutputWindow(newValue);
  };

  const handleFormatJson = () => {
    try {
      const parsed:unknown = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
    } catch (err:unknown) {
      console.log(err);
      alert("Invalid JSON - Cannot format");
    }
  };

  //Old Default template--------------

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

  //New updated Default Template..................
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
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            JSON Editor
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isValidJson ? "✅ Valid JSON" : "❌ Invalid JSON"}
          </p>
        </div>
        <div className="flex gap-2">
          <ButtonComponent
            buttonfield={{
              type: "button",
              onClick: handleFormatJson,
              buttonClasses:
                "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition",
              text: "Format JSON",
            }}
          />
          <ButtonComponent
            buttonfield={{
              type: "button",
              onClick: handleLoadTemplate,
              buttonClasses:
                "px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition",
              text: "Load Template",
            }}
          />
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
            wordWrap: "on",
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
          <h3 className="text-red-800 dark:text-red-300 font-semibold mb-2">
            Validation Errors:
          </h3>
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
