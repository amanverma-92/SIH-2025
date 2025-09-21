'use client';

import React, { useState } from 'react';
import { Search, User, Mail, Phone, MapPin, Calendar, Activity, Plus, Edit, Trash2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Tourist, CreateTouristData, UpdateTouristData, Alert } from '@/utils/api';
import { cn } from '@/utils/cn';
import TouristForm from '../TouristManagement/TouristForm';
import { PDFGenerator } from '@/utils/pdfGenerator';
import toast from 'react-hot-toast';

interface TouristSearchProps {
  tourists: Tourist[];
  onTouristSelect: (tourist: Tourist) => void;
  selectedTourist?: Tourist | null;
  loading?: boolean;
  onTouristCreate?: (tourist: CreateTouristData) => Promise<void>;
  onTouristUpdate?: (id: number, tourist: UpdateTouristData) => Promise<void>;
  onTouristDelete?: (id: number) => Promise<void>;
  alerts?: Alert[];
}

export default function TouristSearch({ 
  tourists, 
  onTouristSelect, 
  selectedTourist, 
  loading = false,
  onTouristCreate,
  onTouristUpdate,
  onTouristDelete,
  alerts = []
}: TouristSearchProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTourist, setEditingTourist] = useState<Tourist | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTourists = tourists.filter(tourist =>
    tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tourist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tourist.id.toString().includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'emergency':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  const handleCreateTourist = async (data: CreateTouristData | UpdateTouristData) => {
    if (!onTouristCreate) return;
    
    try {
      setIsSubmitting(true);
      await onTouristCreate(data as CreateTouristData);
      setShowForm(false);
      toast.success('Tourist created successfully!');
    } catch (error) {
      toast.error('Failed to create tourist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTourist = async (data: UpdateTouristData) => {
    if (!onTouristUpdate || !editingTourist) return;
    
    try {
      setIsSubmitting(true);
      await onTouristUpdate(editingTourist.id, data);
      setEditingTourist(null);
      toast.success('Tourist updated successfully!');
    } catch (error) {
      toast.error('Failed to update tourist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTourist = async (tourist: Tourist) => {
    if (!onTouristDelete) return;
    
    if (window.confirm(`Are you sure you want to delete ${tourist.name}?`)) {
      try {
        await onTouristDelete(tourist.id);
        toast.success('Tourist deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete tourist');
      }
    }
  };

  const handleGeneratePDF = async (tourist: Tourist) => {
    try {
      const touristAlerts = alerts.filter(alert => alert.tourist_id === tourist.id);
      const doc = await PDFGenerator.generateTouristReport(tourist, touristAlerts);
      PDFGenerator.downloadPDF(doc, `tourist-report-${tourist.name}-${Date.now()}.pdf`);
      toast.success('PDF generated successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tourist Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Search and manage tourists</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Add Tourist</span>
        </motion.button>
      </div>
      
      {/* Search Input */}
      <motion.div 
        className="relative mb-6"
        whileFocus={{ scale: 1.02 }}
      >
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search tourists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl"
        />
      </motion.div>

      {/* Tourist List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Loading...</p>
          </div>
        ) : filteredTourists.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <User className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            <p>No tourists found</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredTourists.map((tourist) => (
              <motion.div
                key={tourist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ 
                  y: -4,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTouristSelect(tourist)}
                className={cn(
                  'p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 group relative overflow-hidden',
                  selectedTourist?.id === tourist.id
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 dark:border-blue-400 shadow-xl'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-700/50 dark:hover:to-blue-900/20 shadow-lg hover:shadow-xl'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{tourist.name}</h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3 h-3" />
                        <span>{tourist.email}</span>
                      </div>
                      {tourist.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3 h-3" />
                          <span>{tourist.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3 h-3" />
                        <span>{tourist.latitude.toFixed(4)}, {tourist.longitude.toFixed(4)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(tourist.last_location_update).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(tourist.status)
                    )}>
                      <Activity className="w-3 h-3 mr-1" />
                      {tourist.status}
                    </span>
                    
                    {/* Action Buttons */}
                    <motion.div 
                      className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      initial={{ opacity: 0, x: 10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGeneratePDF(tourist);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300"
                        title="Generate PDF"
                      >
                        <FileText className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTourist(tourist);
                        }}
                        className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-xl transition-all duration-300"
                        title="Edit Tourist"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTourist(tourist);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300"
                        title="Delete Tourist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Forms */}
      <AnimatePresence>
        {showForm && (
          <TouristForm
            onSubmit={handleCreateTourist}
            onCancel={() => setShowForm(false)}
            isLoading={isSubmitting}
            isEdit={false}
          />
        )}
        
        {editingTourist && (
          <TouristForm
            tourist={editingTourist}
            digitalId={editingTourist.digital_id}
            onSubmit={handleUpdateTourist}
            onCancel={() => setEditingTourist(null)}
            isLoading={isSubmitting}
            isEdit={true}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}