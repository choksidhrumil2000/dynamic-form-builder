import { useEffect, useState } from 'react';
import InputTextField from '../InputComponents/InputTextField/InputTextField.Component';
import type { propsInputFields } from '../../types/propsInputFields';
import InputTextArea from '../InputComponents/InputTextArea/InputTextArea.component';
import InputDropDown from '../InputComponents/InputDropDown/InputDropDown.component';
import InputCheckBox from '../InputComponents/InputCheckBox/InputCheckBox.component';
import InputRadio from '../InputComponents/InputRadio/InputRadio.component';
import ButtonComponent from '../ButtonComponent/ButtonComponent.component';
import type { FormField } from '../../types/FormField';
import type { FormStructure } from '../../types/FormStructure';
import type { DynamicFormGeneratorProps } from '../../types/DynamicFormGeneratorProps';
import { RefreshCw } from 'lucide-react';

// interface FormField {
//   id: string;
//   type: string;
//   label: string;
//   placeholder?: string;
//   required?: boolean;
//   options?: Array<{ value: string; label: string }>;
//   validation?: any;
//   dependsOn?: string;
//   dependsOnValue?: string | string[];
//   showWhen?: 'equals' | 'includes' | 'notEquals';
// }

// interface FormStructure {
//   formTitle: string;
//   formDescription?: string;
//   fields: FormField[];
// }

// interface DynamicFormGeneratorProps {
//   formStructure: FormStructure | null;
// }

