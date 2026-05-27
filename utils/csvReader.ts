import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface PatientData {
  firstName: string;
  lastName: string;
  birthdate: string;
  email: string;
  phone: string;
  street1: string;        // 🔧 NEW
  city: string;
  stateProvince: string;  // 🔧 NEW
  postalCode: string;     // 🔧 NEW
  country: string;
}



export function readPatientsFromCSV(filename: string): PatientData[] {
  const filePath = path.join(process.cwd(), 'test-data', 'csv', filename);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const records = parse(fileContent, {
    columns: true,        // first row = column names
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`📊 Loaded ${records.length} patients from ${filename}`);
  return records as PatientData[];
}