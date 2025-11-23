// Polyfills para suporte a Buffer e outros módulos Node.js no browser
// Este arquivo deve ser importado no início da aplicação

// Import dinâmico para evitar problemas em build
import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
  // Polyfill para Buffer
  if (typeof globalThis.Buffer === 'undefined') {
    globalThis.Buffer = Buffer;
    // Converte através de unknown primeiro para evitar erro de tipo
    (window as unknown as Record<string, unknown>).Buffer = Buffer;
  }
  
  // Polyfill para global
  if (typeof globalThis.global === 'undefined') {
    globalThis.global = globalThis;
  }

  // TextDecoder/TextEncoder são nativos no browser moderno
  // Não precisamos polyfill para eles, mas garantimos que estão disponíveis
  if (typeof globalThis.TextDecoder === 'undefined') {
    // Fallback apenas se realmente não existir (muito raro em browsers modernos)
    console.warn('TextDecoder not available - this should not happen in modern browsers');
  }
}

