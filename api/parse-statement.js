// api/parse-statement.js
// Vercel serverless function — runs on the backend, API key is safe here

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pdfBase64, irpfRate = 0.15 } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({ error: 'No PDF data provided' });
    }

    const systemPrompt = `Eres un experto en fiscalidad española para autónomos. 
Tu tarea es analizar extractos bancarios españoles y extraer todas las transacciones en formato JSON estructurado.

Debes identificar:
1. El banco emisor del extracto
2. El período cubierto (fecha inicio y fin)
3. Todas las transacciones individuales

Para cada transacción debes determinar:
- date: fecha en formato YYYY-MM-DD
- description: descripción limpia de la transacción
- amount: importe en euros (número positivo siempre)
- type: "ingreso" o "gasto"
- category: una de estas categorías exactas: "Ingreso Cliente", "Suscripción Software", "Espacio Coworking", "Suministros & Hogar", "Restauración & Comidas", "Viaje & Transporte", "Equipos Electrónicos", "Impuestos/Tasas", "Nómina/Sueldo propio", "Otros"
- isProfessional: true si es un gasto/ingreso profesional, false si es personal
- isDeductible: "si", "no", "parcial", o "dudoso" (solo aplica a gastos profesionales)
- ivaRate: 0, 0.04, 0.10, o 0.21 según corresponda al tipo de gasto/servicio
- irpfRate: ${irpfRate} para ingresos de clientes empresariales, 0 para el resto

Reglas fiscales españolas a aplicar:
- Gastos de restauración: deducibles al 50% (parcial), IVA 10%
- Software/SaaS: 100% deducible, IVA 21%
- Coworking: 100% deducible, IVA 21%
- Material de oficina: 100% deducible, IVA 21%
- Transporte: deducible según uso profesional
- Suministros hogar (si trabaja desde casa): 30% deducible (parcial)
- Transferencias propias entre cuentas: isProfessional=false

IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, sin backticks, sin comentarios.

Formato exacto requerido:
{
  "bankDetected": "nombre del banco",
  "periodStart": "YYYY-MM-DD",
  "periodEnd": "YYYY-MM-DD",
  "transactions": [
    {
      "id": "tx-1",
      "date": "YYYY-MM-DD",
      "description": "descripción",
      "amount": 1000.00,
      "type": "ingreso",
      "category": "Ingreso Cliente",
      "isProfessional": true,
      "isDeductible": "no",
      "ivaRate": 0.21,
      "irpfRate": 0.15
    }
  ]
}`;

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 8000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: pdfBase64,
              },
            },
            {
              type: 'text',
              text: 'Analiza este extracto bancario y extrae todas las transacciones siguiendo exactamente el formato JSON especificado.',
            },
          ],
        },
      ],
    });

    const rawText = response.content[0].type === 'text' ? response.content[0].text : '';
    
    // Clean and parse JSON
    const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    // Calculate totals
    const totalIncome = parsed.transactions
      .filter(t => t.type === 'ingreso')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = parsed.transactions
      .filter(t => t.type === 'gasto')
      .reduce((sum, t) => sum + t.amount, 0);

    return res.status(200).json({
      ...parsed,
      totalIncome,
      totalExpenses,
    });

  } catch (error) {
    console.error('Parse error:', error);
    return res.status(500).json({ 
      error: 'Error procesando el extracto. Por favor intenta de nuevo.',
      details: error.message 
    });
  }
}
