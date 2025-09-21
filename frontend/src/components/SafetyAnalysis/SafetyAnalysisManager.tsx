'use client';

import React, { useState } from 'react';
import { Tourist, SafetyAnalysisResponse, Alert } from '@/utils/api';
import SafetyAnalysisForm from './SafetyAnalysisForm';
import SafetyAnalysisResults from './SafetyAnalysisResults';
import toast from 'react-hot-toast';

interface SafetyAnalysisManagerProps {
  tourists: Tourist[];
  loading: boolean;
  onAlertCreated?: (alert: Alert) => void;
}

export default function SafetyAnalysisManager({ tourists, loading, onAlertCreated }: SafetyAnalysisManagerProps) {
  const [analysisResult, setAnalysisResult] = useState<SafetyAnalysisResponse | null>(null);
  const [alertCreated, setAlertCreated] = useState(false);

  const handleAnalysisComplete = async (result: SafetyAnalysisResponse) => {
    setAnalysisResult(result);
    setAlertCreated(false); // Reset alert created flag
    
    // Check if risk level is HIGH or CRITICAL and create an alert
    if (result.data.risk_level === 'HIGH' || result.data.risk_level === 'CRITICAL') {
      try {
        const alertData = {
          tourist_id: result.data.tourist_id,
          alert_type: 'safety_analysis_high_risk',
          message: result.data.message,
          severity: result.data.risk_level.toLowerCase(),
          is_resolved: 'false'
        };
        
        // Import apiClient dynamically to avoid circular imports
        const { apiClient } = await import('@/utils/api');
        const newAlert = await apiClient.createAlert(alertData);
        
        // Notify parent component about the new alert
        if (onAlertCreated) {
          onAlertCreated(newAlert);
        }
        
        setAlertCreated(true);
        toast.success(`🚨 Alert created for ${result.data.risk_level} risk level!`);
      } catch (error) {
        console.error('Failed to create alert:', error);
        toast.error('Failed to create alert for high risk level');
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (tourists.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 border border-gray-100 dark:border-gray-700 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Tourists Available
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Please add some tourists first before performing safety analysis
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Column */}
      <div className="space-y-6">
        <SafetyAnalysisForm 
          tourists={tourists} 
          onAnalysisComplete={handleAnalysisComplete}
        />
      </div>

      {/* Results Column */}
      <div className="space-y-6">
        <SafetyAnalysisResults result={analysisResult} alertCreated={alertCreated} />
      </div>
    </div>
  );
}
