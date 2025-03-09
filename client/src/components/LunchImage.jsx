import React from "react";
import { Image } from "@unpic/react";
import lunchImage from "../assets/img/lunch.png";

const LunchImage = () => {
  return (
    <Image
      src={lunchImage}
      layout="intrinsic"
      width={300}
      height={200}
      alt="Descripción de la imagen"
    />
  );
};

export default LunchImage;
