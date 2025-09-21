'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
// Icons are optional; fallback if not installed
const MapPin = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 8.6a8 8 0 1 0-12.85 9.4L12 22l4.43-3.99a8 8 0 0 0 3.99-9.41Z"/><circle cx="12" cy="10" r="3"/></svg>
);
const Download = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import StatsCards from '@/components/Dashboard/StatsCards';
import TouristSearch from '@/components/Search/TouristSearch';
import AlertsFeed from '@/components/Dashboard/AlertsFeed';
import RiskZoneManager from '@/components/RiskZones/RiskZoneManager';
import SafetyAnalysisManager from '@/components/SafetyAnalysis/SafetyAnalysisManager';
import EmergencyAccess from '@/components/Emergency/EmergencyAccess';
import EFIRForm from '@/components/Emergency/EFIRForm';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import { apiClient, Tourist, Alert, RiskZone, Stats, CreateTouristData, UpdateTouristData, CreateRiskZoneData } from '@/utils/api';

// Client-only map to avoid SSR issues
const TouristMap = dynamic(() => import('@/components/Map/TouristMap'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
      </div>
    </div>
  ),
});

export default function Dashboard() {
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_tourists: 0,
    active_tourists: 0,
    total_alerts: 0,
    unresolved_alerts: 0,
    risk_zones: 0,
  });
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null);
  const [activeTab, setActiveTab] = useState<'tourists' | 'risk-zones' | 'safety-analysis'>('tourists');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadDashboardData();
  }, []);

  async function loadDashboardData(): Promise<void> {
    try {
      setLoading(true);
      setError(null);
      const [tData, aData, rzData, sData] = await Promise.all([
        apiClient.getTourists(),
        apiClient.getAlerts(),
        apiClient.getRiskZones(),
        apiClient.getStats(),
      ]);
      setTourists(Array.isArray(tData) ? tData : []);
      setAlerts(Array.isArray(aData) ? aData : []);
      setRiskZones(Array.isArray(rzData) ? rzData : []);
      setStats((sData as Stats) ?? { total_tourists: 0, active_tourists: 0, unresolved_alerts: 0, risk_zones: 0 });
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load dashboard data. Please try again.');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTourist(data: CreateTouristData): Promise<void> {
    const created = await apiClient.createTourist(data);
    setTourists(prev => [...prev, created]);
  }

  async function handleUpdateTourist(id: number, data: UpdateTouristData): Promise<void> {
    const updated = await apiClient.updateTourist(id, data);
    setTourists(prev => prev.map(t => (t.id === id ? updated : t)));
  }

  async function handleDeleteTourist(id: number): Promise<void> {
    await apiClient.deleteTourist(id);
    setTourists(prev => prev.filter(t => t.id !== id));
    if (selectedTourist?.id === id) setSelectedTourist(null);
  }

  async function handleCreateRiskZone(data: CreateRiskZoneData): Promise<void> {
    const created = await apiClient.createRiskZone(data);
    setRiskZones(prev => [...prev, created]);
  }

  async function handleUpdateRiskZone(id: number, data: Partial<CreateRiskZoneData>): Promise<void> {
    const updated = await apiClient.updateRiskZone(id, data);
    setRiskZones(prev => prev.map(rz => (rz.id === id ? updated : rz)));
  }

  async function handleDeleteRiskZone(id: number): Promise<void> {
    await apiClient.deleteRiskZone(id);
    setRiskZones(prev => prev.filter(rz => rz.id !== id));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                    Tourist Safety Dashboard
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Real-time monitoring and management</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => toast.success('Export coming soon')}
              >
                <Download className="w-4 h-4" />
                <span className="font-medium">Export PDF</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards stats={stats} loading={loading} />

        {/* Map Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tourist Locations & Risk Zones</h2>
            <div className="h-96 rounded-xl overflow-hidden">
              <TouristMap
                tourists={tourists}
                riskZones={riskZones}
                onTouristSelect={setSelectedTourist}
                selectedTourist={selectedTourist}
              />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('tourists')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tourists'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Tourist Management
              </button>
              <button
                onClick={() => setActiveTab('risk-zones')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'risk-zones'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Risk Zone Management
              </button>
              <button
                onClick={() => setActiveTab('safety-analysis')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'safety-analysis'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Safety Analysis
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {activeTab === 'tourists' ? (
            <>
              <div className="lg:col-span-2 space-y-6">
                <TouristSearch
                  tourists={tourists}
                  onTouristSelect={setSelectedTourist}
                  selectedTourist={selectedTourist}
                  loading={loading}
                  onTouristCreate={handleCreateTourist}
                  onTouristUpdate={handleUpdateTourist}
                  onTouristDelete={handleDeleteTourist}
                  alerts={alerts}
                />
                {/* Move E-FIR to the left column to utilize space */}
                <EFIRForm tourists={tourists} />
              </div>
              <div className="lg:col-span-1 space-y-6">
                <AlertsFeed alerts={alerts} loading={loading} />
                <EmergencyAccess
                  tourists={tourists}
                  onAlertCreated={(a) => setAlerts((prev) => [a, ...prev])}
                />
              </div>
            </>
          ) : activeTab === 'risk-zones' ? (
            <div className="lg:col-span-3">
              <RiskZoneManager
                riskZones={riskZones}
                onRiskZoneCreate={handleCreateRiskZone}
                onRiskZoneUpdate={handleUpdateRiskZone}
                onRiskZoneDelete={handleDeleteRiskZone}
                loading={loading}
              />
            </div>
          ) : (
            <div className="lg:col-span-3">
              <SafetyAnalysisManager
                tourists={tourists}
                loading={loading}
                onAlertCreated={(alert) => setAlerts((prev) => [alert, ...prev])}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
