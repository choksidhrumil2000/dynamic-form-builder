import type { JSX } from "react";

export interface propsButton{
    type:"button" | "submit" | "reset",
    onClick?:()=>void,
    buttonClasses:string,
    text:string | JSX.Element,
    disabled?:boolean
}

export default function ButtonComponent({
  buttonfield,
}: {
  buttonfield: propsButton;
}) {
  return (
    <button
      type={buttonfield.type}
      className={buttonfield.buttonClasses}
      onClick={buttonfield.onClick}
      disabled={buttonfield.disabled}
    >
      {buttonfield.text}
    </button>
  );
}
