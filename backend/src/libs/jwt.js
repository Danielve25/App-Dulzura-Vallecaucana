import { EnvConfig } from "../config.js";

const config = EnvConfig();

import jwt from "jsonwebtoken";
function CreateAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      config.TOKEN_SECRET,
      {
        expiresIn: "1d",
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}
export default CreateAccessToken;
