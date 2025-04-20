import { Image } from "@unpic/react";
import logo from "../../assets/img/logo-Dulzura.webp";

const Logo = () => {
  return (
    <Image
      className="logoPage mx-5 h-13 aspect-[222/125]"
      src={logo}
      layout="fixed"
      alt="Descripción de la imagen"
    />
  );
};

export default Logo;
