import type React from "react";
import type { ButtonProps } from "../props/props";


const Button: React.FC<ButtonProps> = ({title, styles}) => {
  return (
    <button className={`px-4 py-2 mb-2 rounded ${styles || ""}`}>
        {title}
    </button>
  )
}

export default Button