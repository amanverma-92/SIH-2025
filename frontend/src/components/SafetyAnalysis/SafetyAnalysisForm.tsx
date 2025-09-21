'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { apiClient, Tourist, SafetyAnalysisRequest } from '@/utils/api';
import toast from 'react-hot-toast';

interface SafetyAnalysisFormProps {
  tourists: Tourist[];
  onAnalysisComplete: (result: any) => void;
}

interface FormData {
  tourist_id: number;
  speed_kmh: number;
  deviation_m: number;
  stop_duration_min: number;
  safety_score: number;
  area_risk: number;
}

export default function SafetyAnalysisForm({ tourists, onAnalysisComplete }: SafetyAnalysisFormProps) {
  const [formData, setFormData] = useState<FormData>({
    tourist_id: tourists[0]?.id || 0,
    speed_kmh: 0,
    deviation_m: 0,
    stop_duration_min: 0,
    safety_score: 50,
    area_risk: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tourist_id) {
      toast.error('Please select a tourist');
      return;
    }

    setLoading(true);
    try {
      const result = await apiClient.analyzeTouristSafety(formData);
      onAnalysisComplete(result);
      toast.success('Safety analysis completed successfully!');
    } catch (error) {
      console.error('Safety analysis failed:', error);
      toast.error('Failed to analyze tourist safety. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      tourist_id: tourists[0]?.id || 0,
      speed_kmh: 0,
      deviation_m: 0,
      stop_duration_min: 0,
      safety_score: 50,
      area_risk: 0,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tourist Safety Analysis
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analyze tourist safety based on real-time parameters
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetForm}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Reset Form
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tourist Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Tourist *
          </label>
          <select
            value={formData.tourist_id}
            onChange={(e) => handleInputChange('tourist_id', Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          >
            <option value={0}>Select a tourist...</option>
            {tourists.map((tourist) => (
              <option key={tourist.id} value={tourist.id}>
                {tourist.name} (ID: {tourist.id})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Speed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Speed (km/h) *
            </label>
            <input
              type="number"
              min="0"
              max="200"
              value={formData.speed_kmh}
              onChange={(e) => handleInputChange('speed_kmh', Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter speed in km/h"
              required
            />
          </div>

          {/* Deviation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Route Deviation (meters) *
            </label>
            <input
              type="number"
              min="0"
              max="1000"
              value={formData.deviation_m}
              onChange={(e) => handleInputChange('deviation_m', Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter deviation in meters"
              required
            />
          </div>

          {/* Stop Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stop Duration (minutes) *
            </label>
            <input
              type="number"
              min="0"
              max="300"
              value={formData.stop_duration_min}
              onChange={(e) => handleInputChange('stop_duration_min', Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter stop duration in minutes"
              required
            />
          </div>

          {/* Safety Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Safety Score (0-100) *
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.safety_score}
              onChange={(e) => handleInputChange('safety_score', Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter safety score"
              required
            />
            <div className="mt-1">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.safety_score}
                onChange={(e) => handleInputChange('safety_score', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Area Risk */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Area Risk Level (0-100) *
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step='any'
              value={formData.area_risk}
              onChange={(e) => handleInputChange('area_risk', parseFloat(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter area risk level (0 = safe, 1 = very dangerous)"
              required
            />
            <div className="mt-1">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={formData.area_risk}
                onChange={(e) => handleInputChange('area_risk', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Safe (0)</span>
                <span>Very Dangerous (1)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Analyzing Safety...</span>
            </div>
          ) : (
            'Analyze Tourist Safety'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}