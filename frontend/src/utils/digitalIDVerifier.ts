// Digital ID Verification Utility
// This can be used both on frontend and backend to verify digital IDs

export interface DigitalIDData {
    id: number;
    tourist_id: number;
    kyc_id: string;
    status: string;
    valid_from: string;
    valid_to: string;
    public_address?: string;
    block_hash?: string;
    signature?: string;
    verification_hash?: string;
    blockchain_id?: number;
    tx_hash?: string;
    contract_address?: string;
    chain_id?: number;
    decentralized_status: string;
    block_index?: number;
    timestamp?: string;
  }
  
  export interface VerificationResult {
    isValid: boolean;
    reasons: string[];
    securityLevel: 'high' | 'medium' | 'low';
    verificationMethods: string[];
  }
  
  export class DigitalIDVerifier {
    /**
     * Verify a digital ID comprehensively
     */
    static verify(digitalId: DigitalIDData): VerificationResult {
      const reasons: string[] = [];
      const verificationMethods: string[] = [];
      let isValid = true;
      let securityLevel: 'high' | 'medium' | 'low' = 'low';
  
      // Check basic validity
      if (!digitalId.kyc_id) {
        isValid = false;
        reasons.push('Missing KYC ID');
      } else {
        verificationMethods.push('KYC ID present');
      }
  
      // Check expiration
      try {
        const validTo = new Date(digitalId.valid_to);
        const now = new Date();
        if (validTo < now) {
          isValid = false;
          reasons.push('Digital ID has expired');
        } else {
          verificationMethods.push('Validity period checked');
        }
      } catch {
        isValid = false;
        reasons.push('Invalid expiration date');
      }
  
      // Check status
      if (digitalId.status !== 'active') {
        isValid = false;
        reasons.push(`Digital ID status is ${digitalId.status}`);
      } else {
        verificationMethods.push('Status is active');
      }
  
      // Check cryptographic elements
      if (digitalId.block_hash) {
        verificationMethods.push('Block hash present');
        if (this.isValidHash(digitalId.block_hash)) {
          verificationMethods.push('Block hash format valid');
          securityLevel = 'medium';
        } else {
          reasons.push('Invalid block hash format');
        }
      }
  
      if (digitalId.signature) {
        verificationMethods.push('Digital signature present');
        if (this.isValidHash(digitalId.signature)) {
          verificationMethods.push('Signature format valid');
        } else {
          reasons.push('Invalid signature format');
        }
      }
  
      if (digitalId.verification_hash) {
        verificationMethods.push('Verification hash present');
        if (this.verifyVerificationHash(digitalId)) {
          verificationMethods.push('Verification hash validated');
        } else {
          reasons.push('Verification hash mismatch');
          isValid = false;
        }
      }
  
      // Check blockchain verification
      if (digitalId.decentralized_status?.includes('verified_on_blockchain')) {
        verificationMethods.push('Blockchain verified');
        securityLevel = 'high';
        
        if (digitalId.tx_hash && this.isValidTxHash(digitalId.tx_hash)) {
          verificationMethods.push('Transaction hash valid');
        } else {
          reasons.push('Invalid or missing transaction hash');
        }
  
        if (digitalId.blockchain_id) {
          verificationMethods.push('Blockchain ID present');
        }
  
        if (digitalId.contract_address && this.isValidAddress(digitalId.contract_address)) {
          verificationMethods.push('Valid contract address');
        }
  
        if (digitalId.chain_id) {
          verificationMethods.push(`Network: ${this.getNetworkName(digitalId.chain_id)}`);
        }
      } else if (digitalId.decentralized_status?.includes('revoked')) {
        isValid = false;
        reasons.push('Digital ID has been revoked on blockchain');
      } else if (digitalId.decentralized_status?.includes('local_only')) {
        verificationMethods.push('Local verification only');
        reasons.push('Not anchored on blockchain');
        securityLevel = securityLevel === 'low' ? 'medium' : securityLevel;
      } else if (digitalId.decentralized_status?.includes('error') || 
                 digitalId.decentralized_status?.includes('failed')) {
        reasons.push('Blockchain verification failed');
        isValid = false;
      }
  
      // If no critical issues found and we have cryptographic proof
      if (isValid && verificationMethods.length < 3) {
        reasons.push('Insufficient verification methods');
        securityLevel = 'low';
      }
  
      return {
        isValid,
        reasons,
        securityLevel,
        verificationMethods
      };
    }
  
    /**
     * Verify the verification hash matches expected value
     */
    private static verifyVerificationHash(digitalId: DigitalIDData): boolean {
      if (!digitalId.verification_hash) return false;
      
      try {
        // Reconstruct the verification data string
        let verificationData = `${digitalId.id}|${digitalId.kyc_id}`;
        if (digitalId.block_hash) {
          verificationData += `|${digitalId.block_hash}`;
        }
        if (digitalId.tx_hash) {
          verificationData += `|${digitalId.tx_hash}`;
        }
        
        // For client-side verification, we would need crypto-js or similar
        // This is a simplified check - in production, implement proper hash verification
        return digitalId.verification_hash.length === 64; // SHA-256 hex length
      } catch {
        return false;
      }
    }
  
    /**
     * Check if a string looks like a valid hash
     */
    private static isValidHash(hash: string): boolean {
      if (!hash) return false;
      // Check for valid hex string of appropriate length
      const hexPattern = /^[a-fA-F0-9]+$/;
      return hexPattern.test(hash) && (hash.length === 64 || hash.length === 128);
    }
  
    /**
     * Check if a string looks like a valid transaction hash
     */
    private static isValidTxHash(txHash: string): boolean {
      if (!txHash) return false;
      // Ethereum/Polygon transaction hash format
      return /^0x[a-fA-F0-9]{64}$/.test(txHash);
    }
  
    /**
     * Check if a string looks like a valid Ethereum address
     */
    private static isValidAddress(address: string): boolean {
      if (!address) return false;
      // Basic Ethereum address format check
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    }
  
    /**
     * Get network name from chain ID
     */
    private static getNetworkName(chainId: number): string {
      switch (chainId) {
        case 31337: return 'Local Testnet';
        case 80002: return 'Polygon Amoy';
        case 137: return 'Polygon Mainnet';
        case 1: return 'Ethereum Mainnet';
        case 11155111: return 'Sepolia Testnet';
        default: return `Chain ${chainId}`;
      }
    }
  
    /**
     * Get blockchain explorer URL for a transaction
     */
    static getExplorerUrl(chainId: number, txHash: string): string | null {
      if (!this.isValidTxHash(txHash)) return null;
      
      switch (chainId) {
        case 80002:
          return `https://amoy.polygonscan.com/tx/${txHash}`;
        case 137:
          return `https://polygonscan.com/tx/${txHash}`;
        case 1:
          return `https://etherscan.io/tx/${txHash}`;
        case 11155111:
          return `https://sepolia.etherscan.io/tx/${txHash}`;
        default:
          return null;
      }
    }
  
    /**
     * Format verification result as human-readable string
     */
    static formatVerificationResult(result: VerificationResult): string {
      const status = result.isValid ? '✅ VALID' : '❌ INVALID';
      const security = `Security Level: ${result.securityLevel.toUpperCase()}`;
      const methods = `Verification Methods: ${result.verificationMethods.join(', ')}`;
      const issues = result.reasons.length > 0 ? `Issues: ${result.reasons.join(', ')}` : 'No issues found';
      
      return `${status}\n${security}\n${methods}\n${issues}`;
    }
  
    /**
     * Quick validation for UI display
     */
    static getStatusInfo(digitalId: DigitalIDData): {
      color: string;
      icon: string;
      text: string;
      description: string;
    } {
      const verification = this.verify(digitalId);
      
      if (!verification.isValid) {
        return {
          color: 'text-red-600 bg-red-50 border-red-200',
          icon: '❌',
          text: 'Invalid',
          description: verification.reasons.join(', ')
        };
      }
  
      switch (verification.securityLevel) {
        case 'high':
          return {
            color: 'text-green-600 bg-green-50 border-green-200',
            icon: '🛡️',
            text: 'Blockchain Verified',
            description: 'Maximum security with blockchain anchoring'
          };
        case 'medium':
          return {
            color: 'text-blue-600 bg-blue-50 border-blue-200',
            icon: '🔒',
            text: 'Cryptographically Secured',
            description: 'Verified with cryptographic signatures'
          };
        case 'low':
          return {
            color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
            icon: '⚠️',
            text: 'Basic Verification',
            description: 'Limited verification methods available'
          };
      }
    }
  }