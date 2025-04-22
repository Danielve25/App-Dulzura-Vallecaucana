import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLunch } from "../context/LunchContext";
import { savePayment } from "../api/payment";
import { X } from "lucide-react";

const LunchPayForm = ({ setIsOpen, id_task, payAmount }) => {
  const [isProcessing, setIsProcessing] = useState(false); // Estado para manejar el procesamiento
  const {
    register,
    handleSubmit,
    formState: { errors }, // Se usa para manejar errores de validación
  } = useForm();

  const { payLunch, putLunch } = useLunch(); // Añadir los paréntesis para llamar al hook

  const onSubmit = handleSubmit(async (data) => {
    setIsProcessing(true); // Activar estado de procesamiento
    const stringifiedData = {
      payerName: String(data.payerName),
      phoneNumber: String(data.phoneNumber),
      CCnumber: String(data.CCnumber),
      payAmount: String(payAmount),
      id_task: String(id_task),
    };

    try {
      console.log(stringifiedData);
      const response = await payLunch(stringifiedData);
      console.log("reosuesta sin porscesar: ", response.data);
      console.log(response.data.transactionResponse.orderId); // Mover aquí el log del orderID

      const jsonPut = {
        orderId: response.data.transactionResponse.orderId,
      };
      console.log(jsonPut);

      const jsonSave = {
        orderId: response.data.transactionResponse.orderId.toString(),
        status: response.data.transactionResponse.state,
      };

      console.log(jsonSave);
      const saveResponse = await savePayment(jsonSave);
      console.log(saveResponse);

      const putResponse = await putLunch(jsonPut, id_task);
      console.log(putResponse);
    } catch (error) {
      console.error("Error al procesar el pago:", error);
    } finally {
      setIsProcessing(false); // Desactivar estado de procesamiento
    }
  });

  return (
    <div className="fixed inset-0 backdrop-blur-[4px] flex justify-center items-center z-10">
      <section className="relative max-w-md w-full bg-[#E9E9E9] py-10 px-10 rounded-md">
        <header>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-0 right-0 mt-2 mr-2 cursor-pointer"
          >
            <X className="m-2" />
          </button>
          <h1 className="text-2xl font-bold">Pagar Almuerzo</h1>
        </header>
        {isProcessing && (
          <div className="mb-4 text-center text-blue-500 font-bold">
            El pago se está procesando...
          </div>
        )}
        <form onSubmit={onSubmit}>
          <fieldset>
            <legend className="sr-only">Información del Pagador</legend>
            <div className="mb-[16px]">
              <label htmlFor="payerName" className="label text-[14px]">
                Nombre
              </label>
              <input
                id="payerName"
                type="text"
                placeholder="Nombre"
                className="w-full bg-white text-black h-14 mt-2 rounded-2xl px-4 text-[16px]"
                {...register("payerName", {
                  required: "El nombre es obligatorio",
                })}
              />
              {errors.payerName && (
                <p className="text-red-500 text-[14px]">
                  {errors.payerName.message}
                </p>
              )}
            </div>
            <div className="mb-[16px]">
              <label htmlFor="PhoneNumber" className="label">
                Número de Teléfono
              </label>
              <input
                id="PhoneNumber"
                type="text"
                placeholder="Número de Teléfono"
                className="w-full bg-white text-black h-14 mt-2 rounded-2xl px-4 text-[16px]"
                {...register("phoneNumber", {
                  required: "El número de teléfono es obligatorio",
                })}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-[14px]">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
            <div className="mb-[16px]">
              <label htmlFor="CCnumber" className="label">
                Número de Cédula
              </label>
              <input
                id="CCnumber"
                type="text"
                placeholder="Número de Cédula"
                className="w-full bg-white text-black h-14 mt-2 rounded-2xl px-4 text-[16px]"
                {...register("CCnumber", {
                  required: "El número de cédula es obligatorio",
                })}
              />
              {errors.CCnumber && (
                <p className="text-red-500 text-[14px]">
                  {errors.CCnumber.message}
                </p>
              )}
            </div>
            <input type="hidden" value={payAmount} {...register("payAmount")} />
          </fieldset>
          <button
            type="submit"
            className="cursor-pointer w-full h-14 my-6 rounded-2xl bg-[#008000] text-[#ffffff] font-[1000] text-[16px]"
            disabled={isProcessing} // Deshabilitar botón si está procesando
          >
            Pagar Almuerzos <small>(Nequi)</small>
          </button>
        </form>
      </section>
    </div>
  );
};

export default LunchPayForm;
