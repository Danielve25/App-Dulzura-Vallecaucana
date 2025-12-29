import { lazy, useEffect } from "react";
import { useLunch } from "../context/LunchContext";
import "@github/relative-time-element";

import Menu from "../components/Menu";
const SelloImagen = lazy(() => import("../components/icos/CanceladoSello"));

const LunchPage = () => {
  const { getLunchs, lunchs } = useLunch();

  useEffect(() => {
    getLunchs(); // Solo una solicitud para obtener los almuerzos (y menú si está incluido en la respuesta)
  }, []);

  const totalPendiente = lunchs
    .filter((l) => !l.pay)
    .reduce((acc, l) => acc + Number(l.userNeedsPay || 0), 0);
  // Si no hay almuerzos, mostrar mensaje
  if (!lunchs || lunchs.length === 0)
    return (
      <main className="flex h-[calc(100vh-100px)] items-center justify-center w-full">
        <h1>NO TIENES PEDIDOS</h1>
      </main>
    );

  // Tomar solo el primer almuerzo (optimizado para un solo pedido por usuario)

  return (
    <main className="w-full p-4">
      <Menu />
      <header>
        <h2 className="text-2xl font-bold mb-4">
          Pedido de Almuerzo{" "}
          <p className="font-bold mt-4">saldo pendiente: {totalPendiente}</p>
        </h2>
      </header>
      <section className="grid grid-cols-1 gap-4">
        {lunchs.map((lunch) => (
          <article
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
            <p className="mt-2 font-semibold">
              {lunch.pay ? "Pedido pagado ✅" : "Pedido no pagado ❌"}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default LunchPage;
