export interface propsInputDorpDown{
    type:string,
    id:string,
    required:boolean,
    value:string,
    onChange:(arg1:string,arg2:any)=>void,
    baseInputClasses:string,
    options:{value:string,label:string}[],
}