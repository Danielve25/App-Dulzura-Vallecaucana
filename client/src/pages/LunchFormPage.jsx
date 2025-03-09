import { useForm } from "react-hook-form";
import { useLunch } from "../context/LunchContext";

const LunchFormPage = () => {
  const { register, handleSubmit } = useForm();
  const { createLunch } = useLunch();

  const onSubmit = handleSubmit((data) => {
    createLunch(data);
  });

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center w-full">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
        <h1 className="text-2xl font-bold">Pedir Almuerzo</h1>
        <form onSubmit={onSubmit}>
          <div className="my-3">
            <label className="label" htmlFor="tittle">
              titulo
            </label>
            <input
              id="tittle"
              type="text"
              placeholder="Titulo"
              {...register("title")}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
              autoFocus
            />
          </div>
          <div className="my-3">
            <label className="label" htmlFor="descripcion">
              descripcion
            </label>
            <textarea
              id="descripcion"
              rows="3"
              placeholder="descripcion"
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
              {...register("description")}
            />
          </div>

          <button className="cursor-pointer w-full bg-green-500 font-bold p-2 rounded-2xl">
            pedir
          </button>
        </form>
      </div>
    </div>
  );
};

export default LunchFormPage;
