import React from "react";
import { useState } from "react";
import LunchPayForm from "./LunchPayForm";

const Modal = ({ id_task, payAmount, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={`w-full cursor-pointer py-2 px-6 rounded-lg text-white font-bold mt-5 ${
          disabled ? "bg-gray-400 cursor-not-allowed" : "bg-cyan-500"
        }`}
      >
        {disabled ? "Pago en Proceso" : "Pagar Almuerzo"}
      </button>
      {isOpen && (
        <LunchPayForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          id_task={id_task}
          payAmount={payAmount}
        />
      )}
    </>
  );
};

export default Modal;
