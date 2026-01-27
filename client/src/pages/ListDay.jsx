import React, { useEffect, useState, lazy, useRef, Suspense } from "react";
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

const ListDay = () => {
  const { getAllLunchs, CreateLunchAdmin } = useLunch();
  const { loadLunchs } = useLunchData();
  const [todayLunchs, setTodayLunchs] = useState([]);
  const [DayToday, setdayToday] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const tableRef = useRef();

  // 1. Definimos la función de carga/refetch fuera del useEffect
  const fetchTodayLunchs = async () => {
    try {
      const response = await getAllLunchs();
      const today = new Date().toISOString().split("T")[0];
      const filteredLunchs = response.data.filter(
        (lunch) => lunch.date.split("T")[0] === today,
      );
      setTodayLunchs(filteredLunchs);
    } catch (error) {
      console.error("Error al obtener los almuerzos del día:", error);
    }
  };

  // 2. Carga inicial de datos y formato de fecha
  useEffect(() => {
    fetchTodayLunchs();

    const todayFormatted = Temporal.Now.zonedDateTimeISO()
      .toLocaleString("es-ES", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      .replace(/\s/g, "-")
      .toLowerCase();
    setdayToday(todayFormatted);
  }, []);

  // 3. Función que se dispara al crear un pedido desde el Modal
  const onSubmitPending = async (formattedData) => {
    try {
      await CreateLunchAdmin(formattedData);
      setSubmitted(true);

      // Hacemos el REFECTH inmediato para actualizar la tabla
      await fetchTodayLunchs();

      // Opcional: Actualizar el hook global si es necesario
      loadLunchs();

      // Resetear el estado de envío para permitir nuevos pedidos
      setTimeout(() => setSubmitted(false), 1500);
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
        cellPadding: 1,
        halign: "center",
        valign: "middle",
        lineColor: [0, 0, 0],
        lineWidth: 0.01,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255],
      },
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
        <body>
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
        <h2 className="text-2xl font-bold mb-4">Pedidos del Día</h2>

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

        <div className="flex flex-col max-[442px]:flex-col min-[443px]:flex-row gap-4 mt-4 w-full">
          <Button
            onClick={downloadExcel}
            className="px-4 py-2 flex bg-[#008000] text-white rounded hover:scale-105 transition-all hover:bg-[#008000]!"
          >
            <DownloadIcon className="mr-2" />
            Descargar Excel
          </Button>

          <Button
            onClick={generatePDF}
            className="px-4 py-2 flex bg-[#dc2626] text-white rounded hover:scale-105 transition-all hover:bg-[#dc2626]!"
          >
            <EyeIcon className="mr-2" />
            Ver PDF
          </Button>

          <Button
            onClick={handlePrint}
            className="px-4 py-2 flex bg-blue-600 text-white rounded hover:scale-105 transition-all hover:bg-blue-700!"
          >
            <PrintIcon className="mr-2" />
            Imprimir Tabla
          </Button>

          <Modal
            className="px-4 py-2 flex bg-orange-600 text-white rounded hover:scale-105 transition-all hover:bg-orange-700!"
            text="Añadir pedido"
            onSubmit={onSubmitPending}
            submitted={submitted}
          >
            <CirclePlus className="mr-2" />
            Añadir pedido
          </Modal>
        </div>

        {pdfUrl && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Vista Previa del PDF:</h3>
            <iframe
              src={pdfUrl}
              width="100%"
              height="500px"
              style={{ border: "none" }}
              title="Vista Previa PDF"
            ></iframe>
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default ListDay;
