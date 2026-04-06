export interface propsButton{
    type:"button" | "submit" | "reset",
    onClick?:()=>void,
    buttonClasses:string,
    text:string,
}