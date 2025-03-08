import { useForm } from "react-hook-form";
import { registerRequest } from "../api/auth";
function RegisterPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (values) => {
    const res = await registerRequest(values);
    console.log(res);
  });

  return (
    <div className="bg-zinc-800 max-w-md p-10 rounded-md">
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Name"
          {...register("NameStudent", { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Phone Number"
          {...register("PhoneNumber", {
            required: true,
            pattern: /^[0-9]*$/, // Solo permite números
          })}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/\D/g, ""); // Elimina caracteres no numéricos
          }}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-3"
        />

        <button className="cursor-pointer" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
export default RegisterPage;
