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

const generatePayUSignature = (
  apiKey,
  merchantId,
  referenceCode,
  txValue,
  currency
) => {
  const formattedValue = parseFloat(txValue).toFixed(2);
  const signatureString = `${apiKey}~${merchantId}~${referenceCode}~${formattedValue}~${currency}`;
  return crypto.createHash("md5").update(signatureString).digest("hex");
};

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

    const currency = "COP";
    const apiKey = configPayU.payUapiKey; // Obtener apiKey desde configPayU
    const merchantId = configPayU.payUmerchatId; // Obtener merchantId desde configPayU
    const referenceCode = `PRODUCT_TEST_${dateGenrated}`; // Generar referenceCode dinámicamente
    const txValue = payAmount; // Usar el valor de payAmount como txValue

    const signatureGenrated = generatePayUSignature(
      apiKey,
      merchantId,
      referenceCode,
      txValue,
      currency
    );

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
          referenceCode: referenceCode, // Usar referenceCode generado
          description: "Payment test description",
          language: "es",
          signature: signatureGenrated,
          notifyUrl: "http://www.payu.com/notify",
          additionalValues: {
            TX_VALUE: {
              value: txValue, // Usar txValue definido
              currency: currency,
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
export const verifyNequiPaymentLunch = async (req, res) => {
  const { orderId } = req.body;

  const jsonNequiVerify = {
    test: false,
    language: "en",
    command: "ORDER_DETAIL",
    merchant: {
      apiLogin: configPayU.payUapiLogin,
      apiKey: configPayU.payUapiKey,
    },
    details: {
      orderId: orderId,
    },
  };

  try {
    const response = await axios.post(
      "https://sandbox.api.payulatam.com/reports-api/4.0/service.cgi",
      jsonNequiVerify
    );
    res.send(response.data); // Enviar solo los datos relevantes de la respuesta
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno del servidor" }); // Agregar un mensaje de error consistente
  }
};
