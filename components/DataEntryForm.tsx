import React, { useState } from 'react';
import { ReadingType, BloodSugarContext, type HealthReading } from '../types.ts';

interface DataEntryFormProps {
  onAddReading: (reading: HealthReading) => void;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-[#49454F] mb-1">{label}</label>
        <input 
            {...props}
            className="w-full bg-[#E7E0EC] border-2 border-transparent focus:ring-2 focus:ring-[#6750A4] focus:border-[#6750A4] text-[#1C1B1F] placeholder:text-[#49454F] rounded-lg p-3 outline-none transition"
        />
    </div>
);

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: React.ReactNode }> = ({ label, children, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-[#49454F] mb-1">{label}</label>
        <select
            {...props}
            className="w-full bg-[#E7E0EC] border-2 border-transparent focus:ring-2 focus:ring-[#6750A4] focus:border-[#6750A4] text-[#1C1B1F] rounded-lg p-3 outline-none appearance-none"
        >
            {children}
        </select>
    </div>
);


export const DataEntryForm: React.FC<DataEntryFormProps> = ({ onAddReading }) => {
  const [formType, setFormType] = useState<ReadingType>(ReadingType.BloodPressure);

  // BP state
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');

  // BS state
  const [glucose, setGlucose] = useState('');
  const [context, setContext] = useState<BloodSugarContext>(BloodSugarContext.FASTING);

  const resetForm = () => {
    setSystolic('');
    setDiastolic('');
    setPulse('');
    setGlucose('');
    setContext(BloodSugarContext.FASTING);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = Date.now();
    const id = `reading_${timestamp}`;

    if (formType === ReadingType.BloodPressure) {
      if (!systolic || !diastolic || !pulse) return;
      onAddReading({
        id,
        type: ReadingType.BloodPressure,
        timestamp,
        systolic: parseInt(systolic),
        diastolic: parseInt(diastolic),
        pulse: parseInt(pulse)
      });
    } else {
      if (!glucose) return;
      onAddReading({
        id,
        type: ReadingType.BloodSugar,
        timestamp,
        glucose: parseInt(glucose),
        context
      });
    }
    resetForm();
  };
  
  const isBpFormValid = systolic && diastolic && pulse;
  const isBsFormValid = glucose;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex w-full bg-[#E7E0EC] rounded-full p-1">
        <button
          type="button"
          onClick={() => setFormType(ReadingType.BloodPressure)}
          className={`w-1/2 p-2 rounded-full font-medium text-center transition-colors duration-300 ${formType === ReadingType.BloodPressure ? 'bg-[#D0BCFF] text-[#21005D]' : 'text-[#49454F]'}`}
        >
          Presión Arterial
        </button>
        <button
          type="button"
          onClick={() => setFormType(ReadingType.BloodSugar)}
          className={`w-1/2 p-2 rounded-full font-medium text-center transition-colors duration-300 ${formType === ReadingType.BloodSugar ? 'bg-[#D0BCFF] text-[#21005D]' : 'text-[#49454F]'}`}
        >
          Azúcar en Sangre
        </button>
      </div>
      
      {formType === ReadingType.BloodPressure ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField label="Sistólica (mmHg)" type="number" value={systolic} onChange={e => setSystolic(e.target.value)} required />
            <InputField label="Diastólica (mmHg)" type="number" value={diastolic} onChange={e => setDiastolic(e.target.value)} required />
            <InputField label="Pulso (LPM)" type="number" value={pulse} onChange={e => setPulse(e.target.value)} required />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Glucosa (mg/dL)" type="number" value={glucose} onChange={e => setGlucose(e.target.value)} required />
            <SelectField label="Contexto" value={context} onChange={e => setContext(e.target.value as BloodSugarContext)}>
              {Object.values(BloodSugarContext).map(ctx => <option key={ctx} value={ctx}>{ctx}</option>)}
            </SelectField>
        </div>
      )}

      <button
        type="submit"
        disabled={formType === ReadingType.BloodPressure ? !isBpFormValid : !isBsFormValid}
        className="w-full mt-4 bg-[#6750A4] text-white font-bold py-3 px-4 rounded-full shadow-lg hover:bg-[#58448f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6750A4] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
      >
        Guardar Lectura
      </button>
    </form>
  );
};