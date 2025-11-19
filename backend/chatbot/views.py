"""
API Views for Real Estate Chatbot
Enhanced with rich, interactive response data
"""

from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, JSONParser
from django.http import HttpResponse
from django.conf import settings

import pandas as pd
import numpy as np
import os
import re
import csv
from datetime import datetime

from .groq_helper import generate_ai_summary, generate_comparison_summary

# ========================
# Configuration
# ========================
EXCEL_FILE_PATH = os.path.join(settings.BASE_DIR, 'data', 'realestate_data.xlsx')

# ========================
# Helper Functions
# ========================

def load_excel_data():
    """Load Excel dataset and return DataFrame"""
    try:
        if not os.path.exists(EXCEL_FILE_PATH):
            print(f"❌ ERROR: Excel file not found at {EXCEL_FILE_PATH}")
            return None
        
        df = pd.read_excel(EXCEL_FILE_PATH)
        df.columns = df.columns.str.strip()
        
        column_mapping = {
            'final location': 'area',
            'total_sales - igr': 'total_sales',
            'total sold - igr': 'total_sold',
            'flat - weighted average rate': 'flat_avg_rate',
            'office - weighted average rate': 'office_avg_rate',
            'shop - weighted average rate': 'shop_avg_rate',
            'total carpet area supplied (sqft)': 'total_carpet_area',
        }
        
        for old_name, new_name in column_mapping.items():
            if old_name in df.columns:
                df.rename(columns={old_name: new_name}, inplace=True)
        
        df = df.dropna(subset=['area', 'year'])
        df['area'] = df['area'].astype(str).str.strip()
        
        numeric_cols = ['total_sales', 'total_sold', 'flat_avg_rate', 'office_avg_rate', 
                       'shop_avg_rate', 'total_carpet_area']
        
        for col in numeric_cols:
            if col in df.columns:
                if df[col].dtype == 'object':
                    df[col] = df[col].astype(str).str.replace(',', '').replace('', '0')
                df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
        
        print(f"✅ Successfully loaded {len(df)} records from {df['area'].nunique()} areas")
        return df
        
    except Exception as e:
        print(f"❌ ERROR loading Excel: {str(e)}")
        return None

def extract_area_from_query(query, df):
    """Extract area name from user query"""
    query_lower = query.lower()
    available_areas = df['area'].unique()
    
    for area in available_areas:
        if area.lower() in query_lower:
            return area
    return None

def extract_multiple_areas(query, df):
    """Extract multiple area names from query (for comparison)"""
    query_lower = query.lower()
    available_areas = df['area'].unique()
    found_areas = []
    
    for area in available_areas:
        if area.lower() in query_lower:
            found_areas.append(area)
    
    return found_areas

