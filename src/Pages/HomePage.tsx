import { useState } from "react";
import type { FormStructure } from "../types/FormStructure";
import EditorWindow from "../Components/EditorComponent/EditorWindow.component";
import OutputWindow from "../Components/OutputWindow/OutputWindow.Component";
import { Form } from "lucide-react";
import Modal from "../Components/Modal Component/Modal.Component";

export default function HomePage() {
  const [formStructure, setFormStructure] = useState<FormStructure | null>(
    null,
  );
  const [jsonText, setJsonText] = useState(`{
  "formTitle": "User Registration",
  "formDescription": "Please fill in your details",
  "fields": [
    {
      "id": "name",
      "type": "text",
      "label": "Full Name",
      "placeholder": "Enter your full name",
      "required": true
    }
  ]
}`);

  const [open, setOpen] = useState(false);

  const ModalFormJson = `{
  "formTitle": "Add Field to Form",
  "formDescription": "Fill the details required to generate Field",
  "fields": [
    {
      "id": "id",
      "type": "text",
      "label": "Id",
      "placeholder": "Enter Id Of Field",
      "required": true
    },
    {
      "id": "label",
      "type": "text",
      "label": "label",
      "placeholder": "Enter label ",
      "required": true
    },
    {
      "id": "type",
      "type": "select",
      "label": "Field Type",
      "required": true,
      "options": [
        { "value": "text", "label": "Text" },
        { "value": "email", "label": "Email" },
        { "value": "number", "label": "Number" },
        { "value": "date", "label": "Date" },
        { "value": "select", "label": "Select" },
        { "value": "textarea", "label": "TextArea" },
        { "value": "radio", "label": "Radio Button" },
        { "value": "checkbox", "label": "CheckBox" }
      ]
    },
    {
      "id": "dependsOn",
      "type": "select",
      "label": "DependsOn",
      "placeholder": "Enter DependOnValue",
      "required": false,
      "dependsOn":["type"],
      "dependsOnValue":["select"],
      "showWhen":"includes"
    },
    {
      "id": "dependsOnValue",
      "type": "select",
      "label": "DependsOnValue",
      "placeholder": "Enter DependOnValue",
      "required": true,
      "dependsOn":["dependsOn"],
      "showWhen":"includes"
    },
    {
      "id": "showWhen",
      "type": "select",
      "label": "ShowWhen",
      "placeholder": "Enter ShowWhen value",
      "required": true,
      "dependsOn":["dependsOnValue"],
      "showWhen":"includes",
      "options": [
        { "value": "includes", "label": "Includes" },
        { "value": "notEquals", "label": "Not Equals" }
      ]
    },
    {
      "id": "placeholder",
      "type": "text",
      "label": "Placeholder",
      "placeholder": "Enter Placeholder of Field",
      "dependsOn": "type",
      "dependsOnValue": ["text","email","number","date","textarea"],
      "showWhen": "includes"
    },
    {
      "id": "required",
      "type": "select",
      "label": "Required",
      "dependsOn": "type",
      "dependsOnValue": ["text","email","number","date","textarea","select","radio","checkbox"],
      "showWhen": "includes",
      "options": [
        { "value": "true", "label": "True" },
        { "value": "false", "label": "False" }
      ]
    },
    {
      "id": "options",
      "type": "group",
      "label": "Options",
      "fields":[
      {
      "id": "options-value",
      "type": "text",
      "label": "option-value",
      "placeholder": "Enter value of option"
    },
    {
      "id": "options-label",
      "type": "text",
      "label": "option-label",
      "placeholder": "Enter label of option"
    }
      ],
      "dependsOn": "type",
      "dependsOnValue": ["select","radio"],
      "showWhen": "includes"
    },
    {
      "id": "add-options",
      "type": "button",
      "label": "Add-Options",
      "dependsOn": "type",
      "dependsOnValue": ["select","radio"],
      "showWhen": "includes"
    }
  ]
}`;

  // const ModalFormJson = `{
  //   "formTitle": "Add Field to Form",
  //   "formDescription": "Fill the details required to generate Field",
  //   "fields": [
  //     {
  //       "id": "id",
  //       "type": "text",
  //       "label": "Id",
  //       "placeholder": "Enter Id Of Field",
  //       "required": true
  //     },
  //     {
  //       "id": "label",
  //       "type": "text",
  //       "label": "label",
  //       "placeholder": "Enter label ",
  //       "required": true
  //     },
  //     {
  //       "id": "type",
  //       "type": "select",
  //       "label": "Field Type",
  //       "required": true,
  //       "options": [
  //         { "value": "text", "label": "Text" },
  //         { "value": "email", "label": "Email" },
  //         { "value": "number", "label": "Number" },
  //         { "value": "date", "label": "Date" },
  //         { "value": "select", "label": "Select" },
  //         { "value": "textarea", "label": "TextArea" },
  //         { "value": "radio", "label": "Radio Button" },
  //         { "value": "checkbox", "label": "CheckBox" }
  //       ]
  //     },
  //     {
  //       "id": "dependsOn",
  //       "type": "select",
  //       "label": "DependsOn",
  //       "placeholder": "Enter DependOnValue",
  //       "required": false
  //     },
  //     {
  //       "id": "dependsOnValue",
  //       "type": "select",
  //       "label": "DependsOnValue",
  //       "placeholder": "Enter DependOnValue",
  //       "required": false
  //     },
  //     {
  //       "id": "showWhen",
  //       "type": "select",
  //       "label": "ShowWhen",
  //       "placeholder": "Enter ShowWhen value",
  //       "required": false,
  //       "options": [
  //         { "value": "equals", "label": "Equals" },
  //         { "value": "includes", "label": "Includes" },
  //         { "value": "notEquals", "label": "Not Equals" }
  //       ]
  //     },
  //     {
  //       "id": "placeholder",
  //       "type": "text",
  //       "label": "Placeholder",
  //       "placeholder": "Enter Placeholder of Field",
  //       "dependsOn": "type",
  //       "dependsOnValue": ["text","email","number","date","textarea"],
  //       "showWhen": "includes"
  //     },
  //     {
  //       "id": "required",
  //       "type": "select",
  //       "label": "Required",
  //       "dependsOn": "type",
  //       "dependsOnValue": ["text","email","number","date","textarea","select","radio","checkbox"],
  //       "showWhen": "includes",
  //       "options": [
  //         { "value": "true", "label": "True" },
  //         { "value": "false", "label": "False" }
  //       ]
  //     },
  //     {
  //       "id": "options",
  //       "type": "group",
  //       "label": "Options",
  //       "fields":[
  //       {
  //       "id": "options-value",
  //       "type": "text",
  //       "label": "option-value",
  //       "placeholder": "Enter value of option"
  //     },
  //     {
  //       "id": "options-label",
  //       "type": "text",
  //       "label": "option-label",
  //       "placeholder": "Enter label of option"
  //     }
  //       ],
  //       "dependsOn": "type",
  //       "dependsOnValue": ["select","radio"],
  //       "showWhen": "includes"
  //     },
  //     {
  //       "id": "add-options",
  //       "type": "button",
  //       "label": "Add-Options",
  //       "dependsOn": "type",
  //       "dependsOnValue": ["select","radio"],
  //       "showWhen": "includes"
  //     }
  //   ]
  // }`;

  const [modalFormStructure, setModalFormStructure] =
    useState<FormStructure | null>(JSON.parse(ModalFormJson));
  const [baseModalFormStructure, setBaseModalFormStructure] =
    useState<FormStructure | null>(JSON.parse(ModalFormJson));
    console.log(setBaseModalFormStructure);

  return (
    <div className="min-h-screen bg-gradient-to-br m-0 from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-2">
          <Form className="inline w-10 h-10" />
          🎨 Dynamic Form Builder
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Create forms from JSON. Edit the JSON on the left, preview the form on
          the right.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* JSON Editor */}
          <div className="flex flex-col">
            <EditorWindow
              onChange={setFormStructure}
              height="600px"
              theme="dark"
              //               initialValue={`{
              //   "formTitle": "User Registration",
              //   "formDescription": "Please fill in your details",
              //   "fields": [
              //     {
              //       "id": "name",
              //       "type": "text",
              //       "label": "Full Name",
              //       "placeholder": "Enter your full name",
              //       "required": true
              //     }
              //   ]
              // }`}
              initialValue={jsonText}
              jsonText={jsonText}
              setJsonText={setJsonText}
            />
          </div>

          {/* Form Preview */}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Form Preview
            </h2>
            <OutputWindow
              formStructure={formStructure}
              onChange={setFormStructure}
              jsonText={jsonText}
              setJsonText={setJsonText}
              open={open}
              setOpen={setOpen}
            />
          </div>
        </div>
      </div>
      <Modal open={open} setOpen={setOpen}>
        <div>
          <OutputWindow
            formStructure={modalFormStructure}
            onChange={setModalFormStructure}
            jsonText={jsonText}
            setJsonText={setJsonText}
            open={open}
            setOpen={setOpen}
            modalFormJson={baseModalFormStructure}
          />
        </div>
      </Modal>
    </div>
  );
}
