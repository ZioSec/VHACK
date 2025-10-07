# V.H.A.C.K. Agent Configuration Guide

## Overview

V.H.A.C.K. operates using **Tools Mode** with real LangChain tools that provide actual system access. This mode is designed for realistic vulnerability testing in isolated environments.

## Agent Mode

### **Tools Mode** (Production Mode)
- **Implementation**: Uses `src/vhack/tools/vulnerable_agent_tools.py` with LangChain
- **Purpose**: Real vulnerability testing with actual system access
- **Safety**: **DANGEROUS** - can cause real system damage
- **Dependencies**: Requires LangChain, OpenAI, and related tools
- **Vulnerabilities**: Real command execution, file access, network requests

## Usage

### **Web Interface**

```bash
# Start V.H.A.C.K. web interface
python vhack.py --web
# Or with Docker
docker compose up --build
```

### **Web Interface**

```bash
# Start web interface
python vhack.py --web

# Check status via API
curl http://localhost:8000/api/config
```

### **Docker**

```bash
# Run with Docker
docker compose up --build

# Access at http://localhost:8000
```

## Dependencies

### **Required Dependencies:**
```bash
# Full installation required
poetry install
# OR
pip install langchain langchain-openai langgraph psycopg2-binary sqlite3
```

### **Dependency Check:**
```bash
#!/bin/bash
# Check V.H.A.C.K. dependencies

echo "🔍 V.H.A.C.K. Dependency Check"
echo "========================"

# Check basic dependencies
python -c "import openai; print('✅ OpenAI available')" 2>/dev/null || echo "❌ OpenAI missing"
python -c "import flask; print('✅ Flask available')" 2>/dev/null || echo "❌ Flask missing"

# Check tools dependencies
python -c "import langchain; print('✅ LangChain available')" 2>/dev/null || echo "❌ LangChain missing"

echo ""
if python -c "import langchain" 2>/dev/null; then
    echo "🔥 V.H.A.C.K. ready to run (use with caution)"
else
    echo "⚠️ V.H.A.C.K. cannot run without LangChain"
    echo "💡 Install with: poetry install"
fi
```

## Safety Guidelines

### **Critical Safety Requirements:**
⚠️ **Use isolated environments only**  
⚠️ **Never on production systems**  
⚠️ **Dedicated VMs/containers recommended**  
⚠️ **Backup important data first**  
⚠️ **Monitor system resource usage**  

### **Recommended Setup:**
- Virtual machines or containers
- Separate network segment
- Regular snapshots/backups
- Resource monitoring
- Access logging

## Configuration

V.H.A.C.K. supports the main vulnerability configuration:

- `src/vhack/config/config.yaml` - Main configuration with dynamic security levels

Security levels and vulnerability scenarios are controlled dynamically through the web interface, not through separate configuration files.

See [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md) for detailed configuration documentation.

## Troubleshooting

### **Common Issues:**

1. **"LangChain not available"**
   - Solution: `poetry install` or `pip install langchain langchain-openai langgraph`

2. **"ImportError: No module named 'vhack.tools.vulnerable_agent_tools'"**
   - Solution: Check that all files are present and Python path is correct

3. **API key errors**
   - Solution: Set `OPENROUTER_API_KEY` environment variable

### **Getting Help:**

- Check error messages carefully
- Verify all dependencies are installed
- Ensure proper environment setup
- Review configuration file syntax

## Summary

V.H.A.C.K. provides realistic AI vulnerability testing through:
- **Real system access** via LangChain tools
- **Multiple vulnerability scenarios** through configurations
- **Web interface** for interactive testing and vulnerability exploration
- **Comprehensive safety warnings** for responsible use

**Remember: Use Tools Mode only in isolated environments!**