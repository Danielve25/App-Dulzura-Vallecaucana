import { Image } from "@unpic/react";
import logo from "../../assets/img/logo-Dulzura.png";

const Logo = () => {
  return (
    <Image
      className="mx-5 h-13 aspect-[222/125]"
      src={logo}
      layout="intrinsic"
      alt="Descripción de la imagen"
    />
  );
};

export default Logo;