export default function OutputWindow({ formStructure }: DynamicFormGeneratorProps) {
  const initialValue = {};
  const [formData, setFormData] = useState<Record<string, any>>(initialValue);
  const [submitted, setSubmitted] = useState(false);

  const [isInitialMount, setIsInitialMount] = useState(true);

//   const STORAGE_KEY = 'FormData';

//   const loadSavedFormData = () => {
//     try {
//       const saved = localStorage.getItem(STORAGE_KEY);
//       return saved ? JSON.parse(saved) : {};
//     } catch {
//       return {};
//     }
//   };

//   useEffect(() => {
//     if (!formStructure?.fields) {
//       return;
//     }

//     const savedData = loadSavedFormData();
//     if (Object.keys(savedData).length > 0) {
//       setFormData(savedData);
//       setSubmitted(true);
//       return;
//     }

//     const initialData: Record<string, any> = {};

//     formStructure.fields.forEach((field) => {
//       if (field.type === 'checkbox') {
//         initialData[field.id] = false;
//       } else if (field.type === 'radio' || field.type === 'select') {
//         initialData[field.id] = '';
//       } else {
//         initialData[field.id] = '';
//       }
//     });

//     setFormData(initialData);
//     setSubmitted(false);
//   }, [formStructure]);

//   useEffect(()=>{
//     setFormData(JSON.parse(localStorage.getItem("FormData") || "{}"))
//   },[]);

// console.log(submitted);
//   useEffect(()=>{
//     // setIsLoading(false);
//     if(localStorage.getItem("FormData")){
//       setSubmitted(true);
//       setFormData(JSON.parse(localStorage.getItem("FormData") || "{}"))
//     }
//   },[])

  useEffect(() => {
    if (!formStructure?.fields) {
      setFormData({});
      setSubmitted(false);
      return;
    }

    // Skip clearing data on the very first formStructure load
  if (isInitialMount) {
    setIsInitialMount(false);
    return;
  }

    const initialData: Record<string, any> = {};
    
    formStructure.fields.forEach((field) => {
      if (field.type === 'checkbox') {
        initialData[field.id] = false;
      } else if (field.type === 'radio' || field.type === 'select') {
        initialData[field.id] = '';
      } else {
        initialData[field.id] = '';
      }
    });
    
    setFormData(initialData);
    setSubmitted(false);
    localStorage.removeItem("FormData");
  }, [formStructure]);

// useEffect(()=>{
//     try{
//       const storedJson = localStorage.getItem("FormData") || '';
//       if(storedJson){
//         // const storedJson = localStorage.getItem("FormData") || '';
//         console.log("local storage get json executed useEffect in Output Window",storedJson);
//         // console.log("local storage get json executed useEffect in Output Window");
// //     //     setFormData(JSON.parse(JSON.stringify(storedJson)));
// //     //     setSubmitted(true);
//       }
//     }catch(err){
//       console.error("Error parsing JSON from localStorage:", err);
//     }
//   },[]);

useEffect(() => {
  try {
    const storedJson = localStorage.getItem("FormData");
    if (storedJson) {
      const parsedData = JSON.parse(storedJson);
      setFormData(parsedData);
      setSubmitted(true);
    }else{
      console.log("No FormData found in localStorage.");
    }
  } catch (err) {
    console.error("Error parsing JSON from localStorage:", err);
  }
}, []); 

// useEffect(() =>{
//     setFormData(initialValue);
//     const storedJson = localStorage.getItem("FormData");
//     if (storedJson) {
//       localStorage.removeItem("FormData");
//     }
//     // localStorage.setItem("FormData",JSON.stringify(initialValue));
//     setSubmitted(false);
//  },[formStructure]);

  if (!formStructure) {
    // setFormData({});
    // setIsLoading(false);
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Load valid JSON to generate form...</p>
      </div>
    );
  }

  const shouldShowField = (field: FormField): boolean => {
    // If no dependency, always show
    if (!field.dependsOn) {
      return true;
    }

    const dependentValue = formData[field.dependsOn];
    // console.log(dependentValue, field.dependsOn, formData, "Dependent Value and Form Data in shouldShowField");
    const showWhenType = field.showWhen || 'equals';

    switch (showWhenType) {
      case 'equals':
        // Single value comparison
        return dependentValue === field.dependsOnValue;

      case 'includes':
        // Check if dependent value is in array
        if (Array.isArray(field.dependsOnValue)) {
          return field.dependsOnValue.includes(dependentValue);
        }
        return false;

      case 'notEquals':
        // Show when NOT equal
        return dependentValue !== field.dependsOnValue;

      default:
        return true;
    }
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('Form Data:', formData);
    localStorage.setItem("FormData",JSON.stringify(formData));
    alert('Form submitted! Check console for data.');
    // console.log(submitted);
  };

  const renderField = (field: FormField) => {
    // setSubmitted(false);
    // console.log("Form Data",formData);
    // setFormData(initialValue);
    const baseInputClasses =
      'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':{
        const tempObj:propsInputFields = {
            type:field.type,
            id:field.id,
            placeholder:field.placeholder || '',
            required:field.required || false,
            value:formData[field.id] || '',
            onChange:handleInputChange,
            baseInputClasses,
        }
        return (
        //   <input
        //     type={field.type}
        //     id={field.id}
        //     placeholder={field.placeholder}
        //     required={field.required}
        //     value={formData[field.id] || ''}
        //     onChange={(e) => handleInputChange(field.id, e.target.value)}
        //     className={baseInputClasses}
        //   />
        <InputTextField  {...tempObj}/>
        );
    }
      case 'textarea':{
        const tempObj:propsInputFields = {
            type:field.type,
            id:field.id,
            placeholder:field.placeholder || '',
            required:field.required || false,
            value:formData[field.id] || '',
            onChange:handleInputChange,
            baseInputClasses,
        }
        return (
        //   
        <InputTextArea {...tempObj}/>
        );

    }case 'select':{
        const tempObj={
            type:field.type,
            id:field.id,
            required:field.required || false,
            value:formData[field.id] || '',
            onChange:handleInputChange,
            baseInputClasses,
            options:field.options || [],
        }
        return (
        //   <select
        //     id={field.id}
        //     required={field.required}
        //     value={formData[field.id] || ''}
        //     onChange={(e) => handleInputChange(field.id, e.target.value)}
        //     className={baseInputClasses}
        //   >
        //     <option value="">Select an option</option>
        //     {field.options?.map((option) => (
        //       <option key={option.value} value={option.value}>
        //         {option.label}
        //       </option>
        //     ))}
        //   </select>
        <InputDropDown {...tempObj} />
        );
    }
      case 'checkbox':{
        const tempObj = {
            type:field.type,
            id:field.id,
            required:field.required || false,
            checked:formData[field.id] || false,
            onChange:handleInputChange,
            baseInputClasses:"w-5 h-5 cursor-pointer",  
        }
        return(
        //   <input
        //     type="checkbox"
        //     id={field.id}
        //     required={field.required}
        //     checked={formData[field.id] || false}
        //     onChange={(e) => handleInputChange(field.id, e.target.checked)}
        //     className="w-5 h-5 cursor-pointer"
        //   />
        <InputCheckBox {...tempObj}/>
        );
      } 

      case 'radio':{

        const tempObj ={
            type:field.type,
            id:field.id,
            required:field.required || false,
            checked:formData[field.id],
            onChange:handleInputChange,
            baseInputClasses:"w-4 h-4",
            options:field.options || [],
        }
        return (
        //   <div className="space-y-2">
        //     {field.options?.map((option) => (
        //       <label key={option.value} className="flex items-center gap-2 cursor-pointer">
        //         <input
        //           type="radio"
        //           name={field.id}
        //           value={option.value}
        //           checked={formData[field.id] === option.value}
        //           onChange={(e) => handleInputChange(field.id, e.target.value)}
        //           className="w-4 h-4"
        //         />
        //         <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
        //       </label>
        //     ))}
        //   </div>
        <InputRadio {...tempObj} />
        );
    }
      default:
        return <input type="text" className={baseInputClasses} disabled />;
    }
  };

  const handleFormReload = () => {
    setFormData(initialValue);
    localStorage.removeItem("FormData");
    setSubmitted(false);
  };

