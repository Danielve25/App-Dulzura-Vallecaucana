import React, { useState, useEffect } from "react";
import { getMenu } from "../api/menu";

const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await getMenu();

        const validMenus = res.data.filter((item) => isValidDate(item.date));
        const mostRecentMenu = validMenus.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        )[0];

        setMenu(mostRecentMenu ? [mostRecentMenu] : []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al obtener el menú:", error.message);
        setMenu([]);
      }
    };
    fetchMenu();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (menu.length === 0) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center w-full">
        <h1 className="text-2xl font-bold">NO HAY MENÚ DISPONIBLE</h1>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div
          className="bg-[#E9E9E9] p-5 rounded-md outline-1 outline-black justify-self-center max-w-[400px]"
          key={menu[0].id}
        >
          <h1 className="text-2xl font-bold">Menú del Día</h1>
          <h2 className="text-lg">
            Menú Del Día - {new Date(menu[0].date).toLocaleDateString()}
          </h2>
          descripcion del almuerzo
          <p>{menu[0].Descripcion}</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;
