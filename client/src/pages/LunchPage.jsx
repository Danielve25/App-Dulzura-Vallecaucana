import { useEffect } from "react";
import { useLunch } from "../context/LunchContext";
import LunchImage from "../components/icos/LunchImage";

const LunchPage = () => {
  const { getLunchs, lunchs } = useLunch();

  useEffect(() => {
    getLunchs();
  }, []); // Asegurarse de que el array de dependencias esté vacío para que solo se ejecute una vez

  if (lunchs.length === 0) return <h1> NO TIENES PEDIDOS</h1>;

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {lunchs.map((lunch) => (
          <div key={lunch._id} className="p-4 border rounded-lg shadow-md">
            <h1 className="text-xl font-bold">{lunch.title}</h1>
            <p className="text-gray-600">
              {new Date(lunch.date).toLocaleDateString()}
            </p>
            <p className="mt-2">{lunch.description}</p>
            {lunch.userneedscomplete && (
              <p className="mt-2">
                <strong>Almuerzo completo:</strong> Sí
              </p>
            )}
            {lunch.userneedstray && (
              <p>
                <strong>Bandeja:</strong> Sí
              </p>
            )}
            {lunch.userneedsextrajuice && (
              <p>
                <strong>Jugo extra:</strong> Sí
              </p>
            )}
            {lunch.portionOfProtein && (
              <p>
                <strong>Porción de Proteína:</strong> Sí
              </p>
            )}
            {lunch.portionOfSalad && (
              <p>
                <strong>Porción de Ensalada:</strong> Sí
              </p>
            )}
            <p className="mt-2">
              <strong>Pago:</strong> {lunch.pay ? "Sí" : "No"}
            </p>
            <p>
              <strong>total a pagar:</strong> {lunch.userNeedsPay}
            </p>
            <small className="text-gray-500">
              Actualizado: {new Date(lunch.updatedAt).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LunchPage;
