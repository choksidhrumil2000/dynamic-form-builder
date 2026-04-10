export interface propsInputCheckBox{
    type:string,
    id:string,
    required:boolean,
    checked:boolean,
    // onChange:(arg1:string,arg2:any,arg3:string|undefined|null)=>void,
    onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void,
    baseInputClasses:string,
}

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
