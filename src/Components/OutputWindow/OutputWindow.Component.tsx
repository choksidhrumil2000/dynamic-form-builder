import React, { useEffect, useState } from "react";
import InputTextField from "../InputComponents/InputTextField/InputTextField.Component";
import type { propsInputFields } from "../../types/propsInputFields";
import InputTextArea from "../InputComponents/InputTextArea/InputTextArea.component";
import InputDropDown from "../InputComponents/InputDropDown/InputDropDown.component";
import InputCheckBox from "../InputComponents/InputCheckBox/InputCheckBox.component";
import InputRadio from "../InputComponents/InputRadio/InputRadio.component";
import ButtonComponent from "../ButtonComponent/ButtonComponent.component";
import type { FormField } from "../../types/FormField";
import type { DynamicFormGeneratorProps } from "../../types/DynamicFormGeneratorProps";
import { CircleMinus, RefreshCw, X } from "lucide-react";
import type { propsButton } from "../../types/PropsButton";
import type { propsInputDorpDown } from "../../types/propsInputDorpDown";
import type { propsInputCheckBox } from "../../types/propsInputCheckBox";
import type { propsInputRadio } from "../../types/propsInputRadio";
import type { FormStructure } from "../../types/FormStructure";
import type { PropsInputTextAreaField } from "../../types/PropsInputTextAreaField";

