import { useState, useCallback } from 'react';
import { AppState } from '../types';

interface Props {
  state: AppState;
  goTo: (step: AppState['step']) => void;
  handleUploadComplete: (pdfBase64: string, filename: string) => void;
}

const BANKS = ['BBVA', 'CaixaBank', 'Santander', 'Bankinter', 'ING', 'Sabadell', 'Openbank', 'Revolut Business', 'N26', 'Wise', 'Unicaja'];

export default function Upload({ state, handleUploadComplete }: Props) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const processFile = useCallback((f: File) => {
    if (f.type !== 'application/pdf') { setError('Por favor sube un archivo PDF.'); return; }
    if (f.size > 20 * 1024 * 1024) { setError('El archivo es demasiado grande. Máximo 20MB.'); return; }
    setError(''); setFile(f);
    const reader = new FileReader();
    reader.onload = () => { const base64 = (reader.result as string).split(',')[1]; handleUploadComplete(base64, f.name); };
    reader.readAsDataURL(f);
  }, [handleUploadComplete]);

  const onDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }, [processFile]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'var(--paper)' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--gold)', marginBottom: 8 }}>Hola, {state.onboarding?.fullname?.split(' ')[0]} 👋</p>
          <h1 className="serif" style={{ fontSize: 42, color: 'var(--ink)', marginBottom: 12 }}>Sube tu extracto bancario</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>Descarga el PDF de los últimos 12 meses desde tu banca online y súbelo aquí.</p>
        </div>

        <div
          className="fade-up-1"
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => document.getElementById('file-input')?.click()}
          style={{ border: `2px dashed ${dragging ? 'var(--gold)' : 'var(--border)'}`, borderRadius: 20, background: dragging ? 'var(--gold-light)' : 'var(--cream)', padding: '60px 40px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', marginBottom: 16 }}
        >
          <input id="file-input" type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
          <div style={{ fontSize: 32, marginBottom: 12 }}>{file ? '📄' : '⬆️'}</div>
          {file ? (
            <><p style={{ fontWeight: 500, fontSize: 14, color: 'var(--ink)' }}>{file.name}</p><p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Procesando...</p></>
          ) : (
            <><p style={{ fontWeight: 500, fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>Arrastra tu extracto aquí</p><p style={{ fontSize: 12, color: 'var(--muted)' }}>o haz clic para seleccionar — PDF hasta 20MB</p></>
          )}
        </div>

        {error && <div style={{ background: 'var(--red-light)', color: 'var(--red)', padding: '12px 16px', borderRadius: 12, fontSize: 13, marginBottom: 16 }}>⚠ {error}</div>}

        <div className="fade-up-2" style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px', marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink)', marginBottom: 12 }}>¿Cómo descargo mi extracto?</p>
          <ol style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 2, paddingLeft: 16 }}>
            <li>Entra en tu banca online</li>
            <li>Ve a Cuentas → Movimientos</li>
            <li>Selecciona los últimos 12 meses</li>
            <li>Descarga en PDF</li>
          </ol>
        </div>

        <div className="fade-up-3" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>Bancos compatibles</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
            {BANKS.map(b => <span key={b} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 99, background: 'var(--cream)', color: 'var(--muted)', border: '1px solid var(--border)' }}>{b}</span>)}
          </div>
          <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 16 }}>🔒 Tu extracto se procesa y se descarta. No almacenamos datos bancarios.</p>
        </div>
      </div>
    </div>
  );
}
