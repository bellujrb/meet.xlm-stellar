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

  // Polyfill para TextDecoder/TextEncoder (caso necessário)
  // TextDecoder/TextEncoder são nativos no browser moderno, mas garantimos que estão disponíveis
  if (typeof globalThis.TextDecoder === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { TextDecoder: NodeTextDecoder, TextEncoder: NodeTextEncoder } = require('util');
    globalThis.TextDecoder = NodeTextDecoder as typeof globalThis.TextDecoder;
    globalThis.TextEncoder = NodeTextEncoder as typeof globalThis.TextEncoder;
  }
  
  // Garantir que TextDecoder está disponível como construtor
  if (typeof TextDecoder === 'undefined' && typeof globalThis.TextDecoder !== 'undefined') {
    (globalThis as any).TextDecoder = globalThis.TextDecoder;
  }
}

