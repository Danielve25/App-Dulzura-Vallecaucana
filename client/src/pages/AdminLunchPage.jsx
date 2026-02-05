import { useEffect, useState, Suspense, lazy } from "react";
import { useLunch } from "../context/LunchContext";
import Loader from "@/components/icos/Loader";
import ChartComponent from "@/components/ChartComponent";
import { DataTable } from "@/components/DataTable";
import CreatePendingLunchForm from "@/components/CreatePendingLunchForm";
import StudentLunchesAccordion from "@/components/StudentLunchesAccordion";
import PendingLunchesAccordion from "@/components/PendingLunchesAccordion";
import useLunchData from "../hooks/useLunchData";
import { Separator } from "@/components/ui/separator";
import Modal from "@/components/Modal";
const CirclePlus = lazy(() =>
  import("lucide-react").then((module) => ({ default: module.CirclePlus })),
);
function AdminLunchPage() {
  const chartConfig = {
    Almuerzos: { label: "Almuerzos", color: "#6495ED" },
  };

  const { putLunch, CreateLunchAdmin, assignPendingLunches } = useLunch();
  const {
    groupedLunchs,
    pendingLunches,
    chartData,
    dataTable,
    users,
    loadLunchs,
  } = useLunchData();
  const [loadingPay, setLoadingPay] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const handleAssign = async (nameClient) => {
    if (!selectedUser) {
      alert("Selecciona un usuario");
      return;
    }
    try {
      await assignPendingLunches({ userId: selectedUser, nameClient });
      alert("Almuerzos asignados");
      loadLunchs();
    } catch (error) {
      console.log(error);
      alert("Error al asignar");
    }
  };

  const onSubmitPending = async (formattedData) => {
    try {
      await CreateLunchAdmin(formattedData);
      setSubmitted(true);
      loadLunchs();
    } catch (error) {
      console.error(error);
    }
  };

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

        <ChartComponent
          className="bg-white border-slate-300 shadow-md"
          chartData={chartData}
          chartConfig={chartConfig}
          lineType="line"
          defaultTimeRange="30d"
          chartTitle="Almuerzos Pedidos"
          chartDescription="Monstrando todos los almuerzos pedidos"
        />
        <DataTable data={dataTable} onRefresh={loadLunchs} />
        <h1 className="text-3xl! font-bold mb-4  text-red-500">
          ALMUERZOS PENDIENTES:
        </h1>
        <Modal
          className="px-4 py-2 flex bg-orange-600 text-white rounded hover:scale-110 transition-all hover:bg-orange-700!"
          text="Añadir pedido"
          onSubmit={onSubmitPending}
          submitted={submitted}
        >
          <CirclePlus className="" />
          Añadir pedido
        </Modal>
        <PendingLunchesAccordion
          pendingLunches={pendingLunches}
          users={users}
          setSelectedUser={setSelectedUser}
          handleAssign={handleAssign}
        />
        <h1 className="text-3xl! font-bold mt-8 mb-4 center-text text-red-500">
          Almuerzos por Estudiante:
        </h1>
        <Separator className="" />
        <StudentLunchesAccordion
          groupedLunchs={groupedLunchs}
          putLunch={putLunch}
          loadLunchs={loadLunchs}
          loadingPay={loadingPay}
          setLoadingPay={setLoadingPay}
        />
      </Suspense>
    </div>
  );
}

export default AdminLunchPage;
