import React, { useEffect, useState } from "react";
import { useLunch } from "../context/LunchContext";
import * as XLSX from "xlsx";
import { Temporal } from "temporal-polyfill";

const ListDay = () => {
  const { getAllLunchs } = useLunch();
  const [todayLunchs, setTodayLunchs] = useState([]);

  useEffect(() => {
    const fetchTodayLunchs = async () => {
      try {
        const response = await getAllLunchs();
        const today = Temporal.Now.plainDateISO(); // Obtén la fecha actual como Temporal.PlainDate
        const filteredLunchs = response.data.filter((lunch) => {
          const lunchDate = Temporal.PlainDate.from(lunch.date.split("T")[0]); // Convierte la fecha del almuerzo
          return lunchDate.equals(today); // Compara solo día, mes y año
        });
        setTodayLunchs(filteredLunchs);
      } catch (error) {
        console.error("Error al obtener los almuerzos del día:", error);
      }
    };

    fetchTodayLunchs();
  }, [getAllLunchs]); // Agregado getAllLunchs como dependencia

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

      <table className="w-full border-collapse border border-gray-300">
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
              <td className="border border-gray-300 px-4 py-2 ">
                {lunch.user.NameStudent}
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
    </div>
  );
};

export default ListDay;
