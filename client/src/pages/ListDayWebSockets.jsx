import React, { useEffect, useState, lazy, useRef, Suspense } from "react";
import io from "socket.io-client"; //
import { Button } from "@/components/ui/button";
import { useLunch } from "../context/LunchContext"; //
import { Temporal } from "temporal-polyfill"; //
import jsPDF from "jspdf"; //
import autoTable from "jspdf-autotable"; //
import Loader from "@/components/icos/Loader"; //
import ExcelJS from "exceljs"; //
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"; //
import Modal from "@/components/Modal"; //
import useLunchData from "@/hooks/useLunchData"; //

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

// URL de tu servidor (ajusta según tu configuración)
const SOCKET_URL = import.meta.env.VITE_API_URL;

const ListDayWebSockets = () => {
  const { getAllLunchs, CreateLunchAdmin } = useLunch(); //
  const { loadLunchs } = useLunchData(); //
  const [todayLunchs, setTodayLunchs] = useState([]); //
  const [DayToday, setdayToday] = useState(null); //
  const [pdfUrl, setPdfUrl] = useState(null); //
  const [submitted, setSubmitted] = useState(false); //
  const tableRef = useRef(); //

  // Función para filtrar solo los almuerzos de hoy
  const filterTodayTasks = (tasks) => {
    const today = new Date().toISOString().split("T")[0]; //
    return tasks.filter((lunch) => lunch.date.split("T")[0] === today);
  };

  const fetchTodayLunchs = async () => {
    try {
      const response = await getAllLunchs(); //
      if (response.data) {
        setTodayLunchs(filterTodayTasks(response.data)); //
      }
    } catch (error) {
      console.error("Error al obtener los almuerzos del día:", error);
    }
  };

  useEffect(() => {
    // 1. Carga inicial
    fetchTodayLunchs();

    // 2. Configuración de Socket.io
    const socket = io(SOCKET_URL, {
      withCredentials: true,
    });

    // Escuchar actualizaciones en tiempo real
    socket.on("admin:updateTasks", (updatedTasks) => {
      console.log("Actualización de tabla recibida vía Socket");
      setTodayLunchs(filterTodayTasks(updatedTasks));
    });

    // Formato de fecha para el encabezado
    const todayFormatted = Temporal.Now.zonedDateTimeISO()
      .toLocaleString("es-ES", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      .replace(/\s/g, "-")
      .toLowerCase();
    setdayToday(todayFormatted); //

    // Limpieza al desmontar
    return () => {
      socket.off("admin:updateTasks");
      socket.disconnect();
    };
  }, []);

  const onSubmitPending = async (formattedData) => {
    try {
      await CreateLunchAdmin(formattedData); //
      setSubmitted(true); //

      // El socket se encargará de actualizar la lista automáticamente
      // cuando el backend emita el cambio.

      loadLunchs(); //
      setTimeout(() => setSubmitted(false), 1500); //
    } catch (error) {
      console.error(error);
      alert("Error al crear el pedido pendiente");
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
        ...(hasGrade && { grade: lunch.user?.grade || "" }),
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
    link.download = `Pedidos_${DayToday}.xlsx`;
    link.click();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Pedidos del Día", 14, 10);
    const rows = todayLunchs.map((lunch, index) => [
      index + 1,
      lunch.user?.grade
        ? `${lunch.user.grade} ${lunch.user.NameStudent}`
        : lunch.user?.NameStudent || lunch.nameClient,
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
      head: [["#", "Nombre del Estudiante", DayToday]],
      body: rows,
      startY: 20,
      styles: {
        fontSize: 10,
        halign: "center",
        lineWidth: 0.01,
        lineColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        lineWidth: 0.5,
      },
      bodyStyles: { lineWidth: 0.5, lineColor: [0, 0, 0] },
      margin: { top: 30 },
    });

    setPdfUrl(doc.output("datauristring"));
  };

  const handlePrint = () => {
    const printContent = tableRef.current;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Pedidos</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
            th { background-color: #f3f3f3; }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (todayLunchs.length === 0) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center w-full flex-col gap-4">
        <h1 className="text-2xl font-bold">NO HAY PEDIDOS PARA HOY</h1>
        <Modal
          className="px-6 py-3 flex bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
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
        <h2 className="text-2xl font-bold mb-4">Pedidos del Día (Real-time)</h2>

        <div ref={tableRef}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Nombre del Estudiante</TableHead>
                <TableHead>{DayToday}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayLunchs.map((lunch, index) => (
                <TableRow key={lunch._id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {lunch.user?.grade
                      ? `${lunch.user.grade} ${lunch.user.NameStudent}`
                      : lunch.nameClient}
                  </TableCell>
                  <TableCell>
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

        <div className="flex flex-col min-[443px]:flex-row gap-4 mt-4 w-full">
          <Button
            onClick={downloadExcel}
            className="bg-[#008000] text-white hover:scale-105"
          >
            <DownloadIcon className="mr-2" /> Descargar Excel
          </Button>
          <Button
            onClick={generatePDF}
            className="bg-[#dc2626] text-white hover:scale-105"
          >
            <EyeIcon className="mr-2" /> Ver PDF
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-blue-600 text-white hover:scale-105"
          >
            <PrintIcon className="mr-2" /> Imprimir Tabla
          </Button>
          <Modal
            className="bg-orange-600 text-white hover:scale-105"
            text="Añadir pedido"
            onSubmit={onSubmitPending}
            submitted={submitted}
          >
            <CirclePlus className="mr-2" /> Añadir pedido
          </Modal>
        </div>

        {pdfUrl && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Vista Previa del PDF:</h3>
            <iframe
              src={pdfUrl}
              width="100%"
              height="500px"
              title="Vista Previa PDF"
            ></iframe>
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default ListDayWebSockets;
