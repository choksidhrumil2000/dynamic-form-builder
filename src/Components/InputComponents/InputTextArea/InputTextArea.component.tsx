export interface PropsInputTextAreaField{
    type:string,
    id:string,
    placeholder:string,
    required:boolean,
    value:string,
    // onChange:(arg1:string,arg2:any,arg3:string|undefined|null)=>void,
    // onChange:(e:React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>)=>void,
    onChange:(e:React.ChangeEvent<HTMLTextAreaElement>)=>void,
    baseInputClasses:string,
}

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
