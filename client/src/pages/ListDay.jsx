import React, { useEffect, useState } from "react";
import { useLunch } from "../context/LunchContext";

const ListDay = () => {
  const { getAllLunchs } = useLunch();
  const [todayLunchs, setTodayLunchs] = useState([]);

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

    fetchTodayLunchs();
  }, []);

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
              Nombre del Estudiante
            </th>
            <th className="border border-gray-300 px-4 py-2">
              Detalles del Pedido
            </th>
          </tr>
        </thead>
        <tbody>
          {todayLunchs.map((lunch) => (
            <tr key={lunch._id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">
                {lunch.user.NameStudent}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {lunch.userneedscomplete && "Almuerzo completo, "}
                {lunch.userneedstray && "Bandeja, "}
                {lunch.userneedsextrajuice && "Jugo extra, "}
                {lunch.portionOfProtein && "Porción de Proteína, "}
                {lunch.portionOfSalad && "Porción de Ensalada"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListDay;
