import React, { useEffect, useState } from 'react';
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
import { CircleMinus, CirclePlus, RefreshCw } from 'lucide-react';
import type { propsButton } from '../../types/PropsButton';
import type { propsInputDorpDown } from '../../types/propsInputDorpDown';
import type { propsInputCheckBox } from '../../types/propsInputCheckBox';
import type { propsInputRadio } from '../../types/propsInputRadio';

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

export default function OutputWindow({ formStructure,onChange,jsonText,setJsonText,open,setOpen }: DynamicFormGeneratorProps) {
  const initialValue = {};
  const [formData, setFormData] = useState<Record<string, any>>(initialValue);
  const [submitted, setSubmitted] = useState(false);

  const [isInitialMount, setIsInitialMount] = useState(true);

  const [modalFormData,setModalFormData] = useState<Record<string, any>>(initialValue);

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
    console.log("After Form Structure Change", formStructure);
    if (!formStructure?.fields) {
      if(!open){

        setFormData({});
        setSubmitted(false);
      }else{
        // setModalFormData({});
      }
      return;
    }

    // Skip clearing data on the very first formStructure load
  if (isInitialMount) {
    setIsInitialMount(false);
    return;
  }

  const initialData: Record<string, any> = {};
  
  if(!open){
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

  }else{

// formStructure.fields.forEach((field) => {
//       if (field.type === 'checkbox') {
//         initialData[field.id] = false;
//       } else if (field.type === 'radio' || field.type === 'select') {
//         initialData[field.id] = '';
//       } 
//       // else if(field.type === 'group'){ 
//       //   initialData[field.id] = {};
//       // }
//       else{
//         initialData[field.id] = '';
//       }
//     });
//     setModalFormData(initialData);
  }
  }, [formStructure]);

  // Handle form structure changes when in editor mode
