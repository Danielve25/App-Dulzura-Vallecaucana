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
  const [DayToday, setdayToday] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    Temporal.Now.plainDateISO().toString(),
  );

  const tableRef = useRef();

  const fetchLunchsByDate = async (dateToFilter) => {
    try {
      const response = await getAllLunchs();

      // 1. Filtrar por fecha
      const filtered = response.data.filter(
        (lunch) => lunch.date.split("T")[0] === dateToFilter,
      );

      // 2. ORDENAR POR GRADO
      // Compara el campo 'grade' dentro del objeto 'user'.
      // Los que no tienen grado (nameClient) se envían al final.
      const sortedLunchs = filtered.sort((a, b) => {
        const gradeA = a.user?.grade?.toLowerCase() || "zzz";
        const gradeB = b.user?.grade?.toLowerCase() || "zzz";

        if (gradeA < gradeB) return -1;
        if (gradeA > gradeB) return 1;

        // Si el grado es el mismo, ordenar por nombre de estudiante
        const nameA =
          a.user?.NameStudent?.toLowerCase() ||
          a.nameClient?.toLowerCase() ||
          "";
        const nameB =
          b.user?.NameStudent?.toLowerCase() ||
          b.nameClient?.toLowerCase() ||
          "";
        return nameA.localeCompare(nameB);
      });

      setTodayLunchs(sortedLunchs);

      const formatted = Temporal.PlainDate.from(dateToFilter)
        .toLocaleString("es-ES", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .replace(/\s/g, "-")
        .toLowerCase();
      setdayToday(formatted);
    } catch (error) {
      console.error("Error al obtener los almuerzos:", error);
    }
  };

  useEffect(() => {
    fetchLunchsByDate(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const onSubmitPending = async (formattedData) => {
    try {
      await CreateLunchAdmin(formattedData);
      setSubmitted(true);
      await fetchLunchsByDate(selectedDate);
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
    const worksheet = workbook.addWorksheet("Pedidos");
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
    link.download = `Pedidos_${selectedDate}.xlsx`;
    link.click();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Pedidos ordenados por grado - ${selectedDate}`, 14, 10);

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
      styles: { fontSize: 10, halign: "center" },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.1,
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
          <title>Imprimir Pedidos ${selectedDate}</title>
          <style>
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: center; font-family: sans-serif; }
            th { background-color: #f3f3f3; }
            h2 { font-family: sans-serif; text-align: center; }
          </style>
        </head>
        <body>
          <h2>Pedidos del Día (Ordenados por Grado): ${selectedDate}</h2>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="w-full p-8">
      <Suspense fallback={<Loader />}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border">
          <h2 className="text-2xl font-bold text-gray-800">
            Control de Almuerzos
          </h2>
          <div className="flex items-center gap-3">
            <label
              htmlFor="date-filter"
              className="text-sm font-semibold text-gray-600"
            >
              Ver fecha:
            </label>
            <input
              type="date"
              id="date-filter"
              value={selectedDate}
              onChange={handleDateChange}
              className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
        </div>

        {todayLunchs.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center w-full flex-col gap-4 border-2 border-dashed rounded-2xl bg-gray-50">
            <p className="text-xl font-medium text-gray-500">
              No hay pedidos para esta fecha
            </p>
            <Modal
              className="px-6 py-3 flex bg-orange-600 text-white rounded-lg"
              text="Añadir pedido"
              onSubmit={onSubmitPending}
              submitted={submitted}
            >
              <CirclePlus className="mr-2" />
              Añadir pedido
            </Modal>
          </div>
        ) : (
          <>
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
                          <span className="italic">|{lunch.nameClient}</span>
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
                          lunch.teacher && "T",
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
                className="flex-1 bg-[#008000] text-white"
              >
                <DownloadIcon className="mr-2 h-4 w-4" /> Excel
              </Button>
              <Button
                onClick={generatePDF}
                className="flex-1 bg-[#dc2626] text-white"
              >
                <EyeIcon className="mr-2 h-4 w-4" /> PDF
              </Button>
              <Button
                onClick={handlePrint}
                className="flex-1 bg-blue-600 text-white"
              >
                <PrintIcon className="mr-2 h-4 w-4" /> Imprimir
              </Button>
              <Modal
                className="flex-1 bg-orange-600 text-white rounded-md flex items-center justify-center py-2"
                text="Añadir pedido"
                onSubmit={onSubmitPending}
                submitted={submitted}
              >
                <CirclePlus className="mr-2 h-4 w-4" /> Añadir Pedido
              </Modal>
            </div>
          </>
        )}

        {pdfUrl && (
          <div className="mt-8 p-4 bg-slate-800 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold">
                Vista Previa (Ordenado por Grado)
              </h3>
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
              height="600px"
              className="rounded bg-white"
              title="Preview"
            ></iframe>
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default ListDay;
