'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  Hash, 
  ExternalLink, 
  Copy,
  AlertCircle,
  Globe
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface DigitalIDData {
  id: number;
  kyc_id: string;
  status: string;
  valid_from: string;
  valid_to: string;
  public_address?: string;
  block_hash?: string;
  verification_hash?: string;
  blockchain_id?: number;
  tx_hash?: string;
  contract_address?: string;
  chain_id?: number;
  decentralized_status: string;
  block_index?: number;
  timestamp?: string;
}

interface DigitalIDCardProps {
  digitalId: DigitalIDData;
  className?: string;
}

export default function DigitalIDCard({ digitalId, className }: DigitalIDCardProps) {
  const isBlockchainVerified = digitalId.decentralized_status.includes('verified_on_blockchain');
  const isLocalOnly = digitalId.decentralized_status.includes('local_only');
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = () => {
    if (isBlockchainVerified) return 'text-green-600 bg-green-50 border-green-200';
    if (isLocalOnly) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusIcon = () => {
    if (isBlockchainVerified) return <CheckCircle className="w-4 h-4" />;
    if (isLocalOnly) return <AlertCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Digital ID
          </h3>
        </div>
        <div className={cn(
          "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border",
          getStatusColor()
        )}>
          {getStatusIcon()}
          <span>
            {isBlockchainVerified ? 'Blockchain Verified' : 
             isLocalOnly ? 'Local Verification' : 'Verification Failed'}
          </span>
        </div>
      </div>

      {/* KYC ID */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
          KYC ID
        </label>
        <div className="flex items-center space-x-2">
          <code className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-sm font-mono flex-1">
            {digitalId.kyc_id}
          </code>
          <button
            onClick={() => copyToClipboard(digitalId.kyc_id)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Copy KYC ID"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Validity Period */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            <Clock className="w-4 h-4 inline mr-1" />
            Valid From
          </label>
          <p className="text-sm text-gray-900 dark:text-white">
            {formatDate(digitalId.valid_from)}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            <Clock className="w-4 h-4 inline mr-1" />
            Valid Until
          </label>
          <p className="text-sm text-gray-900 dark:text-white">
            {formatDate(digitalId.valid_to)}
          </p>
        </div>
      </div>

      {/* Blockchain Information */}
      {isBlockchainVerified && (
        <div className="space-y-3 mb-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
            <Globe className="w-4 h-4 mr-1" />
            Blockchain Verification
          </h4>
          
          {digitalId.blockchain_id && (
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                Blockchain ID
              </label>
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono">
                #{digitalId.blockchain_id}
              </code>
            </div>
          )}

          {digitalId.tx_hash && (
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                Transaction Hash
              </label>
              <div className="flex items-center space-x-2">
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono flex-1 truncate">
                  {digitalId.tx_hash}
                </code>
                <button
                  onClick={() => copyToClipboard(digitalId.tx_hash!)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Copy Transaction Hash"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {digitalId.contract_address && (
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                Contract Address
              </label>
              <div className="flex items-center space-x-2">
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono flex-1 truncate">
                  {digitalId.contract_address}
                </code>
                <button
                  onClick={() => copyToClipboard(digitalId.contract_address!)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Copy Contract Address"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {digitalId.chain_id && (
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                Network
              </label>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Chain ID: {digitalId.chain_id} 
                {digitalId.chain_id === 31337 ? ' (Local Testnet)' : 
                 digitalId.chain_id === 80002 ? ' (Polygon Amoy)' : ''}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Verification Hash */}
      {digitalId.verification_hash && (
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            <Hash className="w-4 h-4 inline mr-1" />
            Verification Hash
          </label>
          <div className="flex items-center space-x-2">
            <code className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-xs font-mono flex-1 truncate">
              {digitalId.verification_hash}
            </code>
            <button
              onClick={() => copyToClipboard(digitalId.verification_hash!)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Copy Verification Hash"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {digitalId.block_hash && (
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            <Hash className="w-4 h-4 inline mr-1" />
            Block Hash
          </label>
          <div className="flex items-center space-x-2">
            <code className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-xs font-mono flex-1 truncate">
              {digitalId.block_hash}
            </code>
            <button
              onClick={() => copyToClipboard(digitalId.block_hash!)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Copy Block Hash"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          This digital ID is cryptographically secured and can be verified independently.
          {isBlockchainVerified && ' It has been recorded on the blockchain for maximum security.'}
        </p>
      </div>
    </motion.div>
  );
}
