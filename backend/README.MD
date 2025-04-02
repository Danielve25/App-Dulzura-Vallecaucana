# Configuración del Backend

## Variables de Entorno (.env)

Crear archivo `.env` con las siguientes variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost/your-database
SECRET_KEY=your-secret-key

# Configuración Twilio
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_NUMBER=your-twilio-number

# Configuración PayU
PAYU_MERCHAT_ID=your-merchant-id
PAYU_API_LOGIN=your-api-login
PAYU_ACCOUNT_ID=your-account-id
PAYU_API_KEY=your-api-key
PAYU_API_URL=your-api-url
```

## Estructura del Proyecto
```
src/
  ├── controllers/     # Controladores de la aplicación
  ├── middlewares/    # Middlewares personalizados
  ├── models/         # Modelos de MongoDB
  ├── routes/         # Rutas de la API
  ├── schemas/        # Esquemas de validación
  ├── app.js         # Configuración de Express
  └── config.js      # Configuración de variables de entorno
```
