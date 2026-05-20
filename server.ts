import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// Initialize Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for appointment booking
  app.post("/api/book-appointment", async (req, res) => {
    console.log("--- NUEVA SOLICITUD DE TURNO ---");
    console.log("BODY:", JSON.stringify(req.body, null, 2));

    const { 
      nombre, 
      apellido, 
      email, 
      telefono, 
      fecha, 
      hora, 
      area, 
      descripcion,
      tipo,
      precio
    } = req.body;

    if (!nombre || !email || !fecha || !hora) {
      return res.status(400).json({ success: false, error: "Faltan campos obligatorios para el turno" });
    }

    try {
      // 1. Verificar si ya existe una cita en esa fecha y hora
      const { data: existing, error: checkError } = await supabase
        .from("appointments")
        .select("id")
        .eq("fecha", fecha)
        .eq("hora", hora)
        .maybeSingle();

      if (checkError) {
        console.error("Supabase Check Error:", checkError);
      }

      if (existing) {
        return res.status(409).json({ success: false, error: "Este horario ya está reservado" });
      }

      // 2. Guardar en Supabase
      const { data: appointment, error: insertError } = await supabase
        .from("appointments")
        .insert([
          {
            nombre: `${nombre} ${apellido}`,
            email,
            telefono,
            fecha,
            hora,
            motivo: area,
            estado: "pending",
            payment_status: "pending_transfer",
            payment_method: "Transferencia Bancaria",
            observaciones: descripcion,
            tipo_consulta: tipo, // Adicionalmente guardamos tipo y precio
            precio
          }
        ])
        .select()
        .maybeSingle();

      if (insertError) {
        console.error("Supabase Insert Error FULL:", JSON.stringify(insertError, null, 2));
        return res.status(500).json({ success: false, error: "Error al registrar el turno en la base de datos", details: insertError });
      }

      // 3. Enviar Emails via Brevo
      const BREVO_API_KEY = process.env.BREVO_API_KEY;
      const EMAIL_SENDER = process.env.EMAIL_SENDER || "xamenasantiago@hotmail.com";
      const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER || "xamenasantiago@hotmail.com";

      if (BREVO_API_KEY) {
        try {
          // Email al estudio
          await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
              sender: { name: "Xamena y Asociados", email: EMAIL_SENDER },
              to: [{ email: EMAIL_RECEIVER }],
              subject: "Nueva RESERVA DE TURNO desde la web",
              htmlContent: `
                <div style="font-family: sans-serif; padding: 30px; color: #333; background-color: #f9f9f9; border-radius: 8px;">
                  <h2 style="color: #1B3A7A; border-bottom: 2px solid #C9A43B; padding-bottom: 10px;">Nuevo Turno Agendado</h2>
                  <p><strong>Cliente:</strong> ${nombre} ${apellido}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Teléfono:</strong> ${telefono}</p>
                  <p><strong>Fecha y Hora:</strong> ${fecha} – ${hora} hs</p>
                  <p><strong>Área:</strong> ${area}</p>
                  <p><strong>Tipo de Consulta:</strong> ${tipo} (${precio})</p>
                  <div style="margin-top: 20px; padding: 15px; background: #fff; border-left: 4px solid #C9A43B;">
                    <strong>Observaciones:</strong><br/>${descripcion || "Sin observaciones"}
                  </div>
                </div>
              `
            },
            { headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" } }
          );

          // Email al cliente
          await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
              sender: { name: "Xamena y Asociados", email: EMAIL_SENDER },
              to: [{ email: email }],
              subject: "Confirmación de Turno | Xamena & Asociados",
              htmlContent: `
                <div style="font-family: sans-serif; padding: 30px; color: #333; line-height: 1.6;">
                  <h2 style="color: #1B3A7A; border-bottom: 2px solid #C9A43B; padding-bottom: 10px;">Turno Reservado con Éxito</h2>
                  <p>Estimado/a ${nombre},</p>
                  <p>Le confirmamos que su turno ha sido reservado correctamente. A continuación los detalles:</p>
                  <ul>
                    <li><strong>Día:</strong> ${fecha}</li>
                    <li><strong>Hora:</strong> ${hora} hs</li>
                    <li><strong>Modalidad:</strong> ${tipo}</li>
                  </ul>
                  <p>En breve nos pondremos en contacto para coordinar los detalles finales.</p>
                  <div style="margin-top: 30px; padding: 20px; background: #F6F3EC; border: 1px solid #d8d4c8; border-radius: 4px;">
                    <h4 style="margin-top: 0; color: #1B3A7A;">Xamena & Asociados</h4>
                    <p style="font-size: 13px;">📍 Entre ríos 489 – Planta baja, Oficina 2, Tucumán</p>
                    <p style="font-size: 13px;">📞 3815350413</p>
                  </div>
                </div>
              `
            },
            { headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" } }
          );
        } catch (emailErr) {
          console.error("Error enviando emails de confirmación:", emailErr);
          // No fallamos la respuesta si solo fallan los emails, ya que el turno ya se guardó
        }
      }

      res.json({ success: true, message: "Turno reservado correctamente" });

    } catch (error: any) {
      console.error("Error al agendar turno:", error);
      res.status(500).json({ success: false, error: "Error interno del servidor" });
    }
  });

  // API route for general contact form (sent via Brevo)
  app.post("/api/send-email", async (req, res) => {
    console.log("--- NUEVA CONSULTA RECIBIDA ---");
    console.log("BODY:", JSON.stringify(req.body, null, 2));

    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      console.warn("Faltan campos obligatorios");
      return res.status(400).json({ success: false, error: "Faltan campos obligatorios" });
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const EMAIL_SENDER = process.env.EMAIL_SENDER || "xamenasantiago@hotmail.com";
    const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER || "xamenasantiago@hotmail.com";

    console.log("BREVO API KEY:", BREVO_API_KEY ? "OK (Configurada)" : "FALTA (No configurada)");
    console.log("EMAIL_SENDER:", EMAIL_SENDER);
    console.log("EMAIL_RECEIVER:", EMAIL_RECEIVER);

    if (!BREVO_API_KEY) {
      console.error("BREVO_API_KEY no configurada");
      return res.status(500).json({ success: false, error: "Error de configuración en el servidor" });
    }

    try {
      console.log("Enviando petición a Brevo (PARA EL ESTUDIO)...");
      const studioResponse = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: "Xamena y Asociados",
            email: EMAIL_SENDER
          },
          to: [
            {
              email: EMAIL_RECEIVER
            }
          ],
          subject: "Nueva consulta desde la web",
          htmlContent: `
            <div style="font-family: sans-serif; padding: 30px; color: #333; background-color: #f9f9f9; border-radius: 8px;">
              <h2 style="color: #1B3A7A; border-bottom: 2px solid #C9A43B; padding-bottom: 10px;">Nueva consulta recibida</h2>
              <p style="font-size: 16px;"><strong>Nombre:</strong> ${nombre}</p>
              <p style="font-size: 16px;"><strong>Email:</strong> ${email}</p>
              <div style="margin-top: 25px; padding: 20px; background: #ffffff; border-left: 5px solid #C9A43B; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <p style="font-style: italic; color: #555; margin: 0;">"${mensaje}"</p>
              </div>
              <p style="margin-top: 30px; font-size: 12px; color: #888;">Este mensaje fue enviado desde el formulario de contacto de la web de Xamena & Asociados.</p>
            </div>
          `
        },
        {
          headers: {
            "api-key": BREVO_API_KEY,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("BREVO (STUDIO) RESPONSE:", studioResponse.status, studioResponse.data);

      console.log("Enviando petición a Brevo (PARA EL CLIENTE)...");
      const clientResponse = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: "Xamena y Asociados",
            email: EMAIL_SENDER
          },
          to: [
            {
              email: email
            }
          ],
          subject: "Hemos recibido su consulta | Xamena & Asociados",
          htmlContent: `
            <div style="font-family: sans-serif; padding: 30px; color: #333; line-height: 1.6;">
              <h2 style="color: #1B3A7A; border-bottom: 2px solid #C9A43B; padding-bottom: 10px;">Estimado/a ${nombre},</h2>
              <p>Hemos recibido su consulta a través de nuestra página web y queremos confirmarle que ya está siendo procesada por nuestro equipo legal.</p>
              <p>Un profesional de nuestro estudio se pondrá en contacto con usted a la brevedad para brindarle el asesoramiento adecuado.</p>
              
              <div style="margin-top: 30px; padding: 20px; background: #F6F3EC; border: 1px solid #d8d4c8; border-radius: 4px;">
                <h4 style="margin-top: 0; color: #1B3A7A; font-size: 16px;">Xamena & Asociados · Estudio Jurídico</h4>
                <p style="margin: 5px 0; font-size: 14px; color: #555;"><strong>📍 Dirección:</strong> Entre ríos 489 – Planta baja, Oficina 2, S.M. de Tucumán</p>
                <p style="margin: 5px 0; font-size: 14px; color: #555;"><strong>📞 Teléfono:</strong> 3815350413</p>
                <p style="margin: 5px 0; font-size: 14px; color: #555;"><strong>✉️ Email:</strong> xamenasantiago@hotmail.com</p>
              </div>
              
              <p style="margin-top: 30px; font-size: 12px; color: #888;">Este es un mensaje automático, por favor no responda a este correo.</p>
            </div>
          `
        },
        {
          headers: {
            "api-key": BREVO_API_KEY,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("BREVO (CLIENT) RESPONSE:", clientResponse.status, clientResponse.data);

      const studioOk = studioResponse.status === 201 || studioResponse.status === 200;
      const clientOk = clientResponse.status === 201 || clientResponse.status === 200;

      if (studioOk && clientOk) {
        res.json({ success: true });
      } else {
        res.status(500).json({ 
          success: false, 
          error: "Uno o ambos correos no pudieron enviarse correctamente",
          studioStatus: studioResponse.status,
          clientStatus: clientResponse.status
        });
      }
    } catch (error: any) {
      console.error("--- ERROR EN ENVÍO BREVO ---");
      const errorData = error.response?.data || error.message;
      console.error(JSON.stringify(errorData, null, 2));
      res.status(500).json({ 
        success: false, 
        error: "Error de servidor al procesar el envío", 
        details: errorData 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}

startServer();
