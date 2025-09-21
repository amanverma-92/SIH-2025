'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SafetyAnalysisResponse } from '@/utils/api';

interface SafetyAnalysisResultsProps {
  result: SafetyAnalysisResponse | null;
  alertCreated?: boolean;
}

export default function SafetyAnalysisResults({ result, alertCreated }: SafetyAnalysisResultsProps) {
  if (!result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
      >
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Analysis Results
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Submit the safety analysis form to see results here
          </p>
        </div>
      </motion.div>
    );
  }

  const { data } = result;

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'HIGH':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
      case 'CRITICAL':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'MEDIUM':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'HIGH':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'CRITICAL':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Safety Analysis Results
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Analysis completed at {new Date(data.timestamp).toLocaleString()}
        </p>
      </div>

      {/* Risk Level Badge */}
      <div className="mb-6">
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${getRiskColor(data.risk_level)}`}>
          {getRiskIcon(data.risk_level)}
          <span>Risk Level: {data.risk_level}</span>
        </div>
        
        {/* Alert Created Notification */}
        {alertCreated && (data.risk_level === 'HIGH' || data.risk_level === 'CRITICAL') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 inline-flex items-center space-x-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Alert automatically created and added to alerts feed</span>
          </motion.div>
        )}
      </div>

      {/* Main Message */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-gray-900 dark:text-white font-medium">
          {data.message}
        </p>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Combined Score</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {(data.combined_score * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">ML Anomaly Score</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {(data.ml_anomaly_score * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Rule Score</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {(data.rule_score * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Input Data */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Input Parameters</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Speed</h4>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {data.input_data.speed_kmh} km/h
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Deviation</h4>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {data.input_data.deviation_m} m
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Stop Duration</h4>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {data.input_data.stop_duration_min} min
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Safety Score</h4>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {data.input_data.safety_score}/100
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Area Risk</h4>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {data.input_data.area_risk}/1
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h3>
          <div className="space-y-2">
            {data.recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
              >
                <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-900 dark:text-white text-sm">{recommendation}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Alert Status */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${data.alert_required ? 'bg-red-500' : 'bg-green-500'}`}></div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Alert Status: {data.alert_required ? 'Alert Required' : 'No Alert Needed'}
          </span>
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-400">
          Tourist ID: {data.tourist_id}
        </span>
      </div>

      {/* Active Alerts */}
      {data.active_alerts && data.active_alerts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Alerts</h3>
          <div className="space-y-2">
            {data.active_alerts.map((alert: any, index: number) => (
              <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-200 text-sm">{JSON.stringify(alert)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
