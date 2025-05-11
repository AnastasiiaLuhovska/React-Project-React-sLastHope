import React from "react";

const CustomInput = React.forwardRef(
  (
    { value, onClick, placeholder, icon: IconComponent, classNames = {} },
    ref
  ) => (
    <div className={classNames.wrapper || ""} onClick={onClick}>
      <input
        type="text"
        ref={ref}
        value={value || ""}
        placeholder={placeholder}
        readOnly
        className={classNames.input || ""}
      />
      {IconComponent && <IconComponent className={classNames.icon || ""} />}
    </div>
  )
);

export default CustomInput;
