import React, { useState, useEffect } from "react";
import { getMenu } from "../api/menu";

const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

const Menu = () => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await getMenu();
        const today = new Date().toISOString().split("T")[0];

        const todayMenu = res.data.filter((item) => {
          if (!isValidDate(item.date)) return false;
          const menuDate = new Date(item.date).toISOString().split("T")[0];
          return menuDate === today;
        });

        setMenu(todayMenu);
      } catch (error) {
        console.error("Error al obtener el menú:", error.message);
        setMenu([]);
      }
    };
    fetchMenu();
  }, []);

  return menu.length > 0 ? (
    <div>
      <div>
        {menu.map((item) => (
          <div
            className="bg-[#E9E9E9] w-fit p-5 rounded-md outline-1 outline-black justify-self-center"
            key={item.id}
          >
            <h1 className="text-2xl font-bold">Menú del Día</h1>
            <h2 className="text-lg">
              Menú Del Día - {new Date(item.date).toLocaleDateString()}
            </h2>
            descripcion del almuerzo
            <p>{item.Descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <p>No hay menú disponible para hoy</p>
  );
};

export default Menu;
