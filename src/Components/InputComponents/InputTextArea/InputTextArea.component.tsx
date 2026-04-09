import type { PropsInputTextAreaField } from "../../../types/PropsInputTextAreaField";

export default function InputTextArea(field: PropsInputTextAreaField) {
  return (
    <textarea
      id={field.id}
      placeholder={field.placeholder}
      required={field.required}
      value={field.value}
      onChange={field.onChange}
      rows={4}
      className={field.baseInputClasses}
    />
  );
}
