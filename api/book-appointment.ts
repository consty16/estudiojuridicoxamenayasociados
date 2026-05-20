import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || ""
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Método no permitido" });
  }

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
    precio,
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
          tipo_consulta: tipo,
          precio,
        },
      ])
      .select()
      .maybeSingle();

    if (insertError) {
      console.error("Supabase Insert Error:", JSON.stringify(insertError, null, 2));
      return res.status(500).json({ success: false, error: "Error al registrar el turno en la base de datos", details: insertError });
    }

    // 3. Enviar Emails via Brevo
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const EMAIL_SENDER = process.env.EMAIL_SENDER || "xamenasantiago@hotmail.com";
    const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER || "xamenasantiago@hotmail.com";

    if (BREVO_API_KEY) {
      try {
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
            `,
          },
          { headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" } }
        );

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
            `,
          },
          { headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" } }
        );
      } catch (emailErr) {
        console.error("Error enviando emails:", emailErr);
        // No fallamos si solo fallan los emails; el turno ya fue guardado
      }
    }

    return res.json({ success: true, message: "Turno reservado correctamente" });
  } catch (error: any) {
    console.error("Error al agendar turno:", error);
    return res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
}
