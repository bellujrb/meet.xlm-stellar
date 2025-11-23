// Serviço de geração de prova ZK usando Noir
// Adaptado para Stellar (XLM) ao invés de WLD

// Tipos para os inputs da prova
export interface ProofInputs {
  threshold: number;      // u64 público - valor mínimo de saldo (em XLM)
  nonce: string;          // Field público - nonce para evitar replay attacks
  balance: number;        // u64 privado - saldo real do usuário (em XLM)
  secret_nonce: string;   // Field privado - nonce secreto (deve ser igual ao nonce público)
}

// Tipos para o resultado da prova
export interface ProofResult {
  proof: Uint8Array;      // Prova binária
  proofB64: string;       // Prova em base64 para envio
  publicInputs: number[]; // Inputs públicos para verificação
  verificationKey: Uint8Array; // Chave de verificação
  isValid: boolean;       // Se a prova é válida localmente
}

// Callback de progresso
export type ProgressCallback = (progress: number, text: string) => void;

// Função principal de geração de prova
export const generateProof = async (
  inputs: ProofInputs, 
  onProgress?: ProgressCallback
): Promise<ProofResult> => {
  try {
    onProgress?.(10, "Loading dependencies...");
    
    // Importar dependências dinamicamente
    const { UltraHonkBackend } = await import("@aztec/bb.js");
    const { Noir } = await import("@noir-lang/noir_js");
    
    onProgress?.(20, "Loading circuit...");
    const res = await fetch("/zk_noir_circuit.json");
    
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Circuit file not found. Please compile the circuit with "nargo compile" and copy it to public/zk_noir_circuit.json');
      }
      const errorText = await res.text();
      console.error('Circuit fetch error:', res.status, errorText.substring(0, 200));
      throw new Error(`Error loading circuit: ${res.status} ${res.statusText}`);
    }
    
    // Check if response is JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('Expected JSON but got:', contentType, text.substring(0, 200));
      throw new Error('Circuit file format is invalid. Expected JSON but got HTML. Please check if the circuit file exists in public/zk_noir_circuit.json');
    }
    
    let circuit;
    try {
      circuit = await res.json();
    } catch (parseError) {
      const text = await res.text();
      console.error('JSON parse error. Response:', text.substring(0, 500));
      throw new Error('Failed to parse circuit JSON. The file may be corrupted or not a valid JSON file.');
    }
    
    console.log('📦 Circuit loaded:', {
      noir_version: circuit.noir_version,
      hash: circuit.hash,
      hasBytecode: !!circuit.bytecode
    });
    
    onProgress?.(30, "Initializing Noir...");
    const noir = new Noir(circuit);
    
    onProgress?.(40, "Initializing backend...");
    const backend = new UltraHonkBackend(circuit.bytecode);
    console.log("✅ Backend initialized with bytecode");

    onProgress?.(50, "Validating inputs...");
    validateInputs(inputs);

    onProgress?.(60, "Generating witness...");
    const { witness } = await noir.execute({
      threshold: inputs.threshold,
      nonce: inputs.nonce,
      balance: inputs.balance,
      secret_nonce: inputs.secret_nonce,
    });
    console.log("✅ Witness generated");

    onProgress?.(70, "Generating proof...");
    const { proof, publicInputs } = await backend.generateProof(witness);
    const vk = await backend.getVerificationKey();

    console.log("✅ Proof generated:", { 
      proofLength: proof.length, 
      publicInputs 
    });

    onProgress?.(80, "Verifying proof locally...");
    const isValid = await backend.verifyProof({ proof, publicInputs });
    console.log("✅ Proof verified locally:", isValid);

    onProgress?.(90, "Finalizing...");
    const proofB64 = btoa(String.fromCharCode(...proof));

    onProgress?.(100, "Proof generated successfully!");

    return {
      proof,
      proofB64,
      publicInputs: Array.isArray(publicInputs) 
        ? publicInputs.map(Number) 
        : [Number(publicInputs)],
      verificationKey: vk,
      isValid
    };
  } catch (err: unknown) {
    console.error("💔 Proof generation failed", err);
    const errorMessage = err instanceof Error ? err.message : "Proof generation failed";
    if (err instanceof Error && err.stack) {
      console.error("Stack trace:", err.stack);
    }
    throw new Error(errorMessage);
  }
};

// Valida os inputs da prova
function validateInputs(inputs: ProofInputs): void {
  if (inputs.threshold < 0) {
    throw new Error("Threshold must be a positive number");
  }

  if (inputs.balance < 0) {
    throw new Error("Balance must be a positive number");
  }

  if (!inputs.nonce || inputs.nonce.trim() === "") {
    throw new Error("Nonce cannot be empty");
  }

  if (!inputs.secret_nonce || inputs.secret_nonce.trim() === "") {
    throw new Error("Secret nonce cannot be empty");
  }

  if (inputs.nonce !== inputs.secret_nonce) {
    throw new Error("Public and secret nonce must be equal");
  }

  if (inputs.balance < inputs.threshold) {
    throw new Error("Balance must be greater than or equal to threshold");
  }
}

// Gera um nonce aleatório válido
export function generateRandomNonce(): string {
  return BigInt("0x" + crypto.getRandomValues(new Uint8Array(16))
    .reduce((acc, b) => acc + b.toString(16).padStart(2, "0"), "")).toString();
}

// Converte uma prova base64 de volta para Uint8Array
export function proofB64ToUint8Array(proofB64: string): Uint8Array {
  try {
    const binaryString = atob(proofB64);
    return new Uint8Array(binaryString.length).map((_, i) => binaryString.charCodeAt(i));
  } catch (error) {
    throw new Error(`Failed to convert proof base64: ${error instanceof Error ? error.message : String(error)}`);
  }
}

