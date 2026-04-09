export interface propsInputFields{
    type:string,
    id:string,
    placeholder:string,
    required:boolean,
    value:string,
    // onChange:(arg1:string,arg2:any,arg3:string|undefined|null)=>void,
    // onChange:(e:React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>)=>void,
    onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void,
    baseInputClasses:string,

}