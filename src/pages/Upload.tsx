import { useState, useCallback } from 'react';
import { AppState } from '../types';
import { Upload as UploadIcon, FileText, AlertCircle } from 'lucide-react';

interface Props {
  state: AppState;
  goTo: (step: AppState['step']) => void;
  handleUploadComplete: (pdfBase64: string, filename: string) => void;
}

const SUPPORTED_BANKS = [
  'BBVA', 'CaixaBank', 'Santander', 'Bankinter',
  'ING', 'Sabadell', 'Bankia/CaixaBank', 'Openbank',
  'Revolut Business', 'N26', 'Wise', 'Unicaja',
];

export default function Upload({ state, handleUploadComplete }: Props) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const processFile = useCallback((f: File) => {
    if (f.type !== 'application/pdf') {
      setError('Por favor sube un archivo PDF.');
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 20MB.');
      return;
    }
    setError('');
    setFile(f);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      handleUploadComplete(base64, f.name);
    };
    reader.readAsDataURL(f);
  }, [handleUploadComplete]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }, [processFile]);

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ background: 'var(--paper)' }}>
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-up">
          <p className="text-sm font-medium mb-3" style={{ color: 'var(--gold)' }}>
            Hola, {state.onboarding?.fullname?.split(' ')[0]} 👋
          </p>
          <h1 className="font-serif text-4xl md:text-5xl mb-3" style={{ color: 'var(--ink)' }}>
            Sube tu extracto bancario
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            Descarga el PDF de los últimos 12 meses desde tu banca online
            y súbelo aquí. Lo analizamos en segundos.
          </p>
        </div>

        {/* Dropzone */}
        <div
          className="animate-fade-up delay-100 relative rounded-2xl border-2 border-dashed transition-all cursor-pointer"
          style={{
            borderColor: dragging ? 'var(--gold)' : 'var(--border)',
            background: dragging ? 'var(--gold-light)' : 'var(--cream)',
          }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={onInput}
          />
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all"
              style={{ background: dragging ? 'var(--gold)' : 'var(--border)', color: dragging ? 'var(--ink)' : 'var(--muted)' }}
            >
              {file ? <FileText size={24} /> : <UploadIcon size={24} />}
            </div>
            {file ? (
              <>
                <p className="font-medium text-sm mb-1" style={{ color: 'var(--ink)' }}>{file.name}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>Procesando...</p>
              </>
            ) : (
              <>
                <p className="font-medium text-sm mb-1" style={{ color: 'var(--ink)' }}>
                  Arrastra tu extracto bancario aquí
                </p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  o haz clic para seleccionar — PDF hasta 20MB
                </p>
              </>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="animate-fade-up mt-3 flex items-center gap-2 text-sm px-4 py-3 rounded-xl" style={{ background: 'var(--red-light)', color: 'var(--red)' }}>
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {/* How to download */}
        <div className="animate-fade-up delay-200 mt-8 p-5 rounded-2xl" style={{ background: 'var(--cream)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--ink)' }}>¿Cómo descargo mi extracto?</p>
          <ol className="text-xs space-y-1.5" style={{ color: 'var(--muted)' }}>
            <li>1. Entra en tu banca online</li>
            <li>2. Ve a Cuentas → Movimientos</li>
            <li>3. Selecciona los últimos 12 meses</li>
            <li>4. Descarga en PDF</li>
          </ol>
        </div>

        {/* Banks */}
        <div className="animate-fade-up delay-300 mt-6 text-center">
          <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>Bancos compatibles</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {SUPPORTED_BANKS.map(b => (
              <span
                key={b}
                className="text-xs px-2.5 py-1 rounded-full"
                style={{ background: 'var(--cream)', color: 'var(--muted)', border: '1px solid var(--border)' }}
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Privacy note */}
        <p className="animate-fade-up delay-400 mt-6 text-center text-xs" style={{ color: 'var(--muted)' }}>
          🔒 Tu extracto se procesa y se descarta. No almacenamos datos bancarios.
        </p>
      </div>
    </div>
  );
}
