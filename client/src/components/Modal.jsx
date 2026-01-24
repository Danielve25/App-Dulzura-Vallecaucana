import React, { lazy } from "react";
import { useState } from "react";
import { Button } from "./ui/button";

const CreatePendingLunchForm = lazy(() => import("./CreatePendingLunchForm"));

const Modal = ({
  id_task,
  disabled,
  children,
  className,
  onSubmit,
  submitted,
}) => {
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
        <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-10">
          <CreatePendingLunchForm
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            id_task={id_task}
            onSubmit={onSubmit}
            submitted={submitted}
          />
        </div>
      )}
    </>
  );
};

export default Modal;
