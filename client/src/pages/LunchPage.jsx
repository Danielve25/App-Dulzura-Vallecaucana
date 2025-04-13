import { useEffect } from "react";
import { useLunch } from "../context/LunchContext";
import SelloImagen from "../components/icos/CanceladoSello";
import Modal from "../components/modal";
import usePayment from "../hooks/usePayment";
import Menu from "../components/Menu";
import "@github/relative-time-element";

const LunchPage = () => {
  const { getLunchs, lunchs, verifyPaymentNequi, putLunch } = useLunch();
  const { pendingOrders, responsePayment } = usePayment(
    lunchs,
    verifyPaymentNequi,
    putLunch
  );

  const totalAmount = lunchs.reduce(
    (sum, lunch) => (!lunch.pay ? sum + (lunch.userNeedsPay || 0) : sum),
    0
  );

  useEffect(() => {
    getLunchs();
  }, [getLunchs]);

  if (lunchs.length === 0)
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center w-full">
        <h1>NO TIENES PEDIDOS</h1>
      </div>
    );

  return (
    <div className="w-full p-4">
      <Menu />
      <h2 className="text-2xl font-bold mb-4">
        Pendiente de Pago: {totalAmount}
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
            {lunch.userneedscomplete && (
              <p className="rounded-xl ">
                <strong>
                  Almuerzo Completo: {lunch.userneedscomplete ? "Sí" : null}
                </strong>
              </p>
            )}

            {lunch.userneedstray && (
              <p className="rounded-xl ">
                <strong>
                  Bandeja Normal: {lunch.userneedstray ? "Sí" : null}
                </strong>
              </p>
            )}
            {lunch.EspecialStray && (
              <p className="rounded-xl ">
                <strong>
                  Bandeja Especial: {lunch.EspecialStray ? "Sí" : null}
                </strong>
              </p>
            )}
            {lunch.portionOfProtein && (
              <p className="rounded-xl ">
                <strong>
                  Porción de Proteína: {lunch.portionOfProtein ? "Sí" : null}
                </strong>
              </p>
            )}
            {lunch.portionOfSalad && (
              <p className="rounded-xl ">
                <strong>
                  Porción de Ensalada: {lunch.portionOfSalad ? "Sí" : null}
                </strong>
              </p>
            )}
            {lunch.userneedsextrajuice && (
              <p className="rounded-xl ">
                <strong>
                  Jugo Extra: {lunch.userneedsextrajuice ? "Sí" : null}
                </strong>
              </p>
            )}
            <p className="mt-2">
              <strong>Pago:</strong> {lunch.pay ? "Sí" : "No"}
            </p>
            {lunch.orderId && (
              <p className="rounded-xl bg-[#f5f5f5] px-4 py-3">
                <strong>Número de Transacción: </strong>
                {lunch.orderId}
              </p>
            )}
            <p>
              <strong>Total a Pagar:</strong> {lunch.userNeedsPay}
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
