import type { JSX } from "react";

export interface propsButton{
    type:"button" | "submit" | "reset",
    onClick?:()=>void,
    buttonClasses:string,
    text:string | JSX.Element,
    disabled?:boolean
}