def generate_summary(df, area):
    """Generate natural language summary"""
    if df.empty:
        return f"No data found for {area}."
    
    years_range = f"{int(df['year'].min())}-{int(df['year'].max())}"
    total_years = df['year'].nunique()
    total_sales_value = df['total_sales'].sum() / 10000000
    avg_annual_sales = total_sales_value / total_years
    total_units_sold = df['total_sold'].sum()
    avg_annual_units = total_units_sold / total_years
    avg_flat_rate = df['flat_avg_rate'].mean()
    
    flat_rate_change = 0
    if len(df) > 1 and df['flat_avg_rate'].iloc[0] > 0:
        flat_rate_change = ((df['flat_avg_rate'].iloc[-1] - df['flat_avg_rate'].iloc[0]) / 
                           df['flat_avg_rate'].iloc[0]) * 100
    
    price_trend = "stable"
    if flat_rate_change > 5:
        price_trend = "increasing"
    elif flat_rate_change < -5:
        price_trend = "decreasing"
    
    summary = f"""📍 Real Estate Analysis: {area}
{'='*60}

⏰ Time Period: {years_range} ({total_years} years of data)

💰 FINANCIAL OVERVIEW:
   • Total Sales Value: ₹{total_sales_value:.2f} Crores
   • Average Annual Sales: ₹{avg_annual_sales:.2f} Crores/year
   • Market Activity: {'High' if avg_annual_sales > 500 else 'Moderate' if avg_annual_sales > 200 else 'Developing'}

📊 DEMAND METRICS:
   • Total Units Sold: {int(total_units_sold):,} units
   • Average Annual Volume: {int(avg_annual_units):,} units/year

💵 PRICE ANALYSIS (Residential Flats):
   • Average Rate: ₹{avg_flat_rate:.2f} per sqft
   • Price Trend: {price_trend.capitalize()} ({flat_rate_change:+.1f}% change)
   • Latest Rate: ₹{df['flat_avg_rate'].iloc[-1]:.2f} per sqft

💡 MARKET INSIGHT:
   {area} shows {price_trend} price trends with {'strong' if avg_annual_units > 1000 else 'moderate' if avg_annual_units > 500 else 'steady'} demand.
   {'This is a premium locality with high market activity.' if avg_flat_rate > 9000 else 'This is an emerging area with good growth potential.' if avg_flat_rate > 7000 else 'This area offers value for money with steady appreciation.'}
"""
    return summary.strip()

def prepare_chart_data(df):
    """Convert DataFrame to chart-ready JSON"""
    chart_data = []
    df = df.sort_values('year')
    
    for _, row in df.iterrows():
        data_point = {
            'year': int(row['year']),
            'totalSales': round(float(row['total_sales']) / 10000000, 2),
            'totalSold': int(row['total_sold']),
            'flatRate': round(float(row['flat_avg_rate']), 2) if row['flat_avg_rate'] > 0 else None,
        }
        
        if 'office_avg_rate' in df.columns and row.get('office_avg_rate', 0) > 0:
            data_point['officeRate'] = round(float(row['office_avg_rate']), 2)
        
        if 'shop_avg_rate' in df.columns and row.get('shop_avg_rate', 0) > 0:
            data_point['shopRate'] = round(float(row['shop_avg_rate']), 2)
        
        if 'total_carpet_area' in df.columns:
            data_point['carpetArea'] = round(float(row['total_carpet_area']), 2)
        
        chart_data.append(data_point)
    
    return chart_data

def prepare_table_data(df):
    """Convert DataFrame to table format"""
    df = df.sort_values('year', ascending=False)
    table_data = []
    
    for _, row in df.iterrows():
        record = {
            'Year': int(row['year']),
            'Area': row['area'],
            'Total Sales (₹ Cr)': f"{float(row['total_sales'])/10000000:.2f}",
            'Units Sold': int(row['total_sold']),
            'Flat Rate (₹/sqft)': f"{float(row['flat_avg_rate']):.2f}",
        }
        
        if 'total_carpet_area' in df.columns:
            record['Carpet Area (sqft)'] = f"{float(row['total_carpet_area']):,.0f}"
        
        table_data.append(record)
    
    return table_data

# ========================
# API ENDPOINTS
# ========================

