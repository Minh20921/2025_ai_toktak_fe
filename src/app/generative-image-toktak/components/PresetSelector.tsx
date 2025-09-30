import React from 'react';
import type { Preset } from '../types';

interface PresetSelectorProps {
  presets: Preset[];
  selectedPreset: Preset | null;
  onSelectPreset: (preset: Preset) => void;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({ presets, selectedPreset, onSelectPreset }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-center mb-1 text-slate-900">2. 스타일 선택하기</h2>
      <p className="text-center text-slate-600 mb-6">사진에 적용할 테마를 선택해주세요.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {presets.map((preset) => (
          <div
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            className={`cursor-pointer group bg-white border border-slate-200 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-1 transition-all duration-300 ${
              selectedPreset?.id === preset.id ? 'ring-4 ring-indigo-500' : 'ring-2 ring-transparent hover:ring-indigo-400'
            }`}
          >
            <div className="relative">
              <img src={preset.imageUrl} alt={preset.title} className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-slate-800">{preset.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{preset.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PresetSelector;