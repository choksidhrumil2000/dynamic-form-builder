export interface propsInputFields{
    type:string,
    id:string,
    placeholder:string,
    required:boolean,
    value:string,
    onChange:(arg1:string,arg2:any)=>void,
    baseInputClasses:string,

}