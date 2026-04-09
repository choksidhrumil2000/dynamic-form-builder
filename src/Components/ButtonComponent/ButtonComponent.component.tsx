import type { propsButton } from "../../types/PropsButton";

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
