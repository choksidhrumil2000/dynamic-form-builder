import type { propsInputCheckBox } from "../../../types/propsInputCheckBox";

export default function InputCheckBox(field: propsInputCheckBox) {
  return (
    <input
      type={field.type}
      id={field.id}
      required={field.required}
      checked={field.checked}
      onChange={field.onChange}
      className={field.baseInputClasses}
    />
  );
}
