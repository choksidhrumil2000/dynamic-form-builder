export interface propsInputCheckBox{
    type:string,
    id:string,
    required:boolean,
    checked:boolean,
    onChange:(arg1:string,arg2:any)=>void,
    baseInputClasses:string,
}