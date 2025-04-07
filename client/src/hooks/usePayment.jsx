import { useState, useEffect } from "react";
import { obteinLunchByOrderID } from "../api/lunch";
import { editPaymentStatus } from "../api/payment";
const usePayment = (lunchs, verifyPaymentNequi, putLunch) => {
  const [responsePayment, setResponsePayment] = useState({});
  const [currentLunchId, setCurrentLunchId] = useState(null);
  const [pendingOrders, setPendingOrders] = useState(new Set());
  const [responseLunchBack, setResponseLunchBack] = useState();
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const verifyPayments = async () => {
      for (const lunch of lunchs) {
        if (lunch.orderId && !lunch.pay) {
          setCurrentLunchId(lunch._id);
          const paymentData = { orderId: lunch.orderId };
          const response = await verifyPaymentNequi(paymentData);
          if (response) {
            console.log("Respuesta de verificación de pago:", response); // Log de la respuesta
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

          const upDateNewData = async () => {
            try {
              const editData = {
                OrderId: currentOrder,
                payment: {
                  status: transactionState,
                },
              };

              const res = await editPaymentStatus(editData);
              console.log("Respuesta de actualización de estado de pago:", res);

              // Recargar la ventana después de actualizar el estado de pago
            } catch (error) {
              console.log("Error actualizando estado de pago:", error);
            }
          };

          upDateNewData();

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

            const upDateNewData = async () => {
              try {
                await editPaymentStatus({
                  OrderId: currentOrder,
                  status: transactionState,
                });
              } catch (error) {
                console.log("Error actualizando estado de pago:", error);
              }
            };

            upDateNewData(); // Ahora está dentro del bloque if
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
  }, [orderId]);

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

      window.location.reload();
    }
  }, [responseLunchBack, putLunch]);

  return { pendingOrders, responsePayment };
};

export default usePayment;
