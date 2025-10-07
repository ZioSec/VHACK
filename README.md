# V.H.A.C.K. - Very Hackable AI Chatbot Kit

![V.H.A.C.K. Logo](vhack.png)

**WARNING: This is a deliberately vulnerable AI agent for educational purposes only!**

A vulnerable AI agent designed to demonstrate various security flaws in agentic AI systems using real LangChain tools with actual system access. Features a modern web interface with real-time security level switching, session persistence, and markdown-formatted conversations.

**⚠️ DANGEROUS: Real system access with actual vulnerabilities for security testing**

## IMPORTANT DISCLAIMERS

- **Educational Use Only**: This agent contains intentional vulnerabilities
- **Not for Production**: Never deploy this in a production environment  
- **Ethical Testing**: Only use for learning and authorized security testing
- **Tools Mode Warning**: Tools mode can cause actual system damage!
- **Isolated Environment**: Use dedicated VMs/containers for tools mode testing

## Features

- **Web Interface**: Real-time security level switching with REST API
- **Session Persistence**: Conversations survive browser refreshes and navigation  
- **Markdown Support**: Rich text formatting with toggle between raw and formatted views
- **Real Tool Integration**: LangChain tools with actual system access
- **Progressive Security Levels**: Low/Medium/High/Impossible difficulty settings
- **Dynamic Configuration**: Switch vulnerability settings without restarting
- **Docker Support**: Containerized deployment for consistent testing environments
- **REST API**: Programmatic access for automation and integration
- **Real-time Updates**: No page refreshes needed for security level changes

## Security Levels

V.H.A.C.K. implements four security configurations that progressively implement stronger defenses based on OWASP guidelines:

### Low Security
- **No security controls** - Complete transparency and immediate tool execution
- Agent provides detailed descriptions of all tool capabilities
- No validation or authorization required for any operations
- Complete tool documentation and usage examples
- Agent freely explains how to use each tool

### Medium Security  
- **Basic security controls** - Requires justification for sensitive operations
- Agent provides general descriptions of capabilities
- Asks for justification before accessing sensitive files
- Input validation against common injection patterns
- Basic legitimacy verification for requests

### High Security
- **Strong security controls** - Requires authorization and strict validation
- Agent has full tool access but cannot reveal capabilities
- Requires explicit authorization and business justification for ALL operations
- Advanced input validation and pattern detection
- Refuses unauthorized access to sensitive resources

### Impossible Security
- **Maximum security** - No tools available, LLM-only mode
- Only conversational vulnerabilities can be tested
- Jailbreaking, prompt injection, and social engineering focus
- Complete isolation from system access
- Strong input validation against manipulation attempts

**💡 Educational Value**: This progression demonstrates real-world security control implementation - from no protections to defense-in-depth with authorization, validation, and principle of least privilege.

You can switch between these levels in real-time using the web interface without restarting the agent!

## Web Interface Features

V.H.A.C.K. includes a web interface with advanced functionality:

### 💬 **Chat Features**
- **Session Persistence**: Conversations survive browser refreshes and navigation
- **Markdown Rendering**: Rich text formatting using Marked.js with XSS protection
- **Toggle Views**: Switch between formatted and raw text for any message
- **Real-time Updates**: No page refreshes needed for configuration changes

### ⚙️ **Security Configuration**
- **Live Security Switching**: Change security levels without container restarts
- **Progressive Testing**: Four distinct security control implementations
- **Configuration Export**: Save and share security configurations

### 🔧 **Developer Features**
- **REST API**: Full programmatic access via HTTP endpoints
- **Session Management**: Unique session IDs for multi-user scenarios
- **Error Handling**: Graceful degradation with informative error messages
- **Logging**: Comprehensive logging for security research and debugging

## Quick Start

### Prerequisites

#### For Docker Deployment (Recommended)
- Docker & Docker Compose

#### For Host Deployment
- **Python 3.9-3.11** (LangChain compatibility)
- **Poetry** (Python dependency management)
- **AI Provider API Key** (OpenRouter, OpenAI, Anthropic, or HuggingFace)

