"""
URL Configuration for Chatbot API
"""

from django.urls import path
from . import views

urlpatterns = [
    # Main endpoints
    path('analyze/', views.analyze_query, name='analyze_query'),
    path('areas/', views.get_available_areas, name='get_areas'),
    
    # Additional features
    path('compare/', views.compare_areas, name='compare_areas'),
    path('download/', views.download_csv, name='download_csv'),

    path('generate-summary/', views.generate_ai_summary_endpoint, name='generate_ai_summary'),
    
    # Health check
    path('health/', views.health_check, name='health_check'),
]
