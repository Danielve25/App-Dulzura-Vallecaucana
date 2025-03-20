import React from "react";
import { useState } from "react";
import LunchPayForm from "./LunchPayForm";

const Modal = ({ id_task, payAmount }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full cursor-pointer bg-cyan-500 py-2 px-6 rounded-lg text-white font-bold mt-5"
      >
        pagar Almuerzo
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
