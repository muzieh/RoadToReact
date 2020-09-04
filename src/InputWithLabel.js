import React from "react";

export default function InputWithLabel({
  id,
  label,
  type = "text",
  value,
  onInputChange
}) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        input={type}
        onChange={(event) => onInputChange(event.target.value)}
        value={value}
      />
    </>
  );
}
