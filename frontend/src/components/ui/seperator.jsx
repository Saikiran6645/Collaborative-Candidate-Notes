import React from "react";

export function Separator({ className = "", ...props }) {
  return (
    <div
      className={`w-full h-px bg-muted ${className}`}
      role="separator"
      {...props}
    />
  );
}

export default Separator;
