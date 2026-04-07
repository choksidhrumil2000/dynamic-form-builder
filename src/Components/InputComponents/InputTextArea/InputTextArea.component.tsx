import type { propsInputFields } from "../../../types/propsINputFields";

export default function InputTextArea(field:propsInputFields) {
    return(
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