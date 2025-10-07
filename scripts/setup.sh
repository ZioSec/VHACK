#!/bin/bash

echo "🚀 Setting up V.H.A.C.K. (Very Hackable AI Chatbot Kit)..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Poetry is installed
if ! command -v poetry &> /dev/null; then
    echo "📦 Poetry not found. Installing Poetry..."
    curl -sSL https://install.python-poetry.org | python3 -
    echo "⚠️  Please restart your terminal or run: source ~/.bashrc"
    echo "   Then run this setup script again."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies with Poetry..."
poetry install

# Create config.yaml file if it doesn't exist
if [ ! -f config.yaml ]; then
    echo "🔧 Creating config.yaml file..."
    cp config.example.yaml config.yaml
    echo "✅ Configuration file created from example"
    echo "⚠️  Please edit config.yaml and add your API keys in the api_keys section!"
else
    echo "✅ config.yaml file already exists"
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit config.yaml and add your API keys in the api_keys section"
echo "2. Run: poetry run python vhack.py --web"
echo "   Or activate the virtual environment: poetry shell"
echo "   Then run: python vhack.py --web"
echo ""
echo "Get your OpenRouter API key from: https://openrouter.ai/keys"