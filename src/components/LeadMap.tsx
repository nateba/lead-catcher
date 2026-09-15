import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Lead } from '../types';

interface LeadMapProps {
  leads: Lead[];
  center: { lat: number; lng: number };
  onSelectLead: (lead: Lead) => void;
  onGenerateSite: (lead: Lead) => void;
}

export const LeadMap: React.FC<LeadMapProps> = ({
  leads,
  center,
  onSelectLead,
  onGenerateSite,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom: 13,
        zoomControl: true,
      });

      // Free OpenStreetMap standard tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Center Marker (City Center)
      const centerIcon = L.divIcon({
        className: 'custom-center-marker',
        html: `<div style="background:#4f46e5;color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:10px;font-weight:bold;">★</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      L.marker([center.lat, center.lng], { icon: centerIcon })
        .addTo(map)
        .bindPopup('<b>Centro da Busca</b>');

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([center.lat, center.lng], 13);
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center.lat, center.lng]);

  // Update lead markers when leads array changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const bounds = L.latLngBounds([[center.lat, center.lng]]);

    leads.forEach((lead) => {
      if (!lead.lat || !lead.lng) return;

      bounds.extend([lead.lat, lead.lng]);

      const markerHtml = `
        <div style="background:${lead.avatarBg || '#4f46e5'};color:#ffffff;width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:12px;border:2px solid #ffffff;box-shadow:0 3px 10px rgba(0,0,0,0.3);cursor:pointer;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
          ${lead.initials || 'EP'}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-lead-marker',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([lead.lat, lead.lng], { icon: customIcon });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-slate-900 font-sans';
      popupContent.innerHTML = `
        <div style="min-width: 200px;">
          <div style="font-size: 11px; font-weight: bold; color: #4f46e5; text-transform: uppercase;">${lead.categoryLabel}</div>
          <div style="font-size: 14px; font-weight: 800; margin: 2px 0 4px;">${lead.name}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${lead.address || 'Endereço não informado'}</div>
          ${lead.phone ? `<div style="font-size: 11px; font-weight: 600; color: #0f172a; margin-bottom: 8px;">📞 ${lead.phone}</div>` : ''}
          <div style="display: flex; gap: 6px;">
            <button id="popup-btn-gen-${lead.id}" style="background:#4f46e5;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:bold;cursor:pointer;flex:1;">
              ⚡ Gerar Site
            </button>
            <button id="popup-btn-det-${lead.id}" style="background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;">
              Detalhes
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btnGen = document.getElementById(`popup-btn-gen-${lead.id}`);
        if (btnGen) {
          btnGen.onclick = () => onGenerateSite(lead);
        }
        const btnDet = document.getElementById(`popup-btn-det-${lead.id}`);
        if (btnDet) {
          btnDet.onclick = () => onSelectLead(lead);
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });

    if (leads.length > 0) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [leads, center.lat, center.lng, onGenerateSite, onSelectLead]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute top-3 right-3 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow text-xs font-semibold text-slate-700 dark:text-slate-200">
        📍 {leads.length} empresas mapeadas
      </div>
    </div>
  );
};
