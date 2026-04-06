import type { propsInputDorpDown } from "../../../types/propsInputDorpDown";

export default function InputDropDown(field:propsInputDorpDown) {
    return(
        <select
            id={field.id}
            required={field.required}
            value={field.value}
            onChange={(e) => field.onChange(field.id, e.target.value)}
            className={field.baseInputClasses}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
    );
}