import type { UserProfile, BloodPressureReading, BloodSugarReading } from '../types.ts';

// jsPDF is loaded from CDN, so we declare it to satisfy TypeScript
declare const jspdf: any;

export const exportToPDF = (profile: UserProfile) => {
  const doc = new jspdf.jsPDF();
  
  const title = `Informe de Salud para ${profile.name}`;
  const generatedDate = `Generado el: ${new Date().toLocaleDateString('es-ES')}`;

  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(generatedDate, 14, 30);

  const bpReadings = profile.readings.filter(r => r.type === 'BLOOD_PRESSURE') as BloodPressureReading[];
  const bsReadings = profile.readings.filter(r => r.type === 'BLOOD_SUGAR') as BloodSugarReading[];

  let lastY = 30; // Posición Y después del texto del encabezado principal

  if (bpReadings.length > 0) {
    const tableTitle = "Lecturas de Presión Arterial";
    const head = [['Fecha', 'Hora', 'Sistólica (mmHg)', 'Diastólica (mmHg)', 'Pulso (LPM)']];
    const body = bpReadings.map(r => [
      new Date(r.timestamp).toLocaleDateString('es-ES'),
      new Date(r.timestamp).toLocaleTimeString('es-ES'),
      r.systolic,
      r.diastolic,
      r.pulse
    ]);

    lastY += 15; // Añadir espacio antes del subtítulo
    doc.setFontSize(14);
    doc.text(tableTitle, 14, lastY);
    lastY += 5; // Añadir espacio antes de la tabla

    (doc as any).autoTable({
      startY: lastY,
      head: head,
      body: body,
      headStyles: { fillColor: [103, 80, 164] },
    });
    lastY = (doc as any).lastAutoTable.finalY;
  }

  if (bsReadings.length > 0) {
    const tableTitle = "Lecturas de Azúcar en Sangre";
    const head = [['Fecha', 'Hora', 'Glucosa (mg/dL)', 'Contexto']];
    const body = bsReadings.map(r => [
      new Date(r.timestamp).toLocaleDateString('es-ES'),
      new Date(r.timestamp).toLocaleTimeString('es-ES'),
      r.glucose,
      r.context
    ]);
    
    lastY += 15; // Añadir espacio entre tablas

    // Añadir una nueva página si la siguiente tabla no cabe
    if (lastY > 260) {
      doc.addPage();
      lastY = 22; // Reiniciar Y para la nueva página
    }

    doc.setFontSize(14);
    doc.text(tableTitle, 14, lastY);
    lastY += 5;

    (doc as any).autoTable({
      startY: lastY,
      head: head,
      body: body,
      headStyles: { fillColor: [103, 80, 164] },
    });
  }
  
  doc.save(`Informe_Salud_${profile.name.replace(/\s/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`);
};