export interface propsInputDorpDown{
    type:string,
    id:string,
    required:boolean,
    value:string,
    // onChange:(arg1:string,arg2:any,arg3:string|undefined|null)=>void,
    onChange:(e:React.ChangeEvent<HTMLSelectElement>)=>void,
    baseInputClasses:string,
    options:{value:string,label:string}[],
}

export default function InputDropDown(field: propsInputDorpDown) {
  return (
    <select
      id={field.id}
      required={field.required}
      value={field.value}
      onChange={field.onChange}
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
