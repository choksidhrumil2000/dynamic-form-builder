import type { propsInputRadio } from "../../../types/propsInputRadio";

export default function InputRadio(field:propsInputRadio){
    return(
<div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type={field.type}
                  name={field.id}
                  value={option.value}
                  required={field.required}
                  checked={field.checked === option.value}
                  onChange={(e) => field.onChange(field.id, e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
    )
}