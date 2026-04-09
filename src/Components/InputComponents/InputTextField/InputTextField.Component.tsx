import type { propsInputFields } from "../../../types/propsInputFields";

export default function InputTextField(field: propsInputFields) {
  return (
    <input
      type={field.type}
      id={field.id}
      placeholder={field.placeholder}
      required={field.required}
      value={field.value || ""}
      onChange={field.onChange}
      className={field.baseInputClasses}
    />
  );
}