useEffect(() => {
  if (!open || !formStructure?.fields) return;

  // Don't reset if it's the initial mount
  if (isInitialMount) return;

  // Only add new fields that don't exist in modalFormData
  const newData = { ...modalFormData };
  let hasChanges = false;

  formStructure.fields.forEach((field) => {
    if (newData[field.id] === undefined) {
      hasChanges = true;
      if (field.type === 'checkbox') {
        newData[field.id] = false;
      } else if (field.type === 'radio' || field.type === 'select') {
        newData[field.id] = '';
      } else {
        newData[field.id] = '';
      }
    }
  });

  if (hasChanges) {
    setModalFormData(newData);
  }
}, [formStructure, open, isInitialMount]);

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
  console.log(jsonText);

  if(open){
    const JsonTextData = JSON.parse(jsonText);
    let selectFields = [];
    let optionsFields = [];
    JsonTextData.fields.forEach((field:FormField)=>{
      if(field.type === 'select'){
        selectFields.push(field);
        optionsFields.push(...field.options);
      }
    });

    const tempStructure = JSON.parse(JSON.stringify(formStructure));
    tempStructure.fields.forEach((f)=>{
      if(f.id === 'dependsOn'){
        const options = selectFields.map((f)=> ({value:f.id,label:f.label}));
         f.options = [...options];
      }else if(f.id === 'dependsOnValue'){
          f.options = [...optionsFields];
      }
    })
    onChange(tempStructure);
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

    console.log("here in Should SAhow Field")
    let dependentValue;
    if(!open){

      dependentValue = formData[field.dependsOn];
    }
    else{
      dependentValue = modalFormData[field.dependsOn];
    }
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

  // const handleInputChange = (fieldId: string, value: any,parentId?: string | undefined | null) => {
  //   if(!open){

  //     setFormData((prev) => ({
  //       ...prev,
  //       [fieldId]: value,
  //     }));
  //   }else{
  //     console.log(fieldId,value,modalFormData,parentId);
  //     setModalFormData((prev)=>{
  //       if(!fieldId.startsWith("options")){
  //         console.log(prev);
  //         return {
  //       ...prev,
  //       [fieldId] : value,
  //     }
  //       }
  //       else{
  //         const tempObj = JSON.parse(JSON.stringify(prev));
  //           if(parentId){
  //             tempObj[parentId] = {
  //               ...tempObj[parentId],
  //               [fieldId]: value
  //             };

  //           }
  //         return tempObj;
  //     }
  //   });
  //   }
  // };

  const handleInputChange = (fieldId: string, value: any, parentId?: string | undefined | null) => {
  if (!open) {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  } else {
    setModalFormData((prev) => {
      const tempObj = JSON.parse(JSON.stringify(prev));
      
      if (parentId) {
        // Initialize parent object if it doesn't exist
        if (!tempObj[parentId]) {
          tempObj[parentId] = {};
        }
        // Store nested field value
        tempObj[parentId][fieldId] = value;
      } else {
        // Store top-level field value
        tempObj[fieldId] = value;
      }
      
      console.log("Updated modalFormData:", tempObj);
      return tempObj;
    });
  }
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!open){

      setSubmitted(true);
      console.log('Form Data:', formData);
      localStorage.setItem("FormData",JSON.stringify(formData));
      alert('Form submitted! Check console for data.');
    }else{
      console.log('Modal Form Data:', modalFormData);
      console.log('Json text',jsonText );
      console.log(formStructure);
      const tempData = convertmodalDataToJSON(modalFormData);
      const tempJSONTextData = JSON.parse(jsonText);
      tempJSONTextData.fields.push(tempData);
      setJsonText(JSON.stringify(tempJSONTextData, null, 2));
      setOpen(false);
    }
    // console.log(submitted);
  };

  const convertmodalDataToJSON = (data:any)=>{
    return {
      id: data.id || `field-${Date.now()}`,
      type: data.type || 'text',
      label: data.label || 'New Field',
      placeholder: data.placeholder || '',
      required: Boolean(data.required) || false,
      options: data.options || undefined,
      validation: data.validation || undefined,
      dependsOn: data.dependsOn || undefined,
      dependsOnValue: data.dependsOnValue || undefined,
      showWhen: data.showWhen || undefined,
      fields: data.fields || undefined,
    };
  }

  const renderField = (field: FormField,parentId?:string|undefined|null) => {
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
              let tempObj:propsInputFields;

        if(!open){
          tempObj = {
            type:field.type,
            id:field.id,
            placeholder:field.placeholder || '',
            required:field.required || false,
            value:formData[field.id] || '',
            onChange:(e:React.ChangeEvent<HTMLInputElement>)=>handleInputChange(field.id, e.target.value, parentId),
            baseInputClasses,
        }
      }
        else{
          tempObj = {
            type:field.type,
            id:field.id,
            placeholder:field.placeholder || '',
            required:field.required || false,
            value:parentId
      ? modalFormData[parentId]?.[field.id] || ''
      : modalFormData[field.id] || '',
            // onChange:handleInputChange,
            onChange:(e:React.ChangeEvent<HTMLInputElement>)=>handleInputChange(field.id, e.target.value, parentId),
            baseInputClasses,
        }
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
        let tempObj:propsInputFields;
        if(!open){tempObj = {
            type:field.type,
            id:field.id,
            placeholder:field.placeholder || '',
            required:field.required || false,
            value:formData[field.id] || '',
            // onChange:handleInputChange,
            onChange:(e:React.ChangeEvent<HTMLTextAreaElement>)=>handleInputChange(field.id, e.target.value, parentId),
            baseInputClasses,
        }}else{
         tempObj = {
            type:field.type,
            id:field.id,
            placeholder:field.placeholder || '',
            required:field.required || false,
            value:parentId
      ? modalFormData[parentId]?.[field.id] || ''
      : modalFormData[field.id] || '',
            // onChange:handleInputChange,
            onChange:(e:React.ChangeEvent<HTMLTextAreaElement>)=>handleInputChange(field.id, e.target.value, parentId),
            baseInputClasses,
        } 
        }
        return (
        //   
        <InputTextArea {...tempObj}/>
        );

    }case 'select':{
      let tempObj:propsInputDorpDown;
      if(!open){
        tempObj={
            type:field.type,
            id:field.id,
            required:field.required || false,
            value:formData[field.id] || '',
            // onChange:handleInputChange,
            onChange:(e:React.ChangeEvent<HTMLSelectElement>)=>handleInputChange(field.id, e.target.value, parentId),
            baseInputClasses,
            options:field.options || [],
        }
      }else{
        tempObj={
            type:field.type,
            id:field.id,
            required:field.required || false,
            value:modalFormData[field.id] || '',
            // onChange:handleInputChange,
            onChange:(e:React.ChangeEvent<HTMLSelectElement>)=>handleInputChange(field.id, e.target.value, parentId),
            baseInputClasses,
            options:field.options || [],
        }
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
let tempObj:propsInputCheckBox;
        if(!open){
          tempObj = {
            type:field.type,
            id:field.id,
            required:field.required || false,
            checked:formData[field.id] || false,
            // onChange:handleInputChange,
            onChange:(e:React.ChangeEvent<HTMLInputElement>)=>handleInputChange(field.id, e.target.checked, parentId),
            baseInputClasses:"w-5 h-5 cursor-pointer",  
        }
        }else{
          tempObj = {
            type:field.type,
            id:field.id,
            required:field.required || false,
            checked:modalFormData[field.id] || false,
            // onChange:handleInputChange,
            onChange:(e:React.ChangeEvent<HTMLInputElement>)=>handleInputChange(field.id, e.target.checked, parentId),
            baseInputClasses:"w-5 h-5 cursor-pointer",  
        }
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
let tempObj:propsInputRadio;
        if(!open){
tempObj ={
            type:field.type,
            id:field.id,
            required:field.required || false,
            checked:formData[field.id],
            // onChange:handleInputChange,
            onChange:(e:React.ChangeEvent<HTMLInputElement>)=>handleInputChange(field.id, e.target.value, parentId),
            baseInputClasses:"w-4 h-4",
            options:field.options || [],
        }
        }else{
          tempObj ={
            type:field.type,
            id:field.id,
            required:field.required || false,
            checked:modalFormData[field.id],
            // onChange:handleInputChange,
            onChange:(e:React.ChangeEvent<HTMLInputElement>)=>handleInputChange(field.id, e.target.value, parentId),
            baseInputClasses:"w-4 h-4",
            options:field.options || [],
        }
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
    case 'button':{
      if(open){
        const  tempObj2:propsButton = {
        type:field.type,
        text:field.label,
        buttonClasses:"px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition",
        onClick:handleAddOptionsForSelectOrRadio
      }
      return <ButtonComponent buttonfield={{...tempObj2}} />
      }break;
      
    }
    case'group':break;
      default:
        return <input type="text" className={baseInputClasses} disabled />;
    }
  };

  const handleAddOptionsForSelectOrRadio = ()=>{
    console.log("Before",formStructure);

    // onChange((prev)=>{
    //   const temp = {...prev}
    //   temp.fields = temp.fields.filter((f:FormField) => f.id !== "add-options");
    //   temp.fields.push({
    //   "id": `options-value-${temp.fields.length + 1}`,
    //   "type": "text",
    //   "label": "Options-value",
    //   "dependsOn": "type",
    //   "dependsOnValue": ["select","radio"],
    //   "showWhen": "includes"
    // },
    // {
    //   "id": `options-label-${temp.fields.length + 1}`,
    //   "type": "text",
    //   "label": "Options-label",
    //   "dependsOn": "type",
    //   "dependsOnValue": ["select","radio"],
    //   "showWhen": "includes"
    // },
    // {
    //   "id": "add-options",
    //   "type": "button",
    //   "label": "Add-Options",
    //   "dependsOn": "type",
    //   "dependsOnValue": ["select","radio"],
    //   "showWhen": "includes"
    // }
    // )
    // return temp;
    // })

    onChange((prev)=>{
      if(!prev) return prev;
      const temp = {...prev}
      const buttonObj = temp.fields.find((f:FormField) => f.id === "add-options");
      temp.fields = temp.fields.filter((f:FormField) => f.id !== "add-options");
      // let idx = temp.fields.findIndex((f)=>f.id === "options");
    //   if(idx !== -1){
    //     temp.fields[idx].fields.push(
    //   {
    //   "id": `options-value-${temp.fields.length+1}`,
    //   "type": "text",
    //   "label": "option-value",
    //   "placeholder": "Enter value of option"
    // },
    // {
    //   "id": `options-label-${temp.fields.length+1}`,
    //   "type": "text",
    //   "label": "option-label",
    //   "placeholder": "Enter label of option"
    // }  );
    // temp.fields.push(buttonObj);
      // }else{
        const num:number = Math.random();
        temp.fields.push({"id": `options-${num+1}`,
      "type": "group",
      "label": "Options",
      "fields":[
      {
      "id": `options-value-${num+1}`,
      "type": "text",
      "label": "option-value",
      "placeholder": "Enter value of option"
    },
    {
      "id": `options-label-${num+1}`,
      "type": "text",
      "label": "option-label",
      "placeholder": "Enter label of option"
    }
      ],
      "dependsOn": "type",
      "dependsOnValue": ["select","radio"],
      "showWhen": "includes"
    },buttonObj);
    return temp;
      });
    

  }

  const handleFormReload = () => {
    if(!open){

      setFormData(initialValue);
      localStorage.removeItem("FormData");
      setSubmitted(false);
    }else{
      setModalFormData(initialValue);
    }
  };

  const handleAddField = (field?:FormField|undefined|null) => {
    console.log("in Function",field);
    if(!field.id){
      console.log("In If COndition")
      // return;
    }
    setOpen(true);



  };

  const handleRemoveField = (field:FormField,tag:string|undefined|null) => {
  // formStructure.fields = formStructure.fields.filter(f => f.id !== field.id);
  if(tag === 'for-options'){
    onChange((prev)=>{
      if(!prev) return prev;
      const updatedStructure = { ...prev };
      updatedStructure.fields = updatedStructure.fields.filter((f:FormField)=>f.id!==field.id);
      return updatedStructure;
    })

    setModalFormData((prev)=>{
      const updatedData = { ...prev };
      delete updatedData[field.id];
      return updatedData;
    });
    return;
  }  
  onChange((prev)=>{
        if(!prev) return prev;
        const updatedStructure = { ...prev };
        if(field.dependsOn){
            updatedStructure.fields = updatedStructure.fields.filter((f:FormField) => f.id !== field.id);
        }else{
          updatedStructure.fields = updatedStructure.fields.filter((f:FormField) => f.id !== field.id && f.dependsOn !== field.id);
        }
        return updatedStructure;
    }); 
    setJsonText((prev)=>{
        try{
            const parsed = JSON.parse(prev);
            if(field.dependsOn){
                parsed.fields = parsed.fields.filter((f:FormField) => f.id !== field.id);
            }else{
              parsed.fields = parsed.fields.filter((f:FormField) => f.id !== field.id && f.dependsOn !== field.id);
            }
            return JSON.stringify(parsed, null, 2);
        } catch {
            return prev;
        }
    });

    setFormData((prev) => {
      const updatedData = { ...prev };
      delete updatedData[field.id];
      return updatedData;
    });
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
    <div>
      {!open ?(<ButtonComponent buttonfield={{
        type:"button",
        text:"+ Add Field",
        onClick:handleAddField, 
        buttonClasses:"mb-6 cursor-pointer px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition",
      }} />):null}
    </div>
    {/* <div className='overflow-scroll'> */}
      <form onSubmit={handleSubmit} className="space-y-2">
        {formStructure.fields.filter(shouldShowField).map((field:any) => (
          <div key={field.id} className={`transition-all duration-300 ${
              shouldShowField(field) ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 hidden'
            }`}>
            {field.type !== 'checkbox' && field.type !== 'button'  && (
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
            {field.fields && field.fields.length > 0 && (
              field.fields.map((nestedField:FormField,i) => (
                <div key={nestedField.id+`${i+1}`} className="ml-4">
                <label
                htmlFor={nestedField.id+`${i+1}`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {nestedField.label}
                {nestedField.required && <span className="text-red-500 ml-1">*</span>}
                {nestedField.dependsOn && (
                  <span className="text-xs text-blue-500 ml-2">(conditional)</span>
                )}
              </label>
                  {renderField(nestedField,field.id)} 
                </div>
                
              ))
            )}
            
            {field.type === 'checkbox' ? (
              <label className="flex items-center gap-2 cursor-pointer">
                {renderField(field)}
                <span className="text-gray-700 dark:text-gray-300">{field.label}</span>
              </label>
            ) : (
              renderField(field)
            )}
            {open && ["group"].includes(field.type)?(
                  <ButtonComponent buttonfield={{
                type:"button",
                buttonClasses:"cursor-pointer mt-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                text:<CircleMinus />,
                onClick:()=>handleRemoveField(field,'for-options')}}/>
                ):(null)
                }
            {!open ? (<>
            {/* <ButtonComponent buttonfield={{
                type:"button",
                buttonClasses:"cursor-pointer mt-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                text:<CirclePlus />,
                onClick:()=>handleAddField(field)}}/>  */}
          <ButtonComponent buttonfield={{
                type:"button",
                buttonClasses:"cursor-pointer mt-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                text:<CircleMinus />,
                onClick:()=>handleRemoveField(field)}}/>
                </>): null}
                {/* {open && ["select","radio"].includes(field.type) && field.id.startsWith("options-label")?(
                  <ButtonComponent buttonfield={{
                type:"button",
                buttonClasses:"cursor-pointer mt-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                text:<CircleMinus />,
                onClick:()=>handleRemoveField(field,'for-options')}}/>
                ):(null)
                }  */}
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
            text:"Submit Form",
            disabled:(!!formStructure && formStructure.fields.length === 0),
            }}/>
      </form>
            {/* </div> */}
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