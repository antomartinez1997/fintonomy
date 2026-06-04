# Fintonomy

**Estabilizador financiero y gestión fiscal para autónomos en España.**

Upload a bank statement PDF → Claude AI parses and categorizes every transaction → Get your exact tax reserve and safe monthly salary.

---

## Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **AI**: Claude API (PDF parsing + transaction categorization)
- **Payments**: Stripe (14-day free trial → 9€/month or 79€/year)
- **Auth + DB**: Supabase
- **Hosting**: Vercel

---

## Run locally

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in your API keys in .env.local

# 3. Run the app
npm run dev
# → http://localhost:3000
```

**Note**: Without an Anthropic API key, the app runs in demo mode with mock data. All UI flows work.

---

## Deploy to Vercel

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "Initial commit"
gh repo create fintonomy --private && git push

# 2. Import to Vercel
# Go to vercel.com → New Project → Import your repo

# 3. Add environment variables in Vercel dashboard:
ANTHROPIC_API_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_PRICE_MONTHLY=...
STRIPE_PRICE_YEARLY=...
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
APP_URL=https://your-deployment.vercel.app
```

---

## Stripe setup

1. Create account at stripe.com
2. Create two recurring prices:
   - Monthly: 9.00 EUR/month → copy Price ID → `STRIPE_PRICE_MONTHLY`
   - Yearly: 79.00 EUR/year → copy Price ID → `STRIPE_PRICE_YEARLY`
3. Both automatically include 14-day trial (configured in `api/create-checkout.js`)

---

## Supported banks

Any Spanish bank that exports PDF statements. Tested with:
BBVA, CaixaBank, Santander, Bankinter, ING, Sabadell, Openbank, Revolut Business, N26, Wise, Unicaja

---

## Architecture

```
User uploads PDF
       ↓
React frontend (Vite)
       ↓ POST /api/parse-statement
Vercel serverless function
       ↓
Anthropic Claude API
(reads PDF, returns structured JSON)
       ↓
React displays results
       ↓
User hits paywall → email capture
       ↓ POST /api/create-checkout
Stripe checkout (14-day trial)
```

---

## Legal note

Fintonomy provides estimates for informational purposes only. Not a licensed tax advisor. Users should consult a gestor for formal fiscal advice.
