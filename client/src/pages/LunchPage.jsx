import { useEffect } from "react";
import { useLunch } from "../context/LunchContext";
import LunchImage from "../components/icos/LunchImage";
const LunchPage = () => {
  const { getLunchs, lunchs } = useLunch();

  useEffect(() => {
    getLunchs();
  }, []);

  if (lunchs.length === 0) return <h1> NO TIENES PEDIDOS</h1>;

  return (
    <div>
      {lunchs.map((lunch) => (
        <div key={lunch._id}>
          {/*<LunchImage />*/}
          <h1>{lunch.title}</h1>
          <p>{lunch.description}</p>
          <small>{lunch.date}</small>
        </div>
      ))}
    </div>
  );
};

export default LunchPage;