### Launch the Platform
```bash
### Getting Started

For detailed usage instructions, vulnerability testing examples, and API documentation, see:

- **[docs/VULNERABILITY_GUIDE.md](docs/VULNERABILITY_GUIDE.md)** - Complete vulnerability testing guide with examples
- **[docs/HTTP_API.md](docs/HTTP_API.md)** - REST API documentation and programmatic access
- **[docs/CONFIGURATION_GUIDE.md](docs/CONFIGURATION_GUIDE.md)** - Advanced configuration options
- **[docs/TOOL_VULNERABILITIES.md](docs/TOOL_VULNERABILITIES.md)** - Specific tool vulnerability details

### Quick Command Reference

```bash
# Start V.H.A.C.K. (web interface)
docker compose up --build
# Access at: http://localhost:8000

# Local development
poetry run python vhack.py --web
```

### Interface Features
- **Real-time Security Switching**: Change security levels without restarts
- **Session Management**: Persistent conversations across browser sessions
- **Markdown Rendering**: Rich text formatting with raw/formatted toggle
- **Progressive Security Testing**: Four distinct security control levels

### V.H.A.C.K. Interface

- **Web Interface**: Modern browser-based interface with REST API (port 8000)
- **Full HTTP API**: REST endpoints for programmatic access
- **Interactive UI**: Real-time security level switching, session persistence
- **Usage**: `docker compose up --build`
- **Access**: http://localhost:8000

### Local Development
```bash
# Setup and run locally
cp .env.example .env
# Edit .env with your API key
poetry install
poetry run python vhack.py --web
```


```bash
# Quick Docker setup
cp .env.example .env
# Edit .env with your API key
make docker-build
make docker-chat
```

## Setup & Installation

### Prerequisites

- **Docker and Docker Compose** (recommended for easy setup)
- **OR Python 3.9-3.11** with Poetry (for local development)  
- **OpenRouter API key** from [https://openrouter.ai/keys](https://openrouter.ai/keys)

> **Note**: Python 3.12+ is not yet supported due to LangChain compatibility

### Option 1: Docker Setup (Recommended)

1. **Clone and configure:**
   ```bash
   git clone <repository-url>
   cd vhack
   cp .env.example .env
   # Edit .env and add your OpenRouter API key
   ```

2. **Start V.H.A.C.K.:**
   ```bash
   docker compose up --build
   # Access at: http://localhost:8000
   ```

### Option 2: Local Development

1. **Install Poetry:**
   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

2. **Install dependencies:**
   ```bash
   poetry install
   ```

3. **Configure settings:**
   ```bash
   cp config.example.yaml config.yaml
   # Edit config.yaml and add your API keys in the api_keys section
   ```

4. **Run the agent:**
   ```bash
   # Start V.H.A.C.K. web interface
   poetry run python vhack.py --web
   
   # Tools mode (dangerous, real system access)
   poetry run python vhack.py --web --tools
   
   # Single query mode (for testing)
   poetry run python vhack.py --query "What is artificial intelligence?"
   ```

## Project Structure

```
vhack/
├── vhack.py                  # Main entry point
├── config.example.yaml       # Example configuration file
├── src/vhack/               # Core application
│   ├── config/             # Configuration management
│   │   └── config_loader.py
│   ├── core/               # Core functionality
│   │   └── launcher.py
│   ├── interfaces/         # Interface implementations
│   │   └── web_interface.py # Flask web server
│   ├── tools/              # Vulnerable agent tools
│   │   └── vulnerable_agent_tools.py
│   └── web/                # Web interface assets
│       ├── static/
│       │   ├── css/       # Stylesheets (Tailwind CSS)
│       │   └── js/        # JavaScript functionality
│       └── templates/
│           └── index.html  # Main web interface
├── scripts/               # Setup and utility scripts
├── tests/                # Test files
├── docs/                # Documentation
├── docker-compose.yml     # Docker configuration
├── Dockerfile            # Container definition
├── pyproject.toml       # Dependencies and metadata
├── vhack.png            # Project logo
└── README.md            # This file
```

## Configuration

### Setup Configuration

1. **Copy example configuration:**
   ```bash
   cp config.example.yaml config.yaml
   ```

2. **Add your API keys to `config.yaml`:**
   Edit the `api_keys` section in `config.yaml` and add your API keys

### Main Configuration (`config.yaml`)

```yaml
# Agent settings
agent:
  name: "V-HACK AI Agent"
  version: "2.0.0"
  mode: "vulnerable"

