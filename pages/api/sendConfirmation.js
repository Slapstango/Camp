
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { reservation, reservationId } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
    <h1>Reservation Confirmation</h1>
    <p>Hi ${reservation.primaryName},</p>
    <p>Your booking for <strong>${reservation.siteId}</strong> from
       <strong>${reservation.startDate}</strong> to <strong>${reservation.endDate}</strong> is confirmed.</p>
    <p>Please register at the office and pay upon arrival.</p>
    <p>Thank you!</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: reservation.email,
      subject: \`Reservation #\${reservationId} Confirmation\`,
      html,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: err.message });
  }
}
