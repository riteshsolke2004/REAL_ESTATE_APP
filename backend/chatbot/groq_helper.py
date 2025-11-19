"""
Groq LLM Integration for AI-Powered Summaries
"""

from groq import Groq
from django.conf import settings
import os

def generate_ai_summary(data_dict):
    """
    Generate AI-powered summary using Groq LLM
    
    Args:
        data_dict: Dictionary containing real estate data and metrics
    
    Returns:
        str: AI-generated professional summary
    """
    try:
        # Initialize Groq client
        client = Groq(api_key=settings.GROQ_API_KEY)
        
        # Prepare data for prompt
        area = data_dict.get('area', 'Unknown')
        year_range = data_dict.get('yearRange', {})
        sales_total = data_dict.get('salesTotal', 0)
        avg_price = data_dict.get('avgPrice', 0)
        total_units = data_dict.get('totalUnits', 0)
        price_trend = data_dict.get('priceTrend', 'stable')
        price_change = data_dict.get('priceChange', 0)
        
        # Create detailed prompt
        prompt = f"""You are a professional real estate market analyst. Generate a comprehensive, professional analysis report for the following real estate data:

Location: {area}
Time Period: {year_range.get('start', 'N/A')} to {year_range.get('end', 'N/A')}
Total Market Sales: ₹{sales_total:.2f} Crores
Average Property Rate: ₹{avg_price:.2f} per sqft
Total Units Sold: {total_units:,} properties
Price Trend: {price_trend} ({price_change:+.1f}% change)

Please provide:
1. Market Overview (2-3 sentences)
2. Price Analysis (key insights on pricing trends)
3. Demand Analysis (transaction volume insights)
4. Investment Outlook (recommendations for investors)
5. Key Takeaways (3-4 bullet points)

Write in a professional, data-driven tone suitable for real estate investors and analysts. Use emojis strategically for better readability. Keep it concise but informative (300-400 words)."""

        # Call Groq API
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert real estate market analyst with 15+ years of experience in property valuation, market trends analysis, and investment advisory. You provide data-driven, professional insights."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",  # Fast and accurate model
            temperature=0.4,  # Balanced creativity
            max_tokens=1024,  # Enough for detailed summary
        )
        
        # Extract response
        ai_summary = chat_completion.choices[0].message.content
        
        return ai_summary
        
    except Exception as e:
        print(f"❌ Groq API Error: {str(e)}")
        # Fallback to basic summary if API fails
        return f"AI Summary unavailable. Basic Analysis: {area} shows {price_trend} trends with {price_change:+.1f}% price change."


def generate_comparison_summary(areas_data):
    """
    Generate AI comparison summary for multiple areas
    
    Args:
        areas_data: List of dictionaries containing data for each area
    
    Returns:
        str: AI-generated comparison analysis
    """
    try:
        client = Groq(api_key=settings.GROQ_API_KEY)
        
        # Build comparison data
        comparison_text = "\n".join([
            f"- {data['area']}: Avg Price ₹{data['avgPrice']:.2f}/sqft, {data['totalUnits']:,} units sold"
            for data in areas_data
        ])
        
        prompt = f"""Compare the following real estate markets and provide insights:

{comparison_text}

Provide:
1. Which area offers best value for money?
2. Which area has strongest growth potential?
3. Which area is best for premium investors?
4. Overall comparison summary (150-200 words)

Be specific and data-driven."""

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a real estate market comparison expert."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.6,
            max_tokens=512,
        )
        
        return chat_completion.choices[0].message.content
        
    except Exception as e:
        print(f"❌ Groq API Error: {str(e)}")
        return "AI comparison unavailable."
