import React, { lazy } from "react";
import { useState } from "react";
import { Button } from "./ui/button";

const LunchPayForm = lazy(() => import("./LunchPayForm"));

const Modal = ({ id_task, payAmount, disabled, children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={className}
      >
        {children}
      </Button>
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
