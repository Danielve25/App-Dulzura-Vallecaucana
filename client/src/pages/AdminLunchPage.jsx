import { useEffect, useState, Suspense } from "react";
import { useLunch } from "../context/LunchContext";
import Loader from "../components/icos/Loader";

import SelloImagen from "../components/icos/CanceladoSello";

function AdminLunchPage() {
  const { getAllLunchs, putLunch } = useLunch();
  const [groupedLunchs, setGroupedLunchs] = useState({});
  const [loadingPay, setLoadingPay] = useState(null);

  const loadLunchs = async () => {
    try {
      const lunches = await getAllLunchs();
      if (lunches.data.length === 0) {
        setGroupedLunchs({});
        return;
      }
      const grouped = lunches.data.reduce((acc, lunch) => {
        const studentName = lunch.user?.NameStudent; // Verificar si lunch.user no es null o undefined
        if (!studentName) {
          console.warn("Lunch sin usuario asociado:", lunch);
          return acc; // Saltar este almuerzo si no tiene usuario
        }
        if (!acc[studentName]) {
          acc[studentName] = [];
        }
        acc[studentName].push(lunch);
        return acc;
      }, {});
      setGroupedLunchs(grouped);
    } catch (error) {
      console.error("Error cargando almuerzos:", error);
    }
  };

  useEffect(() => {
    loadLunchs();
  }, []);

  if (Object.keys(groupedLunchs).length === 0) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center w-full">
        <h1 className="text-2xl font-bold">NO HAY PEDIDOS REGISTRADOS</h1>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <Suspense fallback={<Loader />}>
        <h2 className="text-2xl font-bold mb-4">
          Panel de Administrador - Almuerzos por Estudiante
        </h2>

        {Object.entries(groupedLunchs).map(([studentName, lunchs]) => {
          const totalAmount = lunchs.reduce(
            (sum, lunch) => (!lunch.pay ? sum + lunch.userNeedsPay : sum),
            0
          );
          const pendingPayments = lunchs.filter((lunch) => !lunch.pay).length;

          return (
            <section
              key={studentName}
              className="mb-4 bg-white rounded-lg shadow-md"
            >
              <details>
                <summary className="text-xl p-4 cursor-pointer hover:bg-gray-50">
                  <span className="font-bold">{studentName}</span>
                  <span className="ml-4 text-sm">
                    Total A Pagar: ${totalAmount} - Pendiente de Pago:{" "}
                    {pendingPayments}
                  </span>
                </summary>

                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {lunchs.map((lunch) => (
                    <article
                      key={lunch._id}
                      className="p-4 border rounded-lg shadow-sm relative bg-gray-50"
                    >
                      {lunch.pay && <SelloImagen />}

                      <p className="text-gray-600">
                        {new Date(lunch.date).toLocaleDateString()}
                      </p>

                      <div className="mt-2 space-y-1">
                        {lunch.userneedscomplete && <p>✓ Almuerzo completo</p>}
                        {lunch.userneedstray && <p>✓ Bandeja</p>}
                        {lunch.userneedsextrajuice && <p>✓ Jugo extra</p>}
                        {lunch.portionOfProtein && <p>✓ Porción Proteína</p>}
                        {lunch.portionOfSalad && <p>✓ Porción Ensalada</p>}
                        {lunch.EspecialStray && <p>✓ Bandeja Especial</p>}
                      </div>

                      <div className="mt-2 text-sm">
                        <p
                          className={`font-bold ${
                            lunch.pay ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {lunch.pay ? "PAGADO" : "PENDIENTE DE PAGO"}
                        </p>
                        <p className="font-bold">
                          Total: ${lunch.userNeedsPay}
                        </p>
                      </div>

                      {!lunch.pay && (
                        <button
                          onClick={async () => {
                            setLoadingPay(lunch._id);
                            try {
                              await putLunch({ pay: true }, lunch._id);
                              await loadLunchs();
                            } catch (error) {
                              console.log(error);
                            } finally {
                              setLoadingPay(null);
                            }
                          }}
                          className="w-full my-4 px-4 py-2 bg-[#008000] text-white rounded transition-transform duration-300 hover:scale-110 disabled:bg-[#338000] disabled:cursor-not-allowed"
                          disabled={loadingPay === lunch._id}
                        >
                          {loadingPay === lunch._id ? (
                            <span className="loader"></span>
                          ) : (
                            "Pagar Almuerzo"
                          )}
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              </details>
            </section>
          );
        })}
      </Suspense>
    </div>
  );
}

export default AdminLunchPage;