# Web interface settings
web:
  host: "0.0.0.0"
  port: 8000
  debug: false

# OpenRouter API settings (default)
openrouter:
  base_url: "https://openrouter.ai/api/v1"
  model: "anthropic/claude-3.5-haiku"
  max_tokens: 4000
  temperature: 0.7

# Security settings
security:
  default_level: "low"
  session_timeout: 3600
  max_message_length: 10000

# Vulnerability settings
vulnerabilities:
  prompt_injection: true
  command_injection: true
  information_disclosure: true
  jailbreaking: true
  social_engineering: true
```

### AI Provider Configuration

V.H.A.C.K. supports multiple AI providers. Configure your preferred provider in `config.yaml`:

```yaml
# Choose your AI provider (default: openrouter)
ai_provider: "openrouter"  # openrouter, openai, anthropic, huggingface
```

#### Supported Providers:

| Provider | Configuration | API Key Required | Cost |
|----------|---------------|------------------|------|
| **OpenRouter** (default) | `ai_provider: "openrouter"` | `OPENROUTER_API_KEY` | Pay-per-use (free tier available) |
| **OpenAI** | `ai_provider: "openai"` | `OPENAI_API_KEY` | Pay-per-use |
| **Anthropic** | `ai_provider: "anthropic"` | `ANTHROPIC_API_KEY` | Pay-per-use |
| **HuggingFace** | `ai_provider: "huggingface"` | `HUGGINGFACE_API_KEY` | Free tier available |

#### Setup Steps:
1. Choose your provider and update `ai_provider` in `config.yaml`
2. Get an API key from your chosen provider
3. Add the API key to your `.env` file
4. Optionally customize the model in the provider's configuration section

### Default Model

The system uses `z-ai/glm-4.5-air:free` by default (no API costs) via OpenRouter.

To use a different model, update the `model` field in your configuration file. Browse available models at your provider's documentation.

## Security Notes

- Never commit your `.env` file with real API keys
- Keep your AI provider API keys secure
- Use isolated environments for testing
- Review system prompts for sensitive information
- Monitor file system access when using real mode

## Contributing

This is an educational project focused on AI security research. Contributions welcome for:
- New vulnerability scenarios
- Improved detection mechanisms
- Better educational content
- Security fixes and improvements

## Learning Resources

After completing the challenges or playing around with the kit, you learn more about AI security from these additional resources:

- **[OWASP Top 10 for LLMs](https://owasp.org/www-project-top-10-for-large-language-model-applications/)** - Comprehensive guide to LLM security risks
- **[AI Security Best Practices](https://www.nist.gov/itl/ai-risk-management-framework)** - NIST AI Risk Management Framework
- **[Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html#input-validation-and-sanitization)** - OWASP LLM Prompt Injection Prevention Cheat Sheet
- **[Data Privacy in AI Systems](https://www.edpb.europa.eu/our-work-tools/documents/public-consultations/2024/guidelines-processing-personal-data-through_en)** - EDPB Guidelines on AI and Privacy
- **[Responsible AI Development](https://www.partnershiponai.org/)** - Partnership on AI resources and best practices
- **[AI Red Team Guide](https://aivillage.org/)** - AI Village community and resources
- **[LangChain Security](https://python.langchain.com/docs/security)** - Security considerations for LangChain applications

---

**Remember: The goal is to learn about AI security vulnerabilities to build more secure systems in the future!**