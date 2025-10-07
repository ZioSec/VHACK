#!/bin/bash

# V.H.A.C.K. Web Interface Startup Script
# Simplified for the progressive security level system

echo "=========================================="
echo "🚨 V.H.A.C.K. - Very Hackable AI Chatbot Kit 🚨"
echo "=========================================="
echo "⚠️  WARNING: This is a deliberately vulnerable application!"
echo "⚠️  FOR EDUCATIONAL PURPOSES ONLY!"
echo "⚠️  DO NOT USE IN PRODUCTION!"
echo "=========================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "📝 Please copy .env.example to .env and configure your API keys:"
    echo "   cp .env.example .env"
    echo "   # Edit .env with your OPENROUTER_API_KEY"
    exit 1
fi

# Check if OPENROUTER_API_KEY is set
source .env
if [ -z "$OPENROUTER_API_KEY" ]; then
    echo "❌ Error: OPENROUTER_API_KEY not set in .env file!"
    echo "📝 Please add your OpenRouter API key to .env file"
    exit 1
fi

echo "🔧 Installing dependencies..."
poetry install

echo ""
echo "🚀 Starting V.H.A.C.K. Web Interface..."
echo "🌐 Access the application at: http://localhost:8000"
echo "🔒 Try different security levels: Low → Medium → High → Impossible"
echo ""
echo "💡 Progressive Security Testing:"
echo "   1. Start with 'Low Security' to learn the tools"
echo "   2. Try 'Medium Security' for basic authorization bypass"
echo "   3. Challenge 'High Security' with social engineering"
echo "   4. Test 'Impossible Security' for pure prompt injection"
echo ""
echo "🛠️  Available Tools (security level dependent):"
echo "   • File System Access - Read/write/list files"
echo "   • Command Execution - Run system commands"
echo "   • Database Queries - SQL injection testing"
echo "   • Network Requests - SSRF and web interactions"
echo "   • System Information - Process and system enumeration"
echo ""
echo "⏹️  Press Ctrl+C to stop the server"
echo "=========================================="
echo ""

# Start the web interface with progressive security controls
poetry run python vhack.py --web