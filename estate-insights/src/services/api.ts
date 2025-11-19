// src/services/api.ts

const API_BASE_URL = 'https://real-estate-app-ql5f.onrender.com/api';

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

export interface AnalysisResponse {
  area: string;
  summary: string;
  chartData: ChartDataPoint[];
  tableData: TableDataRow[];
  query: string;
  recordCount: number;
  yearRange: string;
}

// Analyze query function
export const analyzeQuery = async (query: string): Promise<AnalysisResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Response:', data); // Debug log
    return data;
  } catch (error: any) {
    console.error('❌ API Error:', error);
    throw new Error(error.message || 'Failed to analyze query');
  }
};

// Get available areas
export const getAvailableAreas = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/areas/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch areas');
    }
    
    const data = await response.json();
    return data.areas;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const generateAISummary = async (area: string, data: any): Promise<{ aiSummary: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-summary/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ area, data }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate AI summary');
    }

    return await response.json();
  } catch (error: any) {
    console.error('AI Summary Error:', error);
    throw new Error(error.message || 'Failed to generate AI summary');
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health/`);
    const data = await response.json();
    console.log('✅ Health Check:', data);
    return data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};
