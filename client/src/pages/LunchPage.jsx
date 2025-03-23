import { useEffect, useState } from "react";
import { useLunch } from "../context/LunchContext";
import SelloImagen from "../components/icos/CanceladoSello";
import { obteinLunchByOrderID } from "../api/lunch";
import Modal from "../components/modal";

const LunchPage = () => {
  const { getLunchs, lunchs, verifyPaymentNequi, putLunch } = useLunch();
  const [responseLunchBack, setResponseLunchBack] = useState();
  const [orderId, setOrderId] = useState(null);
  const [responsePayment, setResponsePayment] = useState({});
  const [currentLunchId, setCurrentLunchId] = useState(null);
  const [pendingOrders, setPendingOrders] = useState(new Set());

  useEffect(() => {
    getLunchs();
  }, []);

  //verificar pago, solo para meter la repuesta en un arreglo
  useEffect(() => {
    const verifyPayments = async () => {
      for (const lunch of lunchs) {
        if (lunch.orderId && !lunch.pay) {
          setCurrentLunchId(lunch._id);
          const paymentData = { orderId: lunch.orderId };
          const response = await verifyPaymentNequi(paymentData);
          if (response) {
            // Guardar el orderId actual antes de procesar la respuesta
            const currentOrder = lunch.orderId;
            setResponsePayment({ ...response, currentOrder });
            console.log("respuesta del pago", response);
          }
        }
      }
    };
    verifyPayments();
  }, [lunchs, verifyPaymentNequi]);

  useEffect(() => {
    if (
      responsePayment?.data?.result?.payload?.transactions?.[0]
        ?.transactionResponse
    ) {
      const transactionState =
        responsePayment.data.result.payload.transactions[0].transactionResponse
          .state;
      const currentOrder = responsePayment.currentOrder; // Usar el orderId guardado

      if (transactionState === "APPROVED") {
        setOrderId(responsePayment.data.result.payload.id);
        setPendingOrders((prev) => {
          const newSet = new Set(prev);
          newSet.delete(currentOrder);
          return newSet;
        });
      } else if (transactionState === "DECLINED" && currentLunchId) {
        const updateData = { orderId: null };
        putLunch(updateData, currentLunchId);
        setCurrentLunchId(null);
        setPendingOrders((prev) => {
          const newSet = new Set(prev);
          newSet.delete(currentOrder);
          return newSet;
        });
      } else if (transactionState === "PENDING") {
        setPendingOrders((prev) => new Set([...prev, currentOrder]));
      }
    }
  }, [responsePayment, currentLunchId, putLunch]);

  useEffect(() => {
    if (orderId) {
      const obtainID = async () => {
        try {
          const res = await obteinLunchByOrderID(orderId);
          setResponseLunchBack(res);
          console.log("respuesta del back", res);
        } catch (error) {
          console.log(error);
        }
      };
      obtainID();
    }
  }, [orderId, getLunchs]);

  useEffect(() => {
    if (responseLunchBack) {
      const updateLunchStatus = async () => {
        try {
          const updateData = {
            pay: true,
          };
          const res = await putLunch(updateData, responseLunchBack.data._id);
          console.log("Lunch actualizado:", res);
        } catch (error) {
          console.log("Error actualizando lunch:", error);
        }
      };
      updateLunchStatus();
    }
  }, [responseLunchBack, getLunchs, putLunch]);

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
              <Modal
                id_task={lunch._id}
                payAmount={lunch.userNeedsPay}
                disabled={
                  pendingOrders.has(lunch.orderId) ||
                  responsePayment?.data?.result?.payload?.transactions?.[0]
                    ?.transactionResponse?.state === "APPROVED"
                }
              />
            )}
            {/*<LunchPaymentButton price={lunch.userNeedsPay} />*/}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LunchPage;
