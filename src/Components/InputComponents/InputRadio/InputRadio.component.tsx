export interface propsInputRadio{
    type:string,
    id:string,
    required:boolean,
    checked:string | null,
    // onChange:(arg1:string,arg2:any,arg3:string|undefined|null)=>void,
    onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void,
    baseInputClasses:string,
    options:{value:string,label:string}[],
}

export default function InputRadio(field: propsInputRadio) {
  return (
    <div className="space-y-2">
      {field.options?.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type={field.type}
            name={field.id}
            value={option.value}
            required={field.required}
            checked={field.checked === option.value}
            onChange={field.onChange}
            className="w-4 h-4"
          />
          <span className="text-gray-700 dark:text-gray-300">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}
