import { useEffect, useState } from "react";
import { useLunch } from "../context/LunchContext";
import SelloImagen from "../components/icos/CanceladoSello";

function AdminLunchPage() {
  const { getAllLunchs, putLunch } = useLunch();
  const [groupedLunchs, setGroupedLunchs] = useState({});

  const loadLunchs = async () => {
    try {
      const lunches = await getAllLunchs();
      if (lunches.data.length === 0) {
        setGroupedLunchs({});
        return;
      }
      const grouped = lunches.data.reduce((acc, lunch) => {
        const studentName = lunch.user.NameStudent;
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
      <h2 className="text-2xl font-bold mb-4">
        Panel de Administrador - Almuerzos por Estudiante
      </h2>

      {Object.entries(groupedLunchs).map(([studentName, lunchs]) => {
        const totalAmount = lunchs.reduce(
          (sum, lunch) => sum + lunch.userNeedsPay,
          0
        );
        const pendingPayments = lunchs.filter((lunch) => !lunch.pay).length;

        return (
          <details
            key={studentName}
            className="mb-4 bg-white rounded-lg shadow-md"
          >
            <summary className="text-xl p-4 cursor-pointer hover:bg-gray-50">
              <span className="font-bold">{studentName}</span>
              <span className="ml-4 text-sm">
                Total: ${totalAmount} - Pendiente de pago: {pendingPayments}
              </span>
            </summary>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {lunchs.map((lunch) => (
                <div
                  key={lunch._id}
                  className="p-4 border rounded-lg shadow-sm relative bg-gray-50"
                >
                  {lunch.pay && (
                    <div className="absolute top-2 right-2">
                      <SelloImagen />
                    </div>
                  )}

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
                    <p className="font-bold">Total: ${lunch.userNeedsPay}</p>
                  </div>

                  {!lunch.pay && (
                    <button
                      onClick={async () => {
                        try {
                          await putLunch({ pay: true }, lunch._id);
                          await loadLunchs(); // Recargar los almuerzos
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                      className="w-full cursor-pointer my-4 px-4 py-2 bg-[#008000] text-white rounded transition-transform duration-300 hover:scale-110"
                    >
                      Pagar Almuerzo
                    </button>
                  )}
                </div>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}

export default AdminLunchPage;
