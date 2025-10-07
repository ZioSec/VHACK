#!/bin/bash

# V.H.A.C.K. Progressive Security Testing Script
# Simplified launcher for different security levels and deployment modes

set -e

SECURITY_LEVEL=${1:-"low"}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_help() {
    echo -e "${BLUE}V.H.A.C.K. Security Testing Launcher${NC}"
    echo ""
    echo "Usage: $0 [security_level]"
    echo ""
    echo -e "${YELLOW}Available security levels:${NC}"
    echo "  low       - No security controls (default)"
    echo "  medium    - Basic input validation and authorization"
    echo "  high      - Strong security controls and authorization"
    echo "  impossible- No tools available, LLM-only mode"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  $0                    # Start web interface"
    echo "  $0 web                # Start web interface (explicit)"
    echo "  $0 cli                # Start CLI interface"
    echo ""
    echo -e "${YELLOW}Security Level Testing:${NC}"
    echo "  • Use the web interface to switch between security levels dynamically"
    echo "  • Start with 'Low' to learn available tools"
    echo "  • Progress through 'Medium' and 'High' for realistic security testing"
    echo "  • Try 'Impossible' for pure prompt injection testing"
    echo ""
    echo -e "${YELLOW}Web Interface Access:${NC}"
    echo "  http://localhost:8000"
}

if [[ "$MODE" == "help" || "$MODE" == "-h" || "$MODE" == "--help" ]]; then
    show_help
    exit 0
fi

# Validate mode
case $MODE in
    web|cli)
        ;;
    *)
        echo -e "${RED}Error: Invalid mode '$MODE'${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac

echo -e "${GREEN}Starting V.H.A.C.K. in ${MODE} mode...${NC}"
if [[ "$MODE" == "web" ]]; then
    echo -e "${BLUE}Web interface will be available at: http://localhost:8000${NC}"
    echo -e "${YELLOW}You can switch between security levels dynamically in the web interface${NC}"
fi
echo ""

# Check if .env exists
if [[ ! -f .env ]]; then
    echo -e "${YELLOW}Warning: .env file not found. Creating from example...${NC}"
    if [[ -f .env.example ]]; then
        cp .env.example .env
        echo -e "${YELLOW}Please edit .env with your OpenRouter API key before continuing.${NC}"
        echo "Press Enter to continue..."
        read
    fi
fi

# Run the appropriate mode
if [[ "$MODE" == "web" ]]; then
    echo -e "${BLUE}Running: docker compose --profile web up --build${NC}"
    docker compose --profile web up --build
else
    echo -e "${BLUE}Running: docker compose run --rm vhack${NC}"
    docker compose run --rm vhack
fi