export default function OutputWindow({
  formStructure,
  onChange,
  jsonText,
  setJsonText,
  open,
  setOpen,
  modalFormJson,
}: DynamicFormGeneratorProps) {
  const initialValue = {};
  const [formData, setFormData] = useState<Record<string, any>>(initialValue);
  const [submitted, setSubmitted] = useState(false);

  const [isInitialMount, setIsInitialMount] = useState(true);

  const [modalFormData, setModalFormData] =
    useState<Record<string, any>>(initialValue);

  const [error, setError] = useState<string | null>(null);

  const [formErrors, setFormErrors] = useState<Record<string, any>>({});


//   type FormValue = string | number | boolean | string[] | undefined;

// type FormDataType = Record<string, FormValue>;

// const [formData, setFormData] = useState<FormDataType>(initialValue);
// const [modalFormData, setModalFormData] = useState<FormDataType>(initialValue);
// const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  function shouldShowField(field: any): boolean {
  // function shouldShowField(field: FormField): boolean{  
  // If no dependency, always show
    if (!field.dependsOn) {
      return true;
    }

    // ============ GET DEPENDENT VALUE BASED ON MODAL STATE ============
    const dependentValue = !open
      ? formData[field.dependsOn]
      : modalFormData[field.dependsOn];
    // ============ END ============

    // const showWhenType = field.showWhen || 'equals';
    const showWhenType = field.showWhen;

    // ============ LOGIC EXPLANATION ============
    // This function decides whether to SHOW or HIDE a field based on:
    // 1. field.dependsOn = the ID of another field it depends on
    // 2. dependentValue = the current VALUE of that dependent field
    // 3. field.dependsOnValue = the VALUES that trigger showing this field
    // 4. showWhenType = the COMPARISON TYPE (includes, notEquals, equals)
    // ============ END EXPLANATION ============

    if (!dependentValue) return false;

    switch (showWhenType) {
      case "includes":
        // ============ SHOW FIELD IF: dependentValue is in the dependsOnValue array ============

        // If dependsOnValue is an array of acceptable values
        if (Array.isArray(field.dependsOnValue)) {
          // If dependentValue is also an array (multiple selections)
          if (Array.isArray(dependentValue)) {
            // Show field if ANY selected value matches ANY acceptable value
            return dependentValue.some((val) =>
              field.dependsOnValue.includes(val),
            );
            // EXAMPLE: If user selected ["option1", "option2"] and dependsOnValue is ["option1", "option3"]
            // Result: TRUE (because "option1" is in both arrays)
          }

          // If dependentValue is a single value
          return field.dependsOnValue.includes(dependentValue);
          // EXAMPLE: If user selected "option1" and dependsOnValue is ["option1", "option3"]
          // Result: TRUE (because "option1" is in the array)
        }
        return false;
      // ============ END OF INCLUDES CASE ============

      case "notEquals":
        // ============ SHOW FIELD IF: dependentValue is NOT in the dependsOnValue array ============

        // If dependentValue is an array (multiple selections)
        if (Array.isArray(dependentValue)) {
          // Show field if NONE of the selected values are in the dependsOnValue array
          return !dependentValue.some((val) =>
            field.dependsOnValue.includes(val),
          );
          // EXAMPLE: If user selected ["option4", "option5"] and dependsOnValue is ["option1", "option3"]
          // Result: TRUE (because none of the selected values are in the array)
        }

        // If dependentValue is a single value
        return !field.dependsOnValue.includes(dependentValue);
      // EXAMPLE: If user selected "option4" and dependsOnValue is ["option1", "option3"]
      // Result: TRUE (because "option4" is NOT in the array)
      // ============ END OF NOTEQUALS CASE ============
      default:
        return true;
    }
  }

  useEffect(() => {
    if (!formStructure?.fields) {
      if (!open) {
        setFormData({});
      } else {
        // setModalFormData({});
      }
      setSubmitted(false);
      return;
    }

    // Skip clearing data on the very first formStructure load
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }

    const initialData: Record<string, any> = {};

    if (!open) {
      formStructure.fields.filter(shouldShowField).forEach((field) => {
        if (field.type === "checkbox") {
          initialData[field.id] = false;
        } else if (field.type === "radio" || field.type === "select") {
          initialData[field.id] = "";
        } else {
          initialData[field.id] = "";
        }
      });

      setFormData(initialData);
      setSubmitted(false);
      localStorage.removeItem("FormData");
    } else {
      //temp code----------------------
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

    formStructure.fields.filter(shouldShowField).forEach((field) => {
      if (newData[field.id] === undefined) {
        hasChanges = true;
        if (field.type === "checkbox") {
          newData[field.id] = false;
        } else if (field.type === "radio" || field.type === "select") {
          newData[field.id] = "";
        } else {
          newData[field.id] = "";
        }
      }
    });

    if (hasChanges) {
      setModalFormData(newData);
    }
  }, [formStructure, open, isInitialMount]);

  useEffect(() => {
    try {
      const storedJson = localStorage.getItem("FormData");
      if (storedJson) {
        const parsedData = JSON.parse(storedJson);
        setFormData(parsedData);
        setSubmitted(true);
      } else {
        console.log("No FormData found in localStorage.");
      }
    } catch (err) {
      console.error("Error parsing JSON from localStorage:", err);
    }

    if (open) {
      setSubmitted(false);
      const JsonTextData = JSON.parse(jsonText as string);
      const selectFields: FormField[] = [];
      const optionsFields: {value:string,label:string}[] = [];
      JsonTextData.fields.forEach((field: FormField) => {
        if (field.type === "select") {
          selectFields.push(field);

          optionsFields.push(...field.options as {value:string,label:string}[]);
        }
      });

      const tempStructure: FormStructure = JSON.parse(
        JSON.stringify(formStructure),
      );
      let options: { value: string; label: string }[] = [];
      tempStructure.fields.forEach((f) => {
        if (f.id === "dependsOn") {
          options = selectFields.map((f) => ({ value: f.id, label: f.label }));
          f.options = [...options];
        } else if (f.id === "dependsOnValue") {
          f.options = [...optionsFields];
          f.dependsOnValue = options.map((f) => f.value);
        } else if (f.id === "showWhen") {
          f.dependsOnValue = optionsFields.map((f) => f.value);
        }
      });
      onChange?.((prev) => ({ ...prev, ...tempStructure }));
    }
  }, []);

  useEffect(() => {
    if (open && modalFormData["dependsOn"]) {
      const JsonTextData = JSON.parse(jsonText as string);
      let optionsFields: {value:string,label:string}[] = [];

      JsonTextData.fields.forEach((field: FormField) => {
        if (
          field.type === "select" &&
          field.id === modalFormData["dependsOn"]
        ) {
          optionsFields = [...field.options as {value:string,label:string}[]];
        }
      });

      const tempStructure: FormStructure = JSON.parse(
        JSON.stringify(formStructure),
      );
      tempStructure.fields.forEach((f) => {
        if (f.id === "dependsOnValue") {
          f.options = [...optionsFields];
        }
      });
      onChange?.((prev) => ({ ...prev, ...tempStructure }));
    }
  }, [modalFormData["dependsOn"]]);

  if (!formStructure) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          Load valid JSON to generate form...
        </p>
      </div>
    );
  }

  //old ShouldShowField Function--------------------------
  // const shouldShowField = (field): boolean => {
  //   // If no dependency, always show
  //   if (!field.dependsOn) {
  //     return true;
  //   }

  //   console.log("here in Should SAhow Field")
  //   let dependentValue;
  //   if(!open){

  //     dependentValue = formData[field.dependsOn];
  //   }
  //   else{
  //     dependentValue = modalFormData[field.dependsOn];
  //   }
  //   // console.log(dependentValue, field.dependsOn, formData, "Dependent Value and Form Data in shouldShowField");
  //   const showWhenType = field.showWhen || 'equals';

  //   switch (showWhenType) {
  //     // case 'equals':
  //     //   // Single value comparison
  //     //   return dependentValue === field.dependsOnValue;

  //     case 'includes':
  //       // Check if dependent value is in array
  //       if (Array.isArray(field.dependsOnValue)) {
  //         if(Array.isArray(dependentValue)){
  //           return field.dependsOnValue.includes(dependentValue[0]);
  //         }
  //         return field.dependsOnValue.includes(dependentValue);
  //       }
  //       return false;

  //     case 'notEquals':
  //     //   // Show when NOT equal
  //     if(Array.isArray(dependentValue)){
  //       dependentValue.forEach((e)=>{
  //         if(field.)
  //       })
  //       return !field.dependsOnValue.includes(dependentValue);
  //     }else{
  //         return dependentValue !== field.dependsOnValue;

  //       }

  //     default:
  //       return true;
  //   }
  // };

  // New function to validate individual field on change
  const validateFieldOnChange = (fieldId: string, value: any) => {
    const field = formStructure?.fields
      .filter(shouldShowField)
      .find((f) => f.id === fieldId);
    if (!field) return;

    const errorObj: Record<string, any> = { ...formErrors };

    // Check if field is required
    if (field.required && !value) {
      errorObj[fieldId] = `${field.label || fieldId} is required!!`;
    }
    // Email validation
    else if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorObj[fieldId] = `${field.label || fieldId} is not valid!!`;
      } else {
        delete errorObj[fieldId];
      }
    }
    // Number validation
    else if (field.type === "number" && value) {
      if (isNaN(value)) {
        errorObj[fieldId] = `${field.label || fieldId} must be a number!!`;
      } else {
        delete errorObj[fieldId];
      }
    }
    // Date validation
    else if (field.type === "date" && value) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(value)) {
        errorObj[fieldId] = `${field.label || fieldId} must be a valid date!!`;
      } else {
        delete errorObj[fieldId];
      }
    }
    // Clear error if field becomes valid
    else {
      delete errorObj[fieldId];
    }

    setFormErrors(errorObj);
  };

  const handleInputChange = (
    fieldId: string,
    value: any,
    parentId: string | undefined | null,
  ) => {
    if (!open) {
      setFormData((prev) => ({
        ...prev,
        [fieldId]: value,
      }));
      // validateFieldOnChange(fieldId,value);
    } else {
      if (fieldId === "id") {
        if (!checkIfIdisUnique(value)) {
          setError("ID must be unique. This ID already exists.");
        } else {
          setError(null);
        }
      }
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
          if (fieldId === "dependsOnValue") {
            if (!tempObj[fieldId]) {
              tempObj[fieldId] = [];
            }
            if (!tempObj[fieldId].includes(value)) tempObj[fieldId].push(value);
          } else {
            tempObj[fieldId] = value;
          }
        }

        return tempObj;
      });
    }
    validateFieldOnChange(fieldId, value);
  };

  const checkIfIdisUnique = (id: string): boolean => {
    const tempJsonTextData = JSON.parse(jsonText as string);
    const field = tempJsonTextData.fields.find((f: FormField) => f.id === id);
    return !field;
  };

  const isValidForm = () => {
    let errArr: Record<string, any> = {};
    if (open) {
      errArr = validateByData(modalFormData);
    } else {
      errArr = validateByData(formData);
    }
    setFormErrors((prev) => ({ ...prev, ...errArr }));
    return Object.keys(errArr).length > 0;
  };

  const validateByData = (data: Record<string, any>) => {
    const errArr: Record<string, any> = {};
    formStructure.fields.filter(shouldShowField).forEach((f) => {
      if (f.required && !data[f.id]) {
        errArr[f.id] = `${f.id} is required!!`;
      }
      if (f.type === "email" && data[f.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data[f.id])) {
          errArr[f.id] = `${f.id} is not Valid!!`;
        }
      }
    });

    return errArr;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    if (isValidForm()) {
      // console.log("Errors:",formErrors);
      return;
    }
    if (!open) {
      setSubmitted(true);
      // console.log('Form Data:', formData);
      localStorage.setItem("FormData", JSON.stringify(formData));
      alert("Form submitted! Check console for data.");
    } else {
      // console.log('Modal Form Data:', modalFormData);
      // console.log('Json text',jsonText );
      // console.log(formStructure);
      setSubmitted(false);

      const tempModalFormData = JSON.parse(JSON.stringify(modalFormData));
      const tempModalFormDataKeys: string[] = Object.keys(tempModalFormData);
      const options: { value: string; label: string }[] = [];
      let optionObj: { value: string; label: string } = {
        value: "",
        label: "",
      };
      tempModalFormDataKeys.forEach((key) => {
        if (key.startsWith("options")) {
          optionObj = { value: "", label: "" };
          const options_keys = Object.keys(tempModalFormData[key]);
          optionObj["value"] = tempModalFormData[key][options_keys[0]];
          optionObj["label"] = tempModalFormData[key][options_keys[1]];
          options.push(optionObj);
        }
      });
      tempModalFormData.options = options;
      setModalFormData((prev) => ({ ...prev, options }));

      const tempData = convertmodalDataToJSON(tempModalFormData);
      const tempJSONTextData = JSON.parse(jsonText as string);
      if (tempData.dependsOn) {
        const idx = tempJSONTextData.fields.findIndex(
          (f:FormField) => f.id === tempData.dependsOn,
        );
        if (idx !== 1) {
          tempJSONTextData.fields.splice(idx + 1, 0, tempData);
        } else {
          tempJSONTextData.fields.push(tempData);
        }
      } else {
        tempJSONTextData.fields.push(tempData);
      }
      setJsonText?.(JSON.stringify(tempJSONTextData, null, 2));
      onChange?.((prev) => ({ ...prev as FormStructure, ...modalFormJson }));
      setOpen?.(false);
    }
  };

  const convertmodalDataToJSON = (data: any) => {
    return {
      id: data.id || `field-${Date.now()}`,
      type: data.type || "text",
      label: data.label || "New Field",
      placeholder: data.placeholder || "",
      required: Boolean(data.required) || false,
      options: data.options || undefined,
      validation: data.validation || undefined,
      dependsOn: data.dependsOn || undefined,
      dependsOnValue: data.dependsOnValue || undefined,
      showWhen: data.showWhen || undefined,
      fields: data.fields || undefined,
    };
  };

  const renderField = (
    field: FormField,
    parentId?: string | undefined | null,
  ) => {
    const baseInputClasses =
      "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white";

    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "date": {
        let tempObj: propsInputFields;

        if (!open) {
          tempObj = {
            type: field.type,
            id: field.id,
            placeholder: field.placeholder || "",
            required: field.required || false,
            value: formData[field.id] || "",
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(field.id, e.target.value, parentId),
            baseInputClasses,
          };
        } else {
          tempObj = {
            type: field.type,
            id: field.id,
            placeholder: field.placeholder || "",
            required: field.required || false,
            value: parentId
              ? modalFormData[parentId]?.[field.id] || ""
              : modalFormData[field.id] || "",
            // onChange:handleInputChange,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(field.id, e.target.value, parentId),
            baseInputClasses,
          };
        }

        return <InputTextField {...tempObj} />;
      }
      case "textarea": {
        let tempObj: PropsInputTextAreaField;
        if (!open) {
          tempObj = {
            type: field.type,
            id: field.id,
            placeholder: field.placeholder || "",
            required: field.required || false,
            value: formData[field.id] || "",
            // onChange:handleInputChange,
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleInputChange(field.id, e.target.value, parentId),
            baseInputClasses,
          };
        } else {
          tempObj = {
            type: field.type,
            id: field.id,
            placeholder: field.placeholder || "",
            required: field.required || false,
            value: parentId
              ? modalFormData[parentId]?.[field.id] || ""
              : modalFormData[field.id] || "",
            // onChange:handleInputChange,
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleInputChange(field.id, e.target.value, parentId),
            baseInputClasses,
          };
        }
        return (
          //
          <InputTextArea {...tempObj} />
        );
      }
      case "select": {
        let tempObj: propsInputDorpDown;
        if (!open) {
          tempObj = {
            type: field.type,
            id: field.id,
            required: field.required || false,
            value: formData[field.id] || "",
            // onChange:handleInputChange,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
              handleInputChange(field.id, e.target.value, parentId),
            baseInputClasses,
            options: field.options || [],
          };
        } else {
          tempObj = {
            type: field.type,
            id: field.id,
            required: field.required || false,
            value: modalFormData[field.id] || "",
            // onChange:handleInputChange,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
              handleInputChange(field.id, e.target.value, parentId),
            baseInputClasses,
            options: field.options || [],
          };
        }

        return <InputDropDown {...tempObj} />;
      }
      case "checkbox": {
        let tempObj: propsInputCheckBox;
        if (!open) {
          tempObj = {
            type: field.type,
            id: field.id,
            required: field.required || false,
            checked: formData[field.id] || false,
            // onChange:handleInputChange,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(field.id, e.target.checked, parentId),
            baseInputClasses: "w-5 h-5 cursor-pointer",
          };
        } else {
          tempObj = {
            type: field.type,
            id: field.id,
            required: field.required || false,
            checked: modalFormData[field.id] || false,
            // onChange:handleInputChange,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(field.id, e.target.checked, parentId),
            baseInputClasses: "w-5 h-5 cursor-pointer",
          };
        }
        return <InputCheckBox {...tempObj} />;
      }

      case "radio": {
        let tempObj: propsInputRadio;
        if (!open) {
          tempObj = {
            type: field.type,
            id: field.id,
            required: field.required || false,
            checked: formData[field.id],
            // onChange:handleInputChange,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(field.id, e.target.value, parentId),
            baseInputClasses: "w-4 h-4",
            options: field.options || [],
          };
        } else {
          tempObj = {
            type: field.type,
            id: field.id,
            required: field.required || false,
            checked: modalFormData[field.id],
            // onChange:handleInputChange,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(field.id, e.target.value, parentId),
            baseInputClasses: "w-4 h-4",
            options: field.options || [],
          };
        }
        return <InputRadio {...tempObj} />;
      }
      case "button": {
        if (open) {
          const tempObj2: propsButton = {
            type: field.type,
            text: field.label,
            buttonClasses:
              "px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition",
            onClick: handleAddOptionsForSelectOrRadio,
          };
          return <ButtonComponent buttonfield={{ ...tempObj2 }} />;
        }
        break;
      }
      case "group":
        break;
      default:
        return <input type="text" className={baseInputClasses} disabled />;
    }
  };

  const handleAddOptionsForSelectOrRadio = () => {
    onChange?.((prev) => {
      if (!prev) return prev;
      const temp: FormStructure = { ...prev as FormStructure };
      const buttonObj:FormField = temp.fields.find(
        (f: FormField) => f.id === "add-options",
      ) as FormField;
      temp.fields = temp.fields.filter(
        (f: FormField) => f.id !== "add-options",
      );
      const idx:number = temp.fields.findIndex((f) => f.id === "options");
      console.log(idx);
      const num: number = Math.random();
      temp.fields.push(
        {
          id: `options-${num + 1}`,
          type: "group",
          label: "Options",
          fields: [
            {
              id: `options-value-${num + 1}`,
              type: "text",
              label: "option-value",
              placeholder: "Enter value of option",
            },
            {
              id: `options-label-${num + 1}`,
              type: "text",
              label: "option-label",
              placeholder: "Enter label of option",
            },
          ],
          dependsOn: "type",
          dependsOnValue: ["select", "radio"],
          showWhen: "includes",
        },
        buttonObj,
      );
      return temp;
    });
  };

  const handleFormReload = () => {
    if (!open) {
      setFormData(initialValue);
      localStorage.removeItem("FormData");
      setSubmitted(false);
    } else {
      setModalFormData(initialValue);
    }
    setFormErrors({});
  };

  const handleAddField = () => {
    setOpen?.(true);
  };

  const handleRemoveField = (
    field: FormField,
    tag?: string | undefined | null,
  ) => {
    // formStructure.fields = formStructure.fields.filter(f => f.id !== field.id);
    if (tag === "for-options") {
      onChange?.((prev) => {
        if (!prev) return prev;
        const  updatedStructure:FormStructure = { ...prev as FormStructure };
        updatedStructure.fields = updatedStructure.fields.filter(
          (f: FormField) => f.id !== field.id,
        );
        return updatedStructure;
      });

      setModalFormData((prev) => {
        const updatedData = { ...prev };
        delete updatedData[field.id];
        return updatedData;
      });
      return;
    }
    onChange?.((prev) => {
      if (!prev) return prev;
      const updatedStructure: FormStructure = { ...prev as FormStructure };
      if (field.dependsOn) {
        updatedStructure.fields = updatedStructure.fields.filter(
          (f: FormField) => f.id !== field.id,
        );
      } else {
        updatedStructure.fields = updatedStructure.fields.filter(
          (f: FormField) => f.id !== field.id && f.dependsOn !== field.id,
        );
      }
      return updatedStructure;
    });
    setJsonText?.((prev) => {
      try {
        const parsed = JSON.parse(prev as string);
        if (field.dependsOn) {
          parsed.fields = parsed.fields.filter(
            (f: FormField) => f.id !== field.id,
          );
        } else {
          parsed.fields = parsed.fields.filter(
            (f: FormField) => f.id !== field.id && f.dependsOn !== field.id,
          );
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

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex gap-2 justify-between items-center cursor-pointer mb-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {formStructure.formTitle}
          </h1>
          {formStructure.formDescription && (
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {formStructure.formDescription}
            </p>
          )}
        </div>
        <RefreshCw onClick={handleFormReload} />
      </div>
      <div>
        {!open ? (
          <ButtonComponent
            buttonfield={{
              type: "button",
              text: "+ Add Field",
              onClick: handleAddField,
              buttonClasses:
                "mb-6 cursor-pointer px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition",
            }}
          />
        ) : null}
      </div>
      <form onSubmit={handleSubmit} className="space-y-2" noValidate>
        {formStructure.fields.filter(shouldShowField).map((field: FormField) => (
          <div
            key={field.id}
            className={`transition-all duration-300 ${
              shouldShowField(field)
                ? "opacity-100 max-h-96"
                : "opacity-0 max-h-0 hidden"
            }`}
          >
            {field.type !== "checkbox" && field.type !== "button" && (
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
                {field.dependsOn && (
                  <span className="text-xs text-blue-500 ml-2">
                    (conditional)
                  </span>
                )}
              </label>
            )}
            {field.fields &&
              field.fields.length > 0 &&
              field.fields.map((nestedField: FormField, i: number) => (
                <div key={nestedField.id + `${i + 1}`} className="ml-4">
                  <label
                    htmlFor={nestedField.id + `${i + 1}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {nestedField.label}
                    {nestedField.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                    {nestedField.dependsOn && (
                      <span className="text-xs text-blue-500 ml-2">
                        (conditional)
                      </span>
                    )}
                  </label>
                  {renderField(nestedField, field.id)}
                </div>
              ))}

            {field.type === "checkbox" ? (
              <label className="flex items-center gap-2 cursor-pointer">
                {renderField(field)}
                <span className="text-gray-700 dark:text-gray-300">
                  {field.label}
                </span>
              </label>
            ) : (
              renderField(field)
            )}
            {open &&
              field.id === "dependsOnValue" &&
              modalFormData["dependsOnValue"] &&
              modalFormData["dependsOnValue"].length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {modalFormData["dependsOnValue"].map(
                    (val: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-xs"
                      >
                        {val}
                        <X
                          className="inline"
                          onClick={() => {
                            setModalFormData((prev) => {
                              const updatedValues = prev[
                                "dependsOnValue"
                              ].filter((v: string) => v !== val);
                              return { ...prev, dependsOnValue: updatedValues };
                            });
                          }}
                        />
                      </span>
                    ),
                  )}
                </div>
              )}
            {open && field.id === "id" && error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
            {open && ["group"].includes(field.type) ? (
              <ButtonComponent
                buttonfield={{
                  type: "button",
                  buttonClasses:
                    "cursor-pointer mt-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                  text: <CircleMinus />,
                  onClick: () => handleRemoveField(field, "for-options"),
                }}
              />
            ) : null}
            {formErrors && formErrors[field.id] && (
              <p className="text-red-500 text-xs mt-1 ">
                {formErrors[field.id]}
              </p>
            )}
            {!open ? (
              <>
                {/* <ButtonComponent buttonfield={{
                type:"button",
                buttonClasses:"cursor-pointer mt-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                text:<CirclePlus />,
                onClick:()=>handleAddField(field)}}/>  */}
                <ButtonComponent
                  buttonfield={{
                    type: "button",
                    buttonClasses:
                      "cursor-pointer mt-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                    text: <CircleMinus />,
                    onClick: () => handleRemoveField(field),
                  }}
                />
              </>
            ) : null}
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
        <ButtonComponent
          buttonfield={{
            type: "submit",
            buttonClasses: `w-full  text-white font-bold py-3 rounded-lg transition duration-200 ${!!formStructure && formStructure.fields.length === 0 ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"}`,
            text: "Submit Form",
            disabled: !!formStructure && formStructure.fields.length === 0,
          }}
        />
      </form>
      {/* </div> */}
      {submitted && (
        <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h3 className="text-green-800 dark:text-green-300 font-semibold mb-2">
            Form Data:
          </h3>
          <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </div>
    // )
  );
}
