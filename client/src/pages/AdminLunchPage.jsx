import { useEffect, useState, Suspense } from "react";
import { useLunch } from "../context/LunchContext";
import Loader from "@/components/icos/Loader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SelloImagen from "../components/icos/CanceladoSello";
import ChartComponent from "@/components/ChartComponent";

function AdminLunchPage() {
  const chartConfig = {
    Almuerzos: { label: "Almuerzos", color: "#6495ED" },
  };

  const [chartData, setChartData] = useState([]);
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
        const studentName = lunch.user?.NameStudent;
        if (!studentName) return acc;
        if (!acc[studentName]) acc[studentName] = [];
        acc[studentName].push(lunch);
        return acc;
      }, {});
      setGroupedLunchs(grouped);
      const dailyCounts = lunches.data.reduce((acc, lunch) => {
        const date = new Date(lunch.date).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const chartFormattedData = Object.entries(dailyCounts).map(
        ([date, count]) => ({
          date,
          Almuerzos: count,
        })
      );

      const updatedData = chartFormattedData.map((item) => {
        const dateParts = item.date.split("-");
        let year = parseInt(dateParts[0]);
        let month = parseInt(dateParts[1]) - 1; // Los meses en JavaScript son 0-indexados
        let day = parseInt(dateParts[2]);

        const dateObject = new Date(year, month, day);
        dateObject.setDate(dateObject.getDate() + 1);

        const newYear = dateObject.getFullYear();
        const newMonth = (dateObject.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        const newDay = dateObject.getDate().toString().padStart(2, "0");

        return {
          ...item,
          date: `${newYear}-${newMonth}-${newDay}`,
        };
      });
      setChartData(updatedData);
    } catch (error) {
      console.error("Error cargando almuerzos:", error);
    }
  };

  console.log(chartData);

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
                    Total A Pagar: ${totalAmount} - Pendientes:{" "}
                    {pendingPayments}
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
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Suspense>
      <ChartComponent
        className="bg-white border-0 shadow-md"
        chartData={chartData}
        chartConfig={chartConfig}
        lineType="line"
        defaultTimeRange="30d"
        chartTitle="Almuerzos Pedidos"
        chartDescription="Monstrando todos los almuerzos pedidos"
      />
    </div>
  );
}

export default AdminLunchPage;
