// Envio de notificações por email/SMS.
// Usa Resend se RESEND_API_KEY estiver configurada; caso contrário, regista no log.
export async function sendNotification(channel: string, to: string, subject: string, message: string) {
  if (channel !== 'SMS' && process.env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: 'ADVZ Monitor <alertas@advz.gov.mz>', to, subject, text: message }),
      });
    } catch (e) {
      console.error('Falha ao enviar email:', e);
    }
  } else {
    console.log(`[EMAIL→${to}] ${subject}: ${message}`);
  }

  if (channel === 'SMS' || channel === 'BOTH') {
    console.log(`[SMS→${to}] ${message}`);
  }
}
