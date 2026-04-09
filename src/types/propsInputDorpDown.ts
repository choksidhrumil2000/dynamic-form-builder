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