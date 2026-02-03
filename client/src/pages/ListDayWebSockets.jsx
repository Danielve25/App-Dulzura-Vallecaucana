import React, { useEffect, useState, lazy, useRef, Suspense } from "react";
import io from "socket.io-client";
import { Button } from "@/components/ui/button";
import { useLunch } from "../context/LunchContext";
import { Temporal } from "temporal-polyfill";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Loader from "@/components/icos/Loader";
import ExcelJS from "exceljs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Modal from "@/components/Modal";
import useLunchData from "@/hooks/useLunchData";

const PrintIcon = lazy(() =>
  import("lucide-react").then((module) => ({ default: module.Printer })),
);
const DownloadIcon = lazy(() =>
  import("lucide-react").then((module) => ({ default: module.Download })),
);
const EyeIcon = lazy(() =>
  import("lucide-react").then((module) => ({ default: module.Eye })),
);
const CirclePlus = lazy(() =>
  import("lucide-react").then((module) => ({ default: module.CirclePlus })),
);

const SOCKET_URL = import.meta.env.VITE_API_URL;

const ListDayWebSockets = () => {
  const { getAllLunchs, CreateLunchAdmin } = useLunch();
  const { loadLunchs } = useLunchData();
  const [todayLunchs, setTodayLunchs] = useState([]);
  const [DayToday, setdayToday] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const tableRef = useRef();

  // --- LÓGICA DE FILTRADO Y ORDENAMIENTO (Basada en ListDays) ---
  const processAndSortTasks = (tasks) => {
    // Filtrar usando Temporal para asegurar consistencia con ListDays
    const today = Temporal.Now.plainDateISO().toString();

    const filtered = tasks.filter(
      (lunch) => lunch.date.split("T")[0] === today,
    );

    // Ordenar por Grado y luego por Nombre
    return filtered.sort((a, b) => {
      const gradeA = a.user?.grade?.toLowerCase() || "zzz";
      const gradeB = b.user?.grade?.toLowerCase() || "zzz";

      if (gradeA < gradeB) return -1;
      if (gradeA > gradeB) return 1;

      const nameA =
        a.user?.NameStudent?.toLowerCase() || a.nameClient?.toLowerCase() || "";
      const nameB =
        b.user?.NameStudent?.toLowerCase() || b.nameClient?.toLowerCase() || "";
      return nameA.localeCompare(nameB);
    });
  };

  const fetchTodayLunchs = async () => {
    try {
      const response = await getAllLunchs();
      if (response.data) {
        setTodayLunchs(processAndSortTasks(response.data));
      }
    } catch (error) {
      console.error("Error al obtener los almuerzos:", error);
    }
  };

  useEffect(() => {
    fetchTodayLunchs();

    // Configuración de Socket.io
    const socket = io(SOCKET_URL, {
      withCredentials: true,
    });

    socket.on("admin:updateTasks", (updatedTasks) => {
      console.log("Actualización recibida y re-ordenada por grado");
      setTodayLunchs(processAndSortTasks(updatedTasks));
    });

    // Formato de fecha para el encabezado de la tabla
    const todayFormatted = Temporal.Now.zonedDateTimeISO()
      .toLocaleString("es-ES", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      .replace(/\s/g, "-")
      .toLowerCase();
    setdayToday(todayFormatted);

    return () => {
      socket.off("admin:updateTasks");
      socket.disconnect();
    };
  }, []);

  const onSubmitPending = async (formattedData) => {
    try {
      await CreateLunchAdmin(formattedData);
      setSubmitted(true);
      loadLunchs();
      setTimeout(() => setSubmitted(false), 1500);
    } catch (error) {
      console.error(error);
      alert("Error al crear el pedido");
      setSubmitted(false);
    }
  };

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Pedidos del Día");
    const hasGrade = todayLunchs.some((lunch) => lunch.user?.grade);

    worksheet.columns = [
      { header: "#", key: "index", width: 5 },
      ...(hasGrade ? [{ header: "Grado", key: "grade", width: 15 }] : []),
      { header: "Nombre del Estudiante", key: "name", width: 30 },
      { header: DayToday, key: "needs", width: 30 },
    ];

    todayLunchs.forEach((lunch, index) => {
      worksheet.addRow({
        index: index + 1,
        ...(hasGrade && { grade: lunch.user?.grade || "N/A" }),
        name: lunch.user?.NameStudent || lunch.nameClient,
        needs: [
          lunch.userneedscomplete && "C",
          lunch.userneedstray && "B",
          lunch.onlysoup && "S",
          lunch.userneedsextrajuice && "J",
          lunch.portionOfProtein && "P",
          lunch.portionOfSalad && "E",
          lunch.teacher && "P",
        ]
          .filter(Boolean)
          .join(", "),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Pedidos_Hoy_${DayToday}.xlsx`;
    link.click();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Pedidos del Día - Ordenados por Grado`, 14, 10);
    const rows = todayLunchs.map((lunch, index) => [
      index + 1,
      lunch.user?.grade
        ? `(${lunch.user.grade}) ${lunch.user.NameStudent}`
        : lunch.nameClient,
      [
        lunch.userneedscomplete && "C",
        lunch.userneedstray && "B",
        lunch.EspecialStray && "BE",
        lunch.userneedsextrajuice && "J",
        lunch.portionOfProtein && "P",
        lunch.portionOfSalad && "PE",
        lunch.onlysoup && "S",
        lunch.teacher && "P",
      ]
        .filter(Boolean)
        .join(", "),
    ]);

    autoTable(doc, {
      head: [["#", "Grado y Nombre", DayToday]],
      body: rows,
      startY: 20,
      styles: { fontSize: 10, halign: "center", lineWidth: 0.01 },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
    });

    setPdfUrl(doc.output("datauristring"));
  };

  const handlePrint = () => {
    const printContent = tableRef.current;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Pedidos Hoy</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: center; font-family: sans-serif; }
            th { background-color: #f3f3f3; }
            h2 { text-align: center; font-family: sans-serif; }
          </style>
        </head>
        <body>
          <h2>Pedidos del Día (Real-time) - ${DayToday}</h2>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (todayLunchs.length === 0) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center w-full flex-col gap-4 border-2 border-dashed rounded-2xl bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-500">
          NO HAY PEDIDOS PARA HOY
        </h1>
        <Modal
          className="px-6 py-3 flex bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          text="Añadir primer pedido"
          onSubmit={onSubmitPending}
          submitted={submitted}
        >
          <CirclePlus className="mr-2" />
          Añadir pedido
        </Modal>
      </div>
    );
  }

  return (
    <div className="w-full p-8">
      <Suspense fallback={<Loader />}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Control Real-time (Hoy)
          </h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Sincronizado
          </span>
        </div>

        <div
          ref={tableRef}
          className="bg-white rounded-lg border overflow-hidden shadow-sm"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-16">#</TableHead>
                <TableHead>Grado - Estudiante / Cliente</TableHead>
                <TableHead className="text-center uppercase font-bold">
                  {DayToday}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayLunchs.map((lunch, index) => (
                <TableRow key={lunch._id || index}>
                  <TableCell className="font-medium text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    {lunch.user?.grade ? (
                      <span className="flex gap-2">
                        <strong className="text-orange-600 w-12">
                          {lunch.user.grade}
                        </strong>
                        | {lunch.user.NameStudent}
                      </span>
                    ) : (
                      <span className="italic">| {lunch.nameClient}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-bold text-blue-700">
                    {[
                      lunch.userneedscomplete && "C",
                      lunch.userneedstray && "B",
                      lunch.EspecialStray && "BE",
                      lunch.userneedsextrajuice && "J",
                      lunch.portionOfProtein && "P",
                      lunch.portionOfSalad && "PE",
                      lunch.onlysoup && "S",
                      lunch.teacher && "P",
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          <Button
            onClick={downloadExcel}
            className="flex-1 bg-[#008000] text-white hover:scale-105 transition-transform"
          >
            <DownloadIcon className="mr-2 h-4 w-4" /> Excel
          </Button>
          <Button
            onClick={generatePDF}
            className="flex-1 bg-[#dc2626] text-white hover:scale-105 transition-transform"
          >
            <EyeIcon className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button
            onClick={handlePrint}
            className="flex-1 bg-blue-600 text-white hover:scale-105 transition-transform"
          >
            <PrintIcon className="mr-2 h-4 w-4" /> Imprimir
          </Button>
          <Modal
            className="flex-1 bg-orange-600 text-white rounded-md flex items-center justify-center py-2 hover:scale-105 transition-transform"
            text="Añadir pedido"
            onSubmit={onSubmitPending}
            submitted={submitted}
          >
            <CirclePlus className="mr-2 h-4 w-4" /> Añadir Pedido
          </Modal>
        </div>

        {pdfUrl && (
          <div className="mt-8 p-4 bg-slate-800 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold">Vista Previa PDF</h3>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setPdfUrl(null)}
              >
                Cerrar
              </Button>
            </div>
            <iframe
              src={pdfUrl}
              width="100%"
              height="500px"
              title="Vista Previa"
              className="rounded bg-white"
            ></iframe>
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default ListDayWebSockets;
