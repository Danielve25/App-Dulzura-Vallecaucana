import React from "react";

function AddIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="icon icon-tabler icons-tabler-filled icon-tabler-circle-plus"
      {...props}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M4.929 4.929A10 10 0 1119.07 19.07 10 10 0 014.93 4.93zM13 9a1 1 0 10-2 0v2H9a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V9z" />
    </svg>
  );
}

export default AddIcon;