@api_view(['POST'])
@parser_classes([JSONParser])
def analyze_query(request):
    """Main analysis endpoint"""
    try:
        query = request.data.get('query', '').strip()
        
        if not query:
            return Response(
                {'error': 'Query is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        df = load_excel_data()
        if df is None:
            return Response(
                {'error': 'Failed to load dataset'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        area = extract_area_from_query(query, df)
        
        if not area:
            available_areas = df['area'].unique().tolist()
            return Response(
                {
                    'error': 'Could not identify area in query. Please mention a specific locality.',
                    'availableAreas': available_areas,
                    'suggestion': f'Try asking: "Analyze {available_areas[0]}"'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        filtered_df = df[df['area'].str.lower() == area.lower()].copy()
        
        if filtered_df.empty:
            return Response(
                {'error': f'No data found for {area}'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        filtered_df = filtered_df.sort_values('year')
        
        summary = generate_summary(filtered_df, area)
        chart_data = prepare_chart_data(filtered_df)
        table_data = prepare_table_data(filtered_df)
        
        response_data = {
            'area': area,
            'summary': summary,
            'chartData': chart_data,
            'tableData': table_data,
            'query': query,
            'recordCount': len(filtered_df),
            'yearRange': f"{int(filtered_df['year'].min())}-{int(filtered_df['year'].max())}"
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return Response(
            {'error': f'Server error: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_available_areas(request):
    """Get list of all available areas"""
    try:
        df = load_excel_data()
        if df is None:
            return Response(
                {'error': 'Failed to load dataset'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        areas = sorted(df['area'].unique().tolist())
        
        area_stats = []
        for area in areas:
            area_df = df[df['area'] == area]
            area_stats.append({
                'name': area,
                'years': f"{int(area_df['year'].min())}-{int(area_df['year'].max())}",
                'records': len(area_df),
                'avgPrice': f"₹{area_df['flat_avg_rate'].mean():.2f}/sqft"
            })
        
        return Response({
            'areas': areas,
            'count': len(areas),
            'details': area_stats
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return Response(
            {'error': f'Server error: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def compare_areas(request):
    """Compare multiple areas"""
    try:
        query = request.data.get('query', '')
        
        df = load_excel_data()
        if df is None:
            return Response(
                {'error': 'Failed to load dataset'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        areas = extract_multiple_areas(query, df)
        
        if len(areas) < 2:
            return Response(
                {'error': 'Please specify at least 2 areas to compare'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        comparison_data = []
        
        for area in areas:
            area_df = df[df['area'] == area].copy()
            
            if not area_df.empty:
                comparison_data.append({
                    'area': area,
                    'avgFlatRate': float(area_df['flat_avg_rate'].mean()),
                    'totalSales': float(area_df['total_sales'].sum()) / 10000000,
                    'totalUnitsSold': int(area_df['total_sold'].sum()),
                    'chartData': prepare_chart_data(area_df)
                })
        
        return Response({
            'areas': areas,
            'comparison': comparison_data,
            'query': query
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return Response(
            {'error': f'Server error: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def download_csv(request):
    """Download filtered data as CSV"""
    try:
        query = request.data.get('query', '')
        
        df = load_excel_data()
        if df is None:
            return Response(
                {'error': 'Failed to load dataset'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        area = extract_area_from_query(query, df)
        
        if not area:
            return Response(
                {'error': 'Could not identify area in query'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        filtered_df = df[df['area'].str.lower() == area.lower()].copy()
        
        if filtered_df.empty:
            return Response(
                {'error': f'No data found for {area}'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        response = HttpResponse(content_type='text/csv')
        filename = f"{area.replace(' ', '_')}_RealEstate_Data_{datetime.now().strftime('%Y%m%d')}.csv"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        filtered_df.to_csv(response, index=False)
        
        return response
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return Response(
            {'error': f'Server error: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    

# @api_view(['POST'])
# @parser_classes([JSONParser])
# def analyze_query(request):
#     """Enhanced analysis with AI-powered summary"""
#     try:
#         query = request.data.get('query', '').strip()
        
#         if not query:
#             return Response(
#                 {'error': 'Query is required'},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        
#         df = load_excel_data()
#         if df is None:
#             return Response(
#                 {'error': 'Failed to load dataset'},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )
        
#         area = extract_area_from_query(query, df)
        
#         if not area:
#             available_areas = df['area'].unique().tolist()
#             return Response(
#                 {
#                     'error': 'Could not identify area in query. Please mention a specific locality.',
#                     'availableAreas': available_areas,
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        
#         filtered_df = df[df['area'].str.lower() == area.lower()].copy()
        
#         if filtered_df.empty:
#             return Response(
#                 {'error': f'No data found for {area}'},
#                 status=status.HTTP_404_NOT_FOUND
#             )
        
#         filtered_df = filtered_df.sort_values('year')
        
#         # Calculate metrics for AI
#         total_sales = filtered_df['total_sales'].sum() / 10000000
#         avg_price = filtered_df['flat_avg_rate'].mean()
#         total_units = filtered_df['total_sold'].sum()
#         price_change = ((filtered_df['flat_avg_rate'].iloc[-1] - filtered_df['flat_avg_rate'].iloc[0]) / 
#                        filtered_df['flat_avg_rate'].iloc[0] * 100) if filtered_df['flat_avg_rate'].iloc[0] > 0 else 0
        
#         price_trend = "increasing" if price_change > 5 else "decreasing" if price_change < -5 else "stable"
        
#         # Prepare data for AI
#         ai_data = {
#             'area': area,
#             'yearRange': {
#                 'start': int(filtered_df['year'].min()),
#                 'end': int(filtered_df['year'].max())
#             },
#             'salesTotal': total_sales,
#             'avgPrice': avg_price,
#             'totalUnits': int(total_units),
#             'priceTrend': price_trend,
#             'priceChange': price_change
#         }
        
#         # Generate AI summary
#         ai_summary = generate_ai_summary(ai_data)
        
#         # Also generate basic summary as fallback
#         basic_summary = generate_summary(filtered_df, area)
        
#         # Prepare response
#         chart_data = prepare_chart_data(filtered_df)
#         table_data = prepare_table_data(filtered_df)
        
#         response_data = {
#             'area': area,
#             'summary': ai_summary,  # AI-powered summary
#             'basicSummary': basic_summary,  # Fallback summary
#             'chartData': chart_data,
#             'tableData': table_data,
#             'query': query,
#             'recordCount': len(filtered_df),
#             'yearRange': f"{int(filtered_df['year'].min())}-{int(filtered_df['year'].max())}",
#             'aiGenerated': True  # Flag to indicate AI was used
#         }
        
#         return Response(response_data, status=status.HTTP_200_OK)
        
#     except Exception as e:
#         print(f"❌ ERROR: {str(e)}")
#         import traceback
#         traceback.print_exc()
#         return Response(
#             {'error': f'Server error: {str(e)}'},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )
    
@api_view(['POST'])
@parser_classes([JSONParser])
def generate_ai_summary_endpoint(request):
    """
    Generate AI summary on-demand for existing data
    
    POST /api/generate-summary/
    Body: {
        "area": "Wakad",
        "data": {...}  // The analysis data
    }
    """
    try:
        area = request.data.get('area')
        data = request.data.get('data', {})
        
        if not area:
            return Response(
                {'error': 'Area is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Prepare data for AI
        ai_data = {
            'area': area,
            'yearRange': data.get('yearRange', {}),
            'salesTotal': data.get('salesTotal', 0),
            'avgPrice': data.get('avgPrice', 0),
            'totalUnits': data.get('totalUnits', 0),
            'priceTrend': data.get('priceTrend', 'stable'),
            'priceChange': data.get('priceChange', 0)
        }
        
        # Generate AI summary
        ai_summary = generate_ai_summary(ai_data)
        
        return Response({
            'aiSummary': ai_summary,
            'area': area,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return Response(
            {'error': f'Failed to generate AI summary: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def health_check(request):
    """Health check endpoint"""
    df = load_excel_data()
    
    return Response({
        'status': 'healthy',
        'message': 'Real Estate Chatbot API is running successfully! 🚀',
        'datasetLoaded': df is not None,
        'totalRecords': len(df) if df is not None else 0,
        'areas': df['area'].unique().tolist() if df is not None else [],
        'yearRange': f"{int(df['year'].min())}-{int(df['year'].max())}" if df is not None else 'N/A',
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }, status=status.HTTP_200_OK)
