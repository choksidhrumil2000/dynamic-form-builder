export interface propsInputRadio{
    type:string,
    id:string,
    required:boolean,
    checked:string | null,
    onChange:(arg1:string,arg2:any,arg3:string|undefined|null)=>void,
    baseInputClasses:string,
    options:{value:string,label:string}[],
}