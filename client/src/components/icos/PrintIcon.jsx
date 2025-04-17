import React from "react";

function PrintIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-printer"
      {...props}
    >
      <path d="M0 0h24v24H0z" stroke="none" />
      <path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2M17 9V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4" />
      <path d="M7 15a2 2 0 012-2h6a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
    </svg>
  );
}

export default PrintIcon;
