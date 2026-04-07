export interface propsInputFields{
    type:string,
    id:string,
    placeholder:string,
    required:boolean,
    value:string,
    onChange:(arg1:string,arg2:any,arg3:string|undefined|null)=>void,
    baseInputClasses:string,

}