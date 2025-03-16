import React from "react";
import { Image } from "@unpic/react";
import selloImage from "../../assets/img/cancelado-image.png";

const SelloImagen = () => {
  return (
    <Image
      src={selloImage}
      className="absolute filter-green rotate-[-38deg] aspect-[13/7] opacity-30 top-[50%] left-[50%] transform -translate-x-2/4 -translate-y-2/4 z-10" // Ajusta `top` para bajar la imagen
      width={250}
      layout="fixed"
      alt="Descripción de la imagen"
    />
  );
};

export default SelloImagen;
