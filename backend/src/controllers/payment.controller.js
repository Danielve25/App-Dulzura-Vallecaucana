import axios from "axios";
import crypto from "crypto";
import User from "../models/user.model.js";
import { EnvConfig } from "../config.js";
import { Temporal } from "temporal-polyfill";
import { v4 as uuidv4 } from "uuid"; // Importar la librería para generar UUID
import jwt from "jsonwebtoken"; // Importar jwt para decodificar la cookie

const configPayU = EnvConfig();

const api_url = configPayU.payUapiUrl;

const dateGenrated = Temporal.Now.zonedDateTimeISO()
  .toPlainDateTime()
  .toString();

export const NequiPayment = async (req, res) => {
  const { phoneNumber, payAmount, payerName, CCnumber } = req.body;

  try {
    // Obtener el token JWT de las cookies
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "No se proporcionó un token de autenticación" });
    }

    // Decodificar el token para obtener el ID del usuario
    const decoded = jwt.verify(token, configPayU.TOKEN_SECRET); // Usar la clave secreta correcta
    const userId = decoded.id;

    const apiKey = configPayU.payUapiKey;
    const merchantId = configPayU.payUmerchatId;
    const referenceCode = `PRODUCT_TEST_${dateGenrated}`;
    const txValue = payAmount;
    const currency = "COP";

    const formattedValue = parseFloat(txValue).toFixed(2);
    const signatureString = `${apiKey}~${merchantId}~${referenceCode}~${formattedValue}~${currency}`;
    const signatureGenrated = crypto
      .createHash("md5")
      .update(signatureString)
      .digest("hex");

    const jsonNequi = {
      language: "es",
      command: "SUBMIT_TRANSACTION",
      merchant: {
        apiKey: configPayU.payUapiKey,
        apiLogin: configPayU.payUapiLogin,
      },
      transaction: {
        order: {
          accountId: configPayU.payUaccountId,
          referenceCode: `PRODUCT_TEST_${dateGenrated}`,
          description: "Payment test description",
          language: "es",
          signature: signatureGenrated,
          notifyUrl: "http://www.payu.com/notify",
          additionalValues: {
            TX_VALUE: {
              value: payAmount,
              currency: "COP",
            },
          },
          buyer: {
            merchantBuyerId: userId, // Usar el ID del usuario desde el token JWT
            fullName: payerName,
            emailAddress: "",
            contactPhone: phoneNumber,
            dniNumber: CCnumber,
          },
        },
        payer: {
          merchantPayerId: userId, // Usar el ID del usuario desde el token JWT
          fullName: payerName,
          emailAddress: "",
          contactPhone: phoneNumber,
          dniNumber: CCnumber,
        },
        type: "AUTHORIZATION_AND_CAPTURE",
        paymentMethod: "NEQUI",
        paymentCountry: "CO",
        deviceSessionId: uuidv4(), // Generar un ID único para cada sesión
        ipAddress: "127.0.0.1",
        cookie: "pt1t38347bs6jc9ruv2ecpv7o2",
        userAgent:
          "Mozilla/5.0 (Windows NT 5.1; rv:18.0) Gecko/20100101 Firefox/18.0",
      },
      test: true,
    };

    console.log("Objeto enviado:");
    console.dir(jsonNequi, { depth: null, colors: true });

    const response = await axios.post(api_url, jsonNequi, {
      headers: {
        Accept: "application/json",
      },
    });
    console.log("axios response: ");
    console.dir(response.data, { depth: null, colors: true });
    res.send(response.data); // Enviar solo los datos relevantes de la respuesta
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
