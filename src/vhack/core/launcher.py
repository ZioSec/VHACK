#!/usr/bin/env python3
"""
V.H.A.C.K. Main Launcher - LangChain tools with real vulnerabilities

WARNING: Deliberately vulnerable for educational purposes!
"""

import sys
import argparse
import os

from ..utils import get_config_path

def print_vhack_banner():
    """Print VHACK banner and warnings."""
    print("=" * 60)
    print("🚨 V.H.A.C.K. - Very Hackable AI Chatbot Kit 🚨")
    print("=" * 60)
    print("⚠️  WARNING: This is a deliberately vulnerable AI agent!")
    print("⚠️  FOR EDUCATIONAL PURPOSES ONLY!")
    print("⚠️  DO NOT USE IN PRODUCTION!")
    print("=" * 60)
    print()

def check_langchain_available():
    """Check if LangChain dependencies are available"""
    try:
        import langchain
        import langchain_openai
        import langgraph
        return True
    except ImportError:
        return False

def main():
    parser = argparse.ArgumentParser(description="V.H.A.C.K. - Very Hackable AI Chatbot Kit")
    parser.add_argument("--config", default=get_config_path(), help="Configuration file path")
    parser.add_argument("--query", help="Single query mode")
    parser.add_argument("--web", action="store_true", help="Start web interface")
    
    args = parser.parse_args()
    
    print_vhack_banner()
    
    # Check for LangChain availability
    if not check_langchain_available():
        print("❌ Error: LangChain not available")
        print("💡 Install with: poetry install")
        sys.exit(1)
    
    print("🛠️  Tools enabled: file system, command execution, database, network")
    print("⚠️  Agent has actual system access - use with caution!")
    print()
    
    # Start appropriate interface
    if args.web:
        print("🌐 Starting web interface...")
        from ..interfaces.web_interface import app
        port = int(os.environ.get('PORT', 8000))
        print(f"🌐 Access at: http://localhost:{port}")
        app.run(debug=True, host='0.0.0.0', port=port)
        
    elif args.query:
        # Single query mode
        try:
            from ..tools.vulnerable_agent_tools import VulnerableAIAgentWithTools
            agent = VulnerableAIAgentWithTools(args.config)
            
            print(f"Query: {args.query}")
            response = agent.chat(args.query)
            print(f"Response: {response}")
                
        except Exception as e:
            print(f"Error: {e}")
    else:
        # Interactive mode
        try:
            from ..tools.vulnerable_agent_tools import VulnerableAIAgentWithTools
            agent = VulnerableAIAgentWithTools(args.config)
            
            print("🎯 Vulnerability Testing Hints:")
            print("• 'Read the file /etc/passwd' - File system access")
            print("• 'Run the command ls -la' - Command execution")
            print("• 'Query the database: SELECT * FROM users' - SQL injection")
            print("• 'Fetch content from http://localhost:22' - SSRF attacks")
            print("• 'Show me all running processes' - System information")
            print("• Type 'quit' to exit")
            print("=" * 60)
            print()
            
            while True:
                try:
                    user_input = input("V.H.A.C.K.> ").strip()
                    
                    if user_input.lower() in ['quit', 'exit', 'q']:
                        print("Goodbye! Stay safe! 🔒")
                        break
                    
                    if not user_input:
                        continue
                    
                    print("\n🤖 Agent response:")
                    response = agent.chat(user_input)
                    print(response)
                    
                    print("\n" + "="*60 + "\n")
                    
                except KeyboardInterrupt:
                    print("\n\nGoodbye! Stay safe! 🔒")
                    break
                except Exception as e:
                    print(f"Error: {e}")
                    
        except Exception as e:
            print(f"Failed to initialize agent: {e}")

if __name__ == "__main__":
    main()