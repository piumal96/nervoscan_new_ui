export interface AverageScanData {
  hr: string;
  sdnn: string;
  spo2: string;
  healthScore: number;
  stress_level: string;
  sbp: string;
  dbp: string;
  blood_pressure_level: string;
  rmssd: string;
  rr: string;
  hba1c: string;
  hemoglobin: string;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  unit: string;
  subtitle: string;
  color: string;
  category?: string;
  showGraph?: boolean;
  status?: 'normal' | 'warning' | 'critical';
  info?: string;
}

export const sampleData: AverageScanData = {
  hr: "72",
  sdnn: "45",
  spo2: "98",
  healthScore: 85.5,
  stress_level: "Low",
  sbp: "120",
  dbp: "80",
  blood_pressure_level: "Normal",
  rmssd: "50",
  rr: "16",
  hba1c: "5.5",
  hemoglobin: "13.5",
};
