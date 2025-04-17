import React, { useEffect, useState, lazy } from "react";
import { useLunch } from "../context/LunchContext";
import { Temporal } from "temporal-polyfill";
import * as XLSX from "xlsx"; // Importar la biblioteca xlsx

const DownloadIcon = lazy(() => import("../components/icos/Download"));

const ListDay = () => {
  const { getAllLunchs } = useLunch();
  const [todayLunchs, setTodayLunchs] = useState([]);
  const [DayToday, setdayToday] = useState(null);

  useEffect(() => {
    const fetchTodayLunchs = async () => {
      try {
        const response = await getAllLunchs();
        const today = new Date().toISOString().split("T")[0]; // Obtener la fecha actual en formato YYYY-MM-DD
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
      .toLowerCase(); // Formato: "ene-16-2023"
    setdayToday(todayFormatted);

    fetchTodayLunchs();
  }, []);

  const downloadExcel = () => {
    const data = todayLunchs.map((lunch, index) => ({
      "#": index + 1,
      "Nombre del Estudiante": lunch.user.NameStudent,
      [DayToday]: [
        lunch.userneedscomplete && "C, ",
        lunch.userneedstray && "B, ",
        lunch.EspecialStray && "BE",
        lunch.userneedsextrajuice && "J, ",
        lunch.portionOfProtein && "P, ",
        lunch.portionOfSalad && "PE",
      ]
        .filter(Boolean)
        .join(", "), // Usar la fecha formateada como encabezado de columna
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos del Día");

    XLSX.writeFile(workbook, `Pedidos_${DayToday}.xlsx`);
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
      <h2 className="text-2xl font-bold mb-4">Pedidos del Día</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">
              Nombre del Estudiante
            </th>
            <th className="border border-gray-300 px-4 py-2">{DayToday}</th>
          </tr>
        </thead>
        <tbody>
          {todayLunchs.map((lunch, index) => (
            <tr key={lunch._id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">
                {lunch.user.NameStudent}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {lunch.userneedscomplete && "C, "}
                {lunch.userneedstray && "B, "}
                {lunch.EspecialStray && "BE"}
                {lunch.userneedsextrajuice && "J, "}
                {lunch.portionOfProtein && "P, "}
                {lunch.portionOfSalad && "PE"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={downloadExcel}
        className="my-4 px-4 py-2 flex bg-[#008000] text-white rounded hover:scale-110 transition-all"
      >
        <DownloadIcon className="mr-1" />
        Descargar Excel
      </button>
    </div>
  );
};

export default ListDay;
