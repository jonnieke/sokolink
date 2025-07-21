import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { XIcon, MapPinIcon } from 'lucide-react';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (lat: number, lng: number) => void;
}

const LocationMarker: React.FC<{ position: [number, number] | null, setPosition: (pos: [number, number]) => void }> = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({ isOpen, onClose, onLocationSelect }) => {
  // Default to Nairobi, Kenya
  const defaultPosition: [number, number] = [-1.286389, 36.817223];
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
      // Reset position when modal is opened
      if(isOpen) {
          setPosition(null);
      }
  }, [isOpen]);

  const handleConfirm = () => {
    if (position) {
      onLocationSelect(position[0], position[1]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col h-[80vh] max-h-[600px]">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <MapPinIcon className="w-6 h-6 text-teal-500" />
            <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">Pin Your Location</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 relative">
            <MapContainer center={defaultPosition} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
            {!position && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 shadow-md">
                    Click on the map to place a pin.
                </div>
            )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                Cancel
            </button>
            <button onClick={handleConfirm} disabled={!position} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                Confirm Location
            </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerModal;
