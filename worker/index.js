export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === '/api/send-order' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { cliente, articoli, totale } = body;

        const itemsHtml = articoli.map(item =>
          `<tr>
            <td style="padding:8px;border-bottom:1px solid #eee">${item.name}${item.details ? `<br><small style="color:#666">${item.details}</small>` : ''}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">€${(item.price * item.quantity).toFixed(2)}</td>
          </tr>`
        ).join('');

        const emailHtml = `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fff;padding:30px;border-radius:8px">
            <h1 style="color:#D4AF37;text-align:center;font-size:2em;margin-bottom:5px">Malu</h1>
            <p style="text-align:center;color:#666;margin-bottom:30px">Pasticceria · Tavola Calda · Gelateria</p>
            <h2 style="color:#333">Nuovo Ordine</h2>
            <p><strong>Cliente:</strong> ${cliente.nome} ${cliente.cognome}</p>
            <p><strong>Telefono:</strong> ${cliente.telefono}</p>
            <p><strong>Ritiro:</strong> ${cliente.data} alle ${cliente.ora}</p>
            ${cliente.note ? `<p><strong>Note:</strong> ${cliente.note}</p>` : ''}
            <table style="width:100%;border-collapse:collapse;margin-top:20px">
              <thead>
                <tr style="background:#f5f0e8">
                  <th style="padding:10px;text-align:left">Prodotto</th>
                  <th style="padding:10px;text-align:center">Qtà</th>
                  <th style="padding:10px;text-align:right">Prezzo</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding:12px;font-weight:bold;text-align:right">Totale:</td>
                  <td style="padding:12px;font-weight:bold;color:#D4AF37;text-align:right">€${totale.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        `;

        const BREVO_API_KEY = env.BREVO_API_KEY;
        const OWNER_EMAIL = env.OWNER_EMAIL || 'info@malu.it';
        const OWNER_NAME = env.OWNER_NAME || 'Malu Pasticceria';

        const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': BREVO_API_KEY,
          },
          body: JSON.stringify({
            sender: { name: 'Malu Ordini', email: OWNER_EMAIL },
            to: [{ email: OWNER_EMAIL, name: OWNER_NAME }],
            subject: `Nuovo ordine da ${cliente.nome} ${cliente.cognome} – ${cliente.data}`,
            htmlContent: emailHtml,
          }),
        });

        if (!brevoRes.ok) {
          const errText = await brevoRes.text();
          console.error('Brevo error:', errText);
          return new Response(JSON.stringify({ message: 'Errore invio email' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.error('Worker error:', err);
        return new Response(JSON.stringify({ message: 'Errore interno del server' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  }
};
