// Polyfills para suporte a Buffer e outros módulos Node.js no browser
// Este arquivo deve ser importado no início da aplicação

if (typeof window !== 'undefined') {
  // Polyfill para Buffer
  if (typeof globalThis.Buffer === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Buffer } = require('buffer');
    globalThis.Buffer = Buffer;
    // Converte através de unknown primeiro para evitar erro de tipo
    (window as unknown as Record<string, unknown>).Buffer = Buffer;
  }
  
  // Polyfill para global
  if (typeof globalThis.global === 'undefined') {
    globalThis.global = globalThis;
  }
}

