'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getTouristPathData, PathPoint, TouristPathData } from '@/data/touristPaths';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Tourist {
  id: number;
  name: string;
  email: string;
  phone?: string;
  latitude: number;
  longitude: number;
  status: string;
  last_location_update: string;
  emergency_contact?: string;
  created_at: string;
  digital_id?: string;
  block_hash?: string;
}

interface RiskZone {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  radius: number;
  created_at: string;
}

interface TouristMapProps {
  tourists: Tourist[];
  selectedTourist?: Tourist | null;
  onTouristSelect?: (tourist: Tourist) => void;
  riskZones?: RiskZone[];
}

const TouristMap: React.FC<TouristMapProps> = ({ tourists, selectedTourist, onTouristSelect, riskZones = [] }) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [selectedTouristPath, setSelectedTouristPath] = useState<TouristPathData | null>(null);

  useEffect(() => {
    if (selectedTourist) {
      setMapCenter([selectedTourist.latitude, selectedTourist.longitude]);
      setMapZoom(10);
      
      // Load path data for selected tourist
      const pathData = getTouristPathData(selectedTourist.id);
      setSelectedTouristPath(pathData);
    } else {
      setSelectedTouristPath(null);
      if (tourists.length > 0) {
        // Calculate center based on all tourists
        const avgLat = tourists.reduce((sum, tourist) => sum + tourist.latitude, 0) / tourists.length;
        const avgLng = tourists.reduce((sum, tourist) => sum + tourist.longitude, 0) / tourists.length;
        setMapCenter([avgLat, avgLng]);
        setMapZoom(3);
      }
    }
  }, [tourists, selectedTourist]);

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'gray';
      case 'emergency':
        return 'red';
      default:
        return 'blue';
    }
  };

  const createCustomIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  const createAnomalyIcon = (anomalyType: string) => {
    const colors = {
      'Drop-off': '#ef4444', // red
      'Jump': '#f59e0b', // amber
      'Inactivity': '#8b5cf6', // violet
      'Deviation': '#06b6d4', // cyan
    };
    
    const icons = {
      'Drop-off': '⬇️',
      'Jump': '⬆️',
      'Inactivity': '⏸️',
      'Deviation': '↗️',
    };

    return L.divIcon({
      className: 'custom-anomaly-icon',
      html: `<div style="
        background-color: ${colors[anomalyType as keyof typeof colors]};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
      ">${icons[anomalyType as keyof typeof icons]}</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const createPathPointIcon = (index: number, total: number) => {
    const isStart = index === 0;
    const isEnd = index === total - 1;
    const color = isStart ? '#10b981' : isEnd ? '#ef4444' : '#3b82f6';
    const size = isStart || isEnd ? 12 : 6;
    
    return L.divIcon({
      className: 'custom-path-icon',
      html: `<div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  return (
    <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden relative">
      {/* Legend */}
      {selectedTouristPath && selectedTourist && (
        <div className="absolute top-4 right-4 z-[1000] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Path Legend</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
              <span className="text-gray-700 dark:text-gray-300">Start Point</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
              <span className="text-gray-700 dark:text-gray-300">Path Points</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
              <span className="text-gray-700 dark:text-gray-300">End Point</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">⬇️</div>
              <span className="text-gray-700 dark:text-gray-300">Drop-off</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">⬆️</div>
              <span className="text-gray-700 dark:text-gray-300">Jump</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">⏸️</div>
              <span className="text-gray-700 dark:text-gray-300">Inactivity</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-cyan-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">↗️</div>
              <span className="text-gray-700 dark:text-gray-300">Deviation</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Path: {selectedTouristPath.tourist_path.length} points
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Anomalies: {Object.values(selectedTouristPath.anomalies).flat().length}
            </p>
          </div>
        </div>
      )}

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Risk Zones */}
        {riskZones.map((riskZone) => (
          <Circle
            key={`risk-zone-${riskZone.id}`}
            center={[riskZone.latitude, riskZone.longitude]}
            radius={riskZone.radius * 1000} // Convert km to meters
            pathOptions={{
              color: '#f59e0b',
              fillColor: '#fbbf24',
              fillOpacity: 0.2,
              weight: 2,
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-lg text-orange-600">{riskZone.name}</h3>
                <p className="text-sm text-gray-600">{riskZone.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Radius: {riskZone.radius}km
                </p>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Tourist Path Visualization */}
        {selectedTouristPath && selectedTourist && (
          <>
            {/* Path Line */}
            <Polyline
              positions={selectedTouristPath.tourist_path.map(point => [point.lat, point.lon])}
              pathOptions={{
                color: '#3b82f6',
                weight: 3,
                opacity: 0.8,
                dashArray: '5, 5'
              }}
            />
            
            {/* Path Points */}
            {selectedTouristPath.tourist_path.map((point, index) => (
              <Marker
                key={`path-${index}`}
                position={[point.lat, point.lon]}
                icon={createPathPointIcon(index, selectedTouristPath.tourist_path.length)}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-sm">Path Point #{index + 1}</h3>
                    <p className="text-xs text-gray-600">Time: {point.time}</p>
                    <p className="text-xs text-gray-600">Coordinates: {point.lat.toFixed(6)}, {point.lon.toFixed(6)}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Anomaly Markers */}
            {Object.entries(selectedTouristPath.anomalies).map(([anomalyType, points]) =>
              points.map((point, index) => (
                <Marker
                  key={`anomaly-${anomalyType}-${index}`}
                  position={[point.lat, point.lon]}
                  icon={createAnomalyIcon(anomalyType)}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold text-sm text-red-600">{anomalyType} Anomaly</h3>
                      <p className="text-xs text-gray-600">Time: {point.time}</p>
                      <p className="text-xs text-gray-600">Coordinates: {point.lat.toFixed(6)}, {point.lon.toFixed(6)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Tourist: {selectedTourist.name}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))
            )}
          </>
        )}

        {/* Tourists */}
        {tourists.map((tourist) => (
          <Marker
            key={tourist.id}
            position={[tourist.latitude, tourist.longitude]}
            icon={createCustomIcon(getMarkerColor(tourist.status))}
            eventHandlers={{
              click: () => onTouristSelect?.(tourist),
            }}
          >
            <Popup>
              <div className="p-2">
                <p className="text-sm text-gray-600">{tourist.email}</p>
                <h3 className="font-semibold text-lg">{tourist.name}</h3>
                <p className="text-sm text-gray-600">"hello"</p>
                <p className="text-sm">
                  Status: <span className={`font-medium ${
                    tourist.status === 'active' ? 'text-green-600' :
                    tourist.status === 'emergency' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {tourist.status}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Last update: {new Date(tourist.last_location_update).toLocaleString()}
                </p>
                {selectedTouristPath && tourist.id === selectedTourist?.id && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-blue-600 font-medium">Path tracking active</p>
                    <p className="text-xs text-gray-500">
                      {selectedTouristPath.tourist_path.length} points tracked
                    </p>
                    <p className="text-xs text-gray-500">
                      {Object.values(selectedTouristPath.anomalies).flat().length} anomalies detected
                    </p>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TouristMap;
