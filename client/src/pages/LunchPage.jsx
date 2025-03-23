import { useEffect, useState } from "react";
import { useLunch } from "../context/LunchContext";
import SelloImagen from "../components/icos/CanceladoSello";

import Modal from "../components/modal";

const LunchPage = () => {
  const { getLunchs, lunchs, verifyPaymentNequi, obteinByOrderID } = useLunch();
  const [orderId, setOrderId] = useState(null);
  const [responsePayment, setResponsePayment] = useState({});

  useEffect(() => {
    getLunchs();
  }, []); // Asegurarse de que el array de dependencias esté vacío para que solo se ejecute una vez

  //verificar pago, solo para meter la repuesta en un arreglo
  useEffect(() => {
    const verifyPayments = async () => {
      for (const lunch of lunchs) {
        if (lunch.orderId) {
          const paymentData = { orderId: lunch.orderId };
          const response = await verifyPaymentNequi(paymentData); // Usar el nombre correcto de la función
          if (response) {
            setResponsePayment(response);
            console.log(response);
          }
        }
      }
    };
    verifyPayments();
  }, [lunchs]); // Ejecutar cuando cambie la lista de lunchs

  useEffect(() => {
    if (responsePayment?.data?.result?.payload?.id) {
      setOrderId(responsePayment.data.result.payload.id);
    }
  }, [responsePayment]);

  useEffect(() => {
    if (orderId) {
      const ObtainIDbyOrderID = async (params) => {
        const res = await obteinByOrderID(params);
        console.log("respuesta del  back", res);
      };
      ObtainIDbyOrderID(orderId);
    }
  }, [orderId]);

  if (lunchs.length === 0)
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center w-full">
        <h1> NO TIENES PEDIDOS</h1>
      </div>
    );

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {lunchs.map((lunch) => (
          <div
            key={lunch._id}
            className="p-4 border rounded-lg shadow-md relative"
          >
            {lunch.pay && (
              <div className="">
                <SelloImagen />
                {/* Asegúrate de que `className` sea una cadena válida */}
              </div>
            )}
            <h1 className="text-xl font-bold">{lunch.title}</h1>
            <p className="text-gray-600">
              {new Date(lunch.date).toLocaleDateString()}
            </p>
            <p className="mt-2">{lunch.description}</p>

            {lunch.userneedscomplete ? (
              <p className="mt-2">
                <strong>Almuerzo completo:</strong> Sí
              </p>
            ) : null}
            {lunch.userneedstray ? (
              <p>
                <strong>Bandeja:</strong> Sí
              </p>
            ) : null}
            {lunch.userneedsextrajuice ? (
              <p>
                <strong>Jugo extra:</strong> Sí
              </p>
            ) : null}
            {lunch.portionOfProtein ? (
              <p>
                <strong>Porción de Proteína:</strong> Sí
              </p>
            ) : null}
            {lunch.portionOfSalad ? (
              <p>
                <strong>Porción de Ensalada:</strong> Sí
              </p>
            ) : null}
            <p className="mt-2">
              <strong>Pago:</strong> {lunch.pay ? "Sí" : "No"}
            </p>

            {lunch.orderId ? (
              <p className="rounded-xl bg-[#f5f5f5] px-4 py-3">
                <strong>numero de transaccion: </strong>
                {lunch.orderId}
              </p>
            ) : null}

            <p>
              <strong>total a pagar:</strong> {lunch.userNeedsPay}
            </p>
            <small className="text-gray-500">
              Actualizado: {new Date(lunch.updatedAt).toLocaleString()}
            </small>

            {!lunch.pay && (
              <Modal id_task={lunch._id} payAmount={lunch.userNeedsPay} />
            )}
            {/*<LunchPaymentButton price={lunch.userNeedsPay} />*/}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LunchPage;
