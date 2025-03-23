import { useEffect, useState } from "react";
import { useLunch } from "../context/LunchContext";
import SelloImagen from "../components/icos/CanceladoSello";
import { obteinLunchByOrderID } from "../api/lunch";
import Modal from "../components/modal";
import "@github/relative-time-element";

const LunchPage = () => {
  const { getLunchs, lunchs, verifyPaymentNequi, putLunch } = useLunch();
  const [responseLunchBack, setResponseLunchBack] = useState();
  const [orderId, setOrderId] = useState(null);
  const [responsePayment, setResponsePayment] = useState({});
  const [currentLunchId, setCurrentLunchId] = useState(null);
  const [pendingOrders, setPendingOrders] = useState(new Set());

  const totalAmount = lunchs.reduce(
    (sum, lunch) => (!lunch.pay ? sum + (lunch.userNeedsPay || 0) : sum),
    0
  );

  useEffect(() => {
    getLunchs();
  }, []);

  useEffect(() => {
    const verifyPayments = async () => {
      for (const lunch of lunchs) {
        if (lunch.orderId && !lunch.pay) {
          setCurrentLunchId(lunch._id);
          const paymentData = { orderId: lunch.orderId };
          const response = await verifyPaymentNequi(paymentData);
          if (response) {
            const currentOrder = lunch.orderId;
            setResponsePayment({ ...response, currentOrder });
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
      const currentOrder = responsePayment.currentOrder;

      switch (transactionState) {
        case "APPROVED":
          setOrderId(responsePayment.data.result.payload.id);
          setPendingOrders((prev) => {
            const newSet = new Set(prev);
            newSet.delete(currentOrder);
            return newSet;
          });
          break;

        case "DECLINED":
          if (currentLunchId) {
            const updateData = { orderId: null };
            putLunch(updateData, currentLunchId);
            setCurrentLunchId(null);
            setPendingOrders((prev) => {
              const newSet = new Set(prev);
              newSet.delete(currentOrder);
              return newSet;
            });
          }
          break;

        case "PENDING":
          setPendingOrders((prev) => new Set([...prev, currentOrder]));
          break;
      }
    }
  }, [responsePayment, currentLunchId, putLunch]);

  useEffect(() => {
    if (orderId) {
      const obtainID = async () => {
        try {
          const res = await obteinLunchByOrderID(orderId);
          setResponseLunchBack(res);
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
          await putLunch(updateData, responseLunchBack.data._id);
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
      <h2 className="text-2xl font-bold mb-4">
        Pendiente De Pago: {totalAmount}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {lunchs.map((lunch) => (
          <div
            key={lunch._id}
            className="p-4 border rounded-lg shadow-md relative"
          >
            {lunch.pay && <SelloImagen />}
            <h1 className="text-xl font-bold">{lunch.title}</h1>
            <p className="text-gray-600">
              <relative-time datetime={lunch.date}></relative-time>
            </p>
            <p className="mt-2">{lunch.description}</p>
            <p className="mt-2">
              <strong>Pago:</strong> {lunch.pay ? "Sí" : "No"}
            </p>
            {lunch.orderId && (
              <p className="rounded-xl bg-[#f5f5f5] px-4 py-3">
                <strong>Número de transacción: </strong>
                {lunch.orderId}
              </p>
            )}
            <p>
              <strong>Total a pagar:</strong> {lunch.userNeedsPay}
            </p>
            <small className="text-gray-500">
              Actualizado:{" "}
              <relative-time datetime={lunch.updatedAt}></relative-time>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default LunchPage;
