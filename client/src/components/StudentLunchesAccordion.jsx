import { useState } from "react"; // 1. Importar useState
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SelloImagen from "./icos/CanceladoSello";
import { deleteLunchAdminRequest } from "@/api/lunch";

function StudentLunchesAccordion({
  groupedLunchs,
  putLunch,
  loadLunchs,
  loadingPay,
  setLoadingPay,
}) {
  // 2. Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // 3. Filtrar los estudiantes basados en el nombre
  const filteredEntries = Object.entries(groupedLunchs).filter(
    ([studentName]) =>
      studentName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full space-y-4">
      {/* 4. Input de búsqueda */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Buscar estudiante por nombre..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      <Accordion type="multiple" className="w-full">
        {/* 5. Usar las entradas filtradas en lugar de las originales */}
        {filteredEntries.length > 0 ? (
          filteredEntries.map(([studentName, lunchs]) => {
            const outstandingbalance = lunchs[0]?.user?.outstandingbalance ?? 0;
            const fatherName =
              lunchs[0]?.user?.fatherName || "no padre asignado";
            const totalAmount =
              lunchs.reduce(
                (sum, lunch) => (!lunch.pay ? sum + lunch.userNeedsPay : sum),
                0,
              ) + outstandingbalance;
            const pendingPayments = lunchs.filter((lunch) => !lunch.pay).length;

            return (
              <AccordionItem value={studentName} key={studentName}>
                <AccordionTrigger className="text-left text-xl font-medium px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex-col items-start">
                  <span className="text-sm text-gray-600">
                    Padre: {fatherName}
                  </span>
                  <span className="font-bold">estudiante: {studentName}</span>
                  <span className="text-sm font-normal text-gray-700">
                    saldo pendiente: ${outstandingbalance} - Total A Pagar: $
                    {totalAmount} - Pendientes: {pendingPayments}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white">
                  {lunchs.map((lunch) => (
                    <article
                      key={lunch._id}
                      className="p-4 border rounded-lg shadow-sm relative bg-gray-50"
                    >
                      {lunch.pay && <SelloImagen />}
                      <p className="text-gray-600 text-xs">
                        ID: {lunch._id.slice(-6)}
                      </p>
                      <p className="text-gray-600">
                        Pedido: {lunch.date.split("T")[0]}
                      </p>

                      <div className="mt-2 space-y-1 text-sm">
                        {lunch.userneedscomplete && <p>✓ Almuerzo completo</p>}
                        {lunch.userneedstray && <p>✓ Bandeja</p>}
                        {lunch.userneedsextrajuice && <p>✓ Jugo extra</p>}
                        {lunch.portionOfProtein && <p>✓ Porción Proteína</p>}
                        {lunch.portionOfSalad && <p>✓ Porción Ensalada</p>}
                        {lunch.EspecialStray && <p>✓ Bandeja Especial</p>}
                        {lunch.onlysoup && <p>✓ Solo Sopa</p>}
                      </div>

                      <div className="mt-2 text-sm">
                        <p
                          className={`font-bold ${lunch.pay ? "text-green-600" : "text-red-600"}`}
                        >
                          {lunch.pay ? "PAGADO" : "PENDIENTE"}
                        </p>
                        <p className="font-bold">
                          Total: ${lunch.userNeedsPay}
                        </p>
                      </div>

                      {!lunch.pay && (
                        <div className="flex flex-col gap-2 mt-4">
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
                            className="w-full px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 disabled:opacity-50"
                            disabled={loadingPay === lunch._id}
                          >
                            {loadingPay === lunch._id
                              ? "Procesando..."
                              : "Pagar"}
                          </button>
                          <button
                            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            onClick={async () => {
                              if (
                                confirm(
                                  "¿Seguro que deseas eliminar este almuerzo?",
                                )
                              ) {
                                try {
                                  await deleteLunchAdminRequest(lunch._id);
                                  await loadLunchs();
                                } catch (error) {
                                  console.error(error);
                                  alert("Error al eliminar");
                                }
                              }
                            }}
                          >
                            Borrar
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                </AccordionContent>
              </AccordionItem>
            );
          })
        ) : (
          <div className="text-center py-10 text-gray-500">
            No se encontraron estudiantes con "{searchTerm}"
          </div>
        )}
      </Accordion>
    </div>
  );
}

export default StudentLunchesAccordion;
