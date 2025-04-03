import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import React from "react";
import Label from "../components/Label";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      NameStudent: "", // Valor inicial para evitar errores con `undefined`
      PhoneNumber: "",
    },
  });

  const navigator = useNavigation(); // Mover aquí la llamada a useNavigation

  const { signin, errors: signinErrors } = useAuth();

  const onSubmit = (data) => {
    const formattedData = {
      NameStudent: data.NameStudent.toUpperCase(),
      PhoneNumber: data.PhoneNumber,
    };
    signin(formattedData);
  };
  return (
    <View className="flex-1 justify-center items-center p-5 bg-white">
      <View className="w-full">
        {signinErrors.length > 0 && (
          <View className="mb-4 bg-red-500 flex justify-center items-center h-16">
            {signinErrors.map((error, i) => (
              <Text key={i} className="text-white text-lg text-center">
                {error}
              </Text>
            ))}
          </View>
        )}

        <Text className="text-2xl font-bold mb-3">Iniciar Sesion</Text>
        <Controller
          control={control}
          name="NameStudent" // Asegúrate de que el nombre coincida con el valor inicial
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <View>
              <Label text="Nombre del Estudiante" required />
              <TextInput
                className="border-[2px] mt-3 mb-7 h-16 w-full text-[16px] px-3 bg-slate-100 rounded-2xl p-2"
                placeholder="Nombre del estudiante"
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
        />
        <View className="">
          <Controller
            control={control}
            name="PhoneNumber"
            rules={{
              required: true,
              minLength: 10,
              maxLength: 10,
              pattern: /^[0-9]+$/,
            }}
            render={({ field: { onChange, value } }) => (
              <View>
                <Label text="Número de Teléfono" required />
                <TextInput
                  className="border-[2px] h-16 w-full mt-3 px-3 text-[16px] bg-slate-100 rounded-2xl p-2"
                  placeholder="Número de teléfono"
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />
          {errors.PhoneNumber && (
            <Text className="text-red-500 text-lg">
              {errors.PhoneNumber.type === "pattern"
                ? "El número de teléfono solo debe contener dígitos"
                : "El número de teléfono es requerido y debe tener 10 dígitos"}
            </Text>
          )}
        </View>
        <TouchableOpacity
          className="bg-[#008000] w-full h-16 rounded-2xl justify-center items-center my-7"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-white text-lg font-bold">Iniciar Sesion</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigator.navigate("Register")}>
          <Text className="text-sky-500 text-center text-[16px]">
            ¿No Tienes Una Cuenta? Registrarse
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
