import React, { useEffect, useState, lazy, useRef, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useLunch } from "../context/LunchContext";
import { Temporal } from "temporal-polyfill";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Loader from "@/components/icos/Loader";
import ExcelJS from "exceljs"; // Importar ExcelJS
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Modal from "@/components/Modal";

const PrintIcon = lazy(() =>
  import("lucide-react").then((module) => ({ default: module.Printer }))
);

const DownloadIcon = lazy(() =>
  import("lucide-react").then((module) => ({ default: module.Download }))
);

const EyeIcon = lazy(() =>
  import("lucide-react").then((module) => ({ default: module.Eye }))
);
const CirclePlus = lazy(() =>
  import("lucide-react").then((module) => ({ default: module.CirclePlus }))
);

const ListDay = () => {
  const { getAllLunchs } = useLunch();
  const [todayLunchs, setTodayLunchs] = useState([]);
  const [DayToday, setdayToday] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const tableRef = useRef();

  useEffect(() => {
    const fetchTodayLunchs = async () => {
      try {
        const response = await getAllLunchs();
        const today = new Date().toISOString().split("T")[0];
        const filteredLunchs = response.data.filter(
          (lunch) => lunch.date.split("T")[0] === today
        );
        setTodayLunchs(filteredLunchs);
      } catch (error) {
        console.error("Error al obtener los almuerzos del día:", error);
      }
    };

    const todayFormatted = Temporal.Now.zonedDateTimeISO()
      .toLocaleString("es-ES", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      .replace(/\s/g, "-")
      .toLowerCase();
    setdayToday(todayFormatted);

    fetchTodayLunchs();
  }, []);

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Pedidos del Día");

    worksheet.columns = [
      { header: "#", key: "index", width: 5 },
      { header: "Grado", key: "grade", width: 15 },
      { header: "Nombre del Estudiante", key: "name", width: 30 },
      { header: DayToday, key: "needs", width: 30 },
    ];

    todayLunchs.forEach((lunch, index) => {
      worksheet.addRow({
        index: index + 1,
        name: ` ${lunch.user.grade} ${lunch.user.NameStudent}`,
        needs: [
          lunch.userneedscomplete && "C",
          lunch.userneedstray && "B",
          lunch.onlysoup && "S",
          lunch.userneedsextrajuice && "J",
          lunch.portionOfProtein && "P",
          lunch.portionOfSalad && "E",
          lunch.onlysoup && "S",
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
      `${lunch.user.grade} ${lunch.user.NameStudent}`,
      [
        lunch.userneedscomplete && "C, ",
        lunch.userneedstray && "B, ",
        lunch.EspecialStray && "BE",
        lunch.userneedsextrajuice && "J, ",
        lunch.portionOfProtein && "P, ",
        lunch.portionOfSalad && "PE",
        lunch.onlysoup && "S",
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

    const pdfOutput = doc.output("datauristring");

    setPdfUrl(pdfOutput);
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
      <div className="flex h-[calc(100vh-100px)] items-center justify-center w-full">
        <h1 className="text-2xl font-bold">NO HAY PEDIDOS PARA HOY</h1>
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
                <TableRow key={lunch._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {lunch.user.grade} {lunch.user.NameStudent}
                  </TableCell>
                  <TableCell>
                    {lunch.userneedscomplete && "C, "}
                    {lunch.userneedstray && "B, "}
                    {lunch.EspecialStray && "BE"}
                    {lunch.userneedsextrajuice && "J, "}
                    {lunch.portionOfProtein && "P, "}
                    {lunch.portionOfSalad && "PE"}
                    {lunch.onlysoup && "S"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col max-[442px]:flex-col min-[443px]:flex-row gap-4 mt-4 w-full">
          <Button
            onClick={downloadExcel}
            className="px-4 py-2 flex bg-[#008000] text-white rounded hover:scale-110 transition-all hover:bg-[#008000]!"
          >
            <DownloadIcon className="" />
            Descargar Excel
          </Button>

          <Button
            onClick={generatePDF}
            className="px-4 py-2 flex bg-[#dc2626] text-white rounded hover:scale-110 transition-all hover:bg-[#dc2626]!"
          >
            <EyeIcon className="" />
            Ver PDF
          </Button>

          <Button
            onClick={handlePrint}
            className="px-4 py-2 flex bg-blue-600 text-white rounded hover:scale-110 transition-all hover:bg-blue-700!"
          >
            <PrintIcon className="" />
            Imprimir Tabla
          </Button>
          <Modal
            className="px-4 py-2 flex bg-orange-600 text-white rounded hover:scale-110 transition-all hover:bg-orange-700!"
            text="Añadir pedido"
          >
            <CirclePlus className="" />
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
