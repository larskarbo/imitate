import React from "react";

export const Button = ({ onClick, children, }) => {
  return (
    <button
      className={`mt-8 flex font-light items-center border border-gray-400 rounded p-2 px-4
    hover:border-gray-600 transition-colors duration-150 hover:shadow-sm`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
