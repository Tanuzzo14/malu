# Malu – Pasticceria & Tavola Calda

SPA Angular 21 per prenotazioni online della pasticceria Malu.

## 🚀 Deploy su Cloudflare (senza installare nulla in locale)

### 1. Deploy del frontend su Cloudflare Pages

1. Vai su [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → **Pages**
2. Collega il tuo repository GitHub
3. Configura il build:
   - **Framework preset**: Angular
   - **Build command**: `npm run build`
   - **Build output directory**: `dist/malu-bakery/browser`
4. Clicca **Save and Deploy**

### 2. Deploy del Worker su Cloudflare Workers

1. Vai su **Workers & Pages** → **Create application** → **Worker**
2. Copia il contenuto di `worker/index.js` nell'editor online
3. Rinomina il worker in `malu-worker`
4. Salva e fai deploy

### 3. Configurare i segreti del Worker

Nella dashboard del worker, vai su **Settings** → **Variables** → **Environment Variables**:

| Nome variabile | Tipo | Valore |
|---|---|---|
| `BREVO_API_KEY` | Secret | La tua API key di Brevo |
| `OWNER_EMAIL` | Text | L'email che riceve gli ordini |
| `OWNER_NAME` | Text | `Malu Pasticceria` |

### 4. Collegare il Worker al sito Pages

1. Nella dashboard del tuo sito Pages → **Settings** → **Functions**
2. Aggiungi un **Route binding**: `/api/*` → seleziona `malu-worker`

In alternativa, aggiungi un file `public/_redirects`:
```
/api/* https://malu-worker.tuousername.workers.dev/:splat 200
```

### 5. Ottenere la API Key di Brevo

1. Registrati su [brevo.com](https://www.brevo.com) (gratuito fino a 300 email/giorno)
2. Vai su **Account** → **SMTP & API** → **API Keys** → **Generate a new API key**
3. Copia la chiave e inseriscila come secret `BREVO_API_KEY` nel Worker

---

## 🏗️ Struttura del progetto

```
src/
├── app/
│   ├── services/cart.service.ts   # Carrello con Angular Signals
│   ├── models/products.ts         # Catalogo prodotti
│   ├── landing/landing.ts         # Pagina iniziale
│   ├── wizard/wizard.ts           # Wizard prenotazione
│   ├── cart-bar/cart-bar.ts       # Barra carrello floating
│   ├── checkout/checkout.ts       # Form ordine finale
│   └── app.ts                     # Root component
worker/
├── index.js                       # Cloudflare Worker (invia email)
└── wrangler.toml                  # Configurazione Worker
```

## 🎨 Design

- **Sfondo**: Antracite scuro (`#1a0f0a`)
- **Testo**: Crema (`#f5f0e8`)
- **Accento/Oro**: `#D4AF37`
- **Font titoli**: Playfair Display
- **Font corpo**: Montserrat
