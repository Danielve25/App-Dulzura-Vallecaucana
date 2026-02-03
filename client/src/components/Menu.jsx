import React, { useState, useEffect } from "react";
import { getMenu } from "../api/menu";
import Loader from "@/components/icos/Loader";

const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

const Menu = () => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await getMenu();

        const menus = res.data
          .filter((item) => isValidDate(item.date))
          .filter((item) => new Date(item.date) >= hoy)
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setMenu(menus);
      } catch (error) {
        console.error("Error al obtener el menú:", error.message);
        setMenu([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (isLoading) return <Loader />;

  if (menu.length === 0) {
    return (
      <section className="flex h-[30vh] items-center justify-center w-full">
        <h1 className="text-2xl font-bold">NO HAY MENÚ DISPONIBLE</h1>
      </section>
    );
  }

  return (
    <section className="flex flex-wrap justify-center items-center gap-4 w-full mb-4 m-3">
      {menu.map((item) => (
        <article
          key={item._id}
          className="bg-[#E9E9E9] p-5 rounded-md outline-1 outline-black max-w-100 "
        >
          <h1 className="text-2xl font-bold">Menú del Día</h1>
          <h2 className="text-lg">
            {new Date(item.date).toISOString().split("T")[0]}
          </h2>
          <p className="mt-2">Descripción del almuerzo:</p>
          <p>{item.Descripcion}</p>
        </article>
      ))}
    </section>
  );
};

export default Menu;