//   return (
//     <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
//       <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//         {formStructure.formTitle}
//       </h1>
//       {formStructure.formDescription && (
//         <p className="text-gray-600 dark:text-gray-400 mb-6">{formStructure.formDescription}</p>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {formStructure.fields.map((field) => (
//           <div key={field.id}>
//             {field.type !== 'checkbox' && (
//               <label
//                 htmlFor={field.id}
//                 className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
//               >
//                 {field.label}
//                 {field.required && <span className="text-red-500 ml-1">*</span>}
//               </label>
//             )}

//             {field.type === 'checkbox' ? (
//               <label className="flex items-center gap-2 cursor-pointer">
//                 {renderField(field)}
//                 <span className="text-gray-700 dark:text-gray-300">{field.label}</span>
//               </label>
//             ) : (
//               renderField(field)
//             )}
//           </div>
//         ))}

//         <button
//           type="submit"
//           className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-200"
//         >
//           Submit Form
//         </button>
//       </form>

//       {submitted && (
//         <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
//           <h3 className="text-green-800 dark:text-green-300 font-semibold mb-2">Form Data:</h3>
//           <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-auto">
//             {JSON.stringify(formData, null, 2)}
//           </pre>
//         </div>
//       )}
//     </div>
//   );

return (
//     isLoading?(
// <div className='text-center text-blue font-medium'>Loading........</div>
//     ):(
<div className="w-full bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
    <div className='flex gap-2 justify-between items-center cursor-pointer mb-4'>
    <div className='flex flex-col'>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {formStructure.formTitle}
      </h1>
      {formStructure.formDescription && (
        <p className="text-gray-600 dark:text-gray-400 mb-6">{formStructure.formDescription}</p>
      )}
    </div>
      <RefreshCw  onClick={handleFormReload}/>
    </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        {formStructure.fields.filter(shouldShowField).map((field) => (
          <div key={field.id} className={`transition-all duration-300 overflow-hidden ${
              shouldShowField(field) ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 hidden'
            }`}>
            {field.type !== 'checkbox' && (
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
                {field.dependsOn && (
                  <span className="text-xs text-blue-500 ml-2">(conditional)</span>
                )}
              </label>
            )}

            {field.type === 'checkbox' ? (
              <label className="flex items-center gap-2 cursor-pointer">
                {renderField(field)}
                <span className="text-gray-700 dark:text-gray-300">{field.label}</span>
              </label>
            ) : (
              renderField(field)
            )}
          </div>
        ))}

        {/* <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-200"
        >
          Submit Form
        </button> */}
        <ButtonComponent buttonfield={{
            type:"submit",
            buttonClasses:"w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-200",
            text:"Submit Form"
        }} />
      </form>

      {submitted && (
        <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h3 className="text-green-800 dark:text-green-300 font-semibold mb-2">Form Data:</h3>
          <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </div>
    // )
    
  );
}