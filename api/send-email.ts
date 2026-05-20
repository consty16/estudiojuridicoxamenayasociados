import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Método no permitido" });
  }

  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ success: false, error: "Faltan campos obligatorios" });
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const EMAIL_SENDER = process.env.EMAIL_SENDER || "xamenasantiago@hotmail.com";
  const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER || "xamenasantiago@hotmail.com";

  if (!BREVO_API_KEY) {
    return res.status(500).json({ success: false, error: "Error de configuración en el servidor" });
  }

  try {
    const [studioResponse, clientResponse] = await Promise.all([
      axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: { name: "Xamena y Asociados", email: EMAIL_SENDER },
          to: [{ email: EMAIL_RECEIVER }],
          subject: "Nueva consulta desde la web",
          htmlContent: `
            <div style="font-family: sans-serif; padding: 30px; color: #333; background-color: #f9f9f9; border-radius: 8px;">
              <h2 style="color: #1B3A7A; border-bottom: 2px solid #C9A43B; padding-bottom: 10px;">Nueva consulta recibida</h2>
              <p style="font-size: 16px;"><strong>Nombre:</strong> ${nombre}</p>
              <p style="font-size: 16px;"><strong>Email:</strong> ${email}</p>
              <div style="margin-top: 25px; padding: 20px; background: #ffffff; border-left: 5px solid #C9A43B; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <p style="font-style: italic; color: #555; margin: 0;">"${mensaje}"</p>
              </div>
              <p style="margin-top: 30px; font-size: 12px; color: #888;">Enviado desde el formulario de contacto de Xamena & Asociados.</p>
            </div>
          `,
        },
        { headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" } }
      ),
      axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: { name: "Xamena y Asociados", email: EMAIL_SENDER },
          to: [{ email: email }],
          subject: "Hemos recibido su consulta | Xamena & Asociados",
          htmlContent: `
            <div style="font-family: sans-serif; padding: 30px; color: #333; line-height: 1.6;">
              <h2 style="color: #1B3A7A; border-bottom: 2px solid #C9A43B; padding-bottom: 10px;">Estimado/a ${nombre},</h2>
              <p>Hemos recibido su consulta y ya está siendo procesada por nuestro equipo legal.</p>
              <p>Un profesional se pondrá en contacto con usted a la brevedad.</p>
              <div style="margin-top: 30px; padding: 20px; background: #F6F3EC; border: 1px solid #d8d4c8; border-radius: 4px;">
                <h4 style="margin-top: 0; color: #1B3A7A; font-size: 16px;">Xamena & Asociados · Estudio Jurídico</h4>
                <p style="margin: 5px 0; font-size: 14px; color: #555;">📍 Entre ríos 489 – Planta baja, Oficina 2, S.M. de Tucumán</p>
                <p style="margin: 5px 0; font-size: 14px; color: #555;">📞 3815350413</p>
                <p style="margin: 5px 0; font-size: 14px; color: #555;">✉️ xamenasantiago@hotmail.com</p>
              </div>
              <p style="margin-top: 30px; font-size: 12px; color: #888;">Este es un mensaje automático, por favor no responda a este correo.</p>
            </div>
          `,
        },
        { headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" } }
      ),
    ]);

    const ok = [200, 201].includes(studioResponse.status) && [200, 201].includes(clientResponse.status);
    return ok
      ? res.json({ success: true })
      : res.status(500).json({ success: false, error: "Uno o ambos correos no pudieron enviarse" });
  } catch (error: any) {
    const errorData = error.response?.data || error.message;
    console.error("Error Brevo:", JSON.stringify(errorData, null, 2));
    return res.status(500).json({ success: false, error: "Error al procesar el envío", details: errorData });
  }
}
