// src/types/analysis.ts

export interface ChartDataPoint {
  year: number;
  totalSales: number;
  totalSold: number;
  flatRate: number;
  officeRate?: number;
  shopRate?: number;
  carpetArea?: number;
}

export interface TableDataRow {
  
  Year: number;
  Area: string;
  "Total Sales (₹ Cr)": string;
  "Units Sold": number;
  "Flat Rate (₹/sqft)": string;
  "Carpet Area (sqft)"?: string;
  "Office Rate (₹/sqft)"?: string;
  "Shop Rate (₹/sqft)"?: string;
}

// ✅ This matches Django backend response exactly
export interface AnalysisResponse {
  area: string;
  summary: string;
  chartData: ChartDataPoint[];
  tableData: TableDataRow[];
  query: string;
  recordCount: number;
  yearRange: string;
  aiGenerated?: boolean;  // Add this
  basicSummary?: string;  // Optional fallback
}


export interface ApiError {
  message: string;
  status?: number;
}
