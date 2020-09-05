import React from "react";

export default function InputWithLabel({
  id,
  label,
  type = "text",
  value,
  onInputChange,
  children,
  isFocused
}) {
  const inputRef = React.useRef();
  React.useEffect(() => {
      if(isFocused && inputRef.current) {
        console.log('focus' + id)
        inputRef.current.focus();
      }
  }, [isFocused, id]);
  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input
        ref={inputRef}
        input={type}
        onChange={(event) => onInputChange(event.target.value)}
        value={value}
      />
    </>
  );
}
