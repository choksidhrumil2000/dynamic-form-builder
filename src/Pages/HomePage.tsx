// import Editor from "../Components/EditorComponent/EditorWindow.component";
// import OutputWindow from "../Components/OutputWindow/OutputWindow.Component";

// // import styles from './HomePage.module.css';

// export default function HomePage(){
//     return (
//         <div className={`flex flex-row justify-center items-center`}>
//             <div style={{
//                 width:'50%',
//                 marginTop:'50px',
//             }}>
//                 <Editor />
//             </div>
//             <div style={{
//                 width:'50%'
//             }}>
//                 <OutputWindow />
//             </div>
//         </div>
//     )
// }

import { useState } from 'react';
// import JsonEditor from '@/components/JsonEditor';
// import DynamicFormGenerator from '@/components/DynamicFormGenerator';
import EditorWindow from '../Components/EditorComponent/EditorWindow.component';
import OutputWindow from '../Components/OutputWindow/OutputWindow.Component';

export default function HomePage() {
  const [formStructure, setFormStructure] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-2">
          🎨 Dynamic Form Builder
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Create forms from JSON. Edit the JSON on the left, preview the form on the right.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* JSON Editor */}
          <div className="flex flex-col">
            <EditorWindow
              onChange={setFormStructure}
              height="600px"
              theme="dark"
              initialValue={`{
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
}`}
            />
          </div>

          {/* Form Preview */}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Form Preview</h2>
            <OutputWindow formStructure={formStructure} />
          </div>
        </div>
      </div>
    </div>
  );
}