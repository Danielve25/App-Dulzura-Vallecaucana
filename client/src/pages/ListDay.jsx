import React, { useEffect, useState } from "react";
import { useLunch } from "../context/LunchContext";
import * as XLSX from "xlsx";
import { Temporal } from "temporal-polyfill";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Estilos para el PDF
const pdfStyles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 20, marginBottom: 20, textAlign: "center" },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    margin: 0, // Eliminado el margen
    borderSpacing: 0, // Eliminado el gap entre celdas
  },
  row: { flexDirection: "row" },
  cellHeader: {
    width: "33.33%",
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "#eee",
    padding: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
  cell: {
    width: "33.33%",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 5,
    fontSize: 10,
  },
});

// Componente PDF
const PDFDocument = ({ todayLunchs }) => (
  <Document>
    <Page size="LETTER" style={pdfStyles.page}>
      <Text style={pdfStyles.title}>Pedidos del Día</Text>
      <View style={pdfStyles.table}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.cellHeader}>Número de Estudiante</Text>
          <Text style={pdfStyles.cellHeader}>Nombre del Estudiante</Text>
          <Text style={pdfStyles.cellHeader}>Detalles del Pedido</Text>
        </View>
        {todayLunchs.map((lunch, index) => (
          <View style={pdfStyles.row} key={lunch._id}>
            <Text style={pdfStyles.cell}>{index + 1}</Text>
            <Text style={pdfStyles.cell}>
              {lunch.user.grade} {lunch.user.NameStudent}
            </Text>
            <Text style={pdfStyles.cell}>
              {[
                lunch.userneedscomplete && "C",
                lunch.userneedstray && "B",
                lunch.userneedsextrajuice && "JJ",
                lunch.portionOfProtein && "PT",
                lunch.portionOfSalad && "E",
                lunch.EspecialStray && "BE",
              ]
                .filter(Boolean)
                .join(", ")}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

// Componente principal
const ListDay = () => {
  const { getAllLunchs } = useLunch();
  const [todayLunchs, setTodayLunchs] = useState([]);

  useEffect(() => {
    const fetchTodayLunchs = async () => {
      try {
        const response = await getAllLunchs();
        const today = Temporal.Now.plainDateISO();
        const filteredLunchs = response.data.filter((lunch) => {
          const lunchDate = Temporal.PlainDate.from(lunch.date.split("T")[0]);
          return lunchDate.equals(today);
        });
        setTodayLunchs(filteredLunchs);
      } catch (error) {
        console.error("Error al obtener los almuerzos del día:", error);
      }
    };

    fetchTodayLunchs();
  }, []);

  const downloadExcel = () => {
    const data = todayLunchs.map((lunch, index) => ({
      "Número de Estudiante": index + 1,
      "Nombre del Estudiante": lunch.user.NameStudent,
      "Detalles del Pedido": [
        lunch.userneedscomplete && "C",
        lunch.userneedstray && "B",
        lunch.userneedsextrajuice && "JJ",
        lunch.portionOfProtein && "PT",
        lunch.portionOfSalad && "E",
        lunch.EspecialStray && "BE",
      ]
        .filter(Boolean)
        .join(","),
    }));

    const dateNow = Temporal.Now.plainDateISO();
    const formattedDate = `${String(dateNow.day).padStart(2, "0")}-${String(
      dateNow.month
    ).padStart(2, "0")}-${dateNow.year}`;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos del Día");
    XLSX.writeFile(workbook, `pedidosDelDia_${formattedDate}.xlsx`);
  };

  if (todayLunchs.length === 0) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center w-full">
        <h1 className="text-2xl font-bold">NO HAY PEDIDOS PARA HOY</h1>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold mb-4">Pedidos del Día</h2>

      <table className="w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">
              Número de Estudiante
            </th>
            <th className="border border-gray-300 px-4 py-2">
              Nombre del Estudiante
            </th>
            <th className="border border-gray-300 px-4 py-2">
              Detalles del Pedido
            </th>
          </tr>
        </thead>
        <tbody>
          {todayLunchs.map((lunch, index) => (
            <tr key={lunch._id} className="text-center">
              <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                {index + 1}.
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {lunch.user.grade} {lunch.user.NameStudent}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {[
                  lunch.userneedscomplete && "C",
                  lunch.userneedstray && "B",
                  lunch.userneedsextrajuice && "JJ",
                  lunch.portionOfProtein && "PT",
                  lunch.portionOfSalad && "E",
                  lunch.EspecialStray && "BE",
                ]
                  .filter(Boolean)
                  .join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={downloadExcel}
        className="my-4 px-4 py-2 bg-[#008000] text-white rounded transition-transform duration-300 hover:scale-110"
      >
        Descargar como Excel
      </button>

      <h2 className="text-xl font-semibold mt-8 mb-2">Vista previa PDF:</h2>
      <div className="border h-[600px]">
        <PDFViewer width="100%" height="100%">
          <PDFDocument todayLunchs={todayLunchs} />
        </PDFViewer>
      </div>
    </div>
  );
};

export default ListDay;
