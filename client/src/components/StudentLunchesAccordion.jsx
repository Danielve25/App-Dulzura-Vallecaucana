import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SelloImagen from "./icos/CanceladoSello";

function StudentLunchesAccordion({
  groupedLunchs,
  putLunch,
  loadLunchs,
  loadingPay,
  setLoadingPay,
}) {
  return (
    <Accordion type="multiple" className="w-full">
      {Object.entries(groupedLunchs).map(([studentName, lunchs]) => {
        const totalAmount = lunchs.reduce(
          (sum, lunch) => (!lunch.pay ? sum + lunch.userNeedsPay : sum),
          0
        );
        const pendingPayments = lunchs.filter((lunch) => !lunch.pay).length;

        return (
          <AccordionItem value={studentName} key={studentName}>
            <AccordionTrigger className="text-left text-xl font-medium px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex-col items-start">
              <span className="font-bold">{studentName}</span>
              <span className="text-sm font-normal text-gray-700">
                Total A Pagar: ${totalAmount} - Pendientes: {pendingPayments}
              </span>
            </AccordionTrigger>

            <AccordionContent className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white">
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
                    {lunch.onlysoup && <p>✓ Solo Sopa</p>}
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
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export default StudentLunchesAccordion;
