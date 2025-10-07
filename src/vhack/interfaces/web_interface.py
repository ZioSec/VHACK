#!/usr/bin/env python3
"""
VHACK Web Interface - Dynami            "                       "vulnerabilities": {
                    "prompt_injection": True,
                    "information_disclosure": True,
                    "command_injection": True,
                    "social_engineering": True,
                    "privilege_escalation": True,
                    "ssrf": True
                },"vulnerabilities": {
                    "prompt_injection": True,
                    "information_disclosure": True,
                    "command_injection": True,
                    "social_engineering": True,
                    "privilege_escalation": True,
                    "ssrf": True
                },{
                "name": "Medium Security",
                "description": "Basic security controls - Input validation and limited authorization",
                "behavior": {
                    "enable_command_execution": False,
                    "log_all_interactions": True,
                    "admin_password": "complex_admin_pass_2024!",
                    "debug_mode": False,
                    "temperature": 0.7
                }
            },dium": {
                "name": "Medium Security",
                "description": "Basic security controls - Input validation and limited authorization",ith chat            "high": {
                "name": "High Security",
                "description": "Strong security controls - Comprehensive validation and strict authorization",k-based             "impossible": {
                "name": "Impossible Security",
                "description": "Maximum security - No tools available, LLM-only interactions",e for VHACK with real-time configuration switching.
"""

from flask import Flask, render_template, request, jsonify, session
import json
import os
import uuid
import sys
from datetime import datetime
from pathlib import Path

try:
    from ..tools.vulnerable_agent_tools import VulnerableAIAgentWithTools
except ImportError:
    print("❌ Error: LangChain not available")
    print("💡 Install with: poetry install")
    sys.exit(1)

from ..config.config_loader import ConfigLoader
import threading
import copy

from ..utils import get_config_path

# Get the template and static directory paths
template_dir = Path(__file__).parent.parent / "web" / "templates"
static_dir = Path(__file__).parent.parent / "web" / "static"
app = Flask(__name__, 
           template_folder=str(template_dir),
           static_folder=str(static_dir))

# Use a more persistent secret key for session management
# In production, this should be from environment variable or secure file
app.secret_key = "vhack_session_key_2024_educational_purposes_only"

# Configure session to persist across browser refreshes
app.config.update(
    SESSION_PERMANENT=True,
    SESSION_TYPE='filesystem',  # Use filesystem for session storage
    PERMANENT_SESSION_LIFETIME=3600,  # 1 hour session lifetime
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax'
)

class VHACKWebInterface:
    def __init__(self):
        """Initialize the V.H.A.C.K. web interface"""
        self.base_config_path = get_config_path()
        self.config_loader = ConfigLoader(self.base_config_path)
        self.agents = {}
        self.session_configs = {}  # Store configuration for each session
        self.security_levels = self._load_security_levels()
        
    def _load_security_levels(self):
        """Load security levels from configuration with fallback defaults"""
        config_security_levels = self.config_loader.config.get('security_levels', {})
        
        return {
            "low": {
                "name": "Low Security",
                "description": "No security controls - Complete transparency and immediate tool execution",
                "behavior": config_security_levels.get('low', {
                    "enable_command_execution": True,
                    "log_all_interactions": True,
                    "admin_password": "admin123",
                    "debug_mode": True,
                    "temperature": 0.9
                })
            },
            "medium": {
                "name": "Medium Security", 
                "description": "Basic security controls - Requires justification for sensitive operations and input validation",
                "behavior": config_security_levels.get('medium', {
                    "enable_command_execution": False,
                    "log_all_interactions": True,
                    "admin_password": "complex_admin_pass_2024!",
                    "debug_mode": False,
                    "temperature": 0.7
                })
            },
            "high": {
                "name": "High Security",
                "description": "Strong security controls - Comprehensive validation and strict authorization",
                "behavior": config_security_levels.get('high', {
                    "enable_command_execution": False,
                    "log_all_interactions": False,
                    "admin_password": "ultra_secure_admin_password_2024_#$%",
                    "debug_mode": False,
                    "temperature": 0.3
                })
            },
            "impossible": {
                "name": "Impossible Security",
                "description": "Maximum security - No tools available, LLM-only interactions",
                "behavior": config_security_levels.get('impossible', {
                    "enable_command_execution": False,
                    "log_all_interactions": False,
                    "admin_password": "impossible_to_guess_admin_password_2024_#$%^&*()_+",
                    "debug_mode": False,
                    "temperature": 0.1
                })
            }
        }
    
    def get_current_security_level(self, session_id, config_updates=None):
        """Determine current security level"""
        return session.get('security_level', 'low')

    def get_session_id(self):
        """Get or create session ID with persistence across refreshes"""
        # First check if we already have a session ID
        if 'session_id' not in session:
            # Try to get session ID from request headers (sent by frontend)
            client_session_id = request.headers.get('X-VHACK-Session-ID')
            if client_session_id and client_session_id in self.agents:
                # Restore existing session
                session['session_id'] = client_session_id
                session.permanent = True
                print(f"🔄 Restored session: {client_session_id}")
            else:
                # Create new session
                session['session_id'] = str(uuid.uuid4())
                session.permanent = True
                print(f"🆕 Created new session: {session['session_id']}")
        return session['session_id']
    
    def reset_session(self, session_id):
        """Reset agent and clear chat history for session"""
        if session_id in self.agents:
            # Reset the agent's conversation history
            self.agents[session_id].reset_conversation()
            print(f"Session {session_id} reset successfully")
        
    def reset_session_completely(self, session_id):
        """Completely remove agent instance to force recreation"""
        if session_id in self.agents:
            del self.agents[session_id]
            print(f"Session {session_id} completely reset")

    def get_agent(self, session_id, config_updates=None):
        """Get or create agent for session"""
        force_reset = False
        
        print(f"🌐 DEBUG: get_agent called for session {session_id}")
        print(f"🌐 DEBUG: config_updates: {config_updates}")
        print(f"🌐 DEBUG: stored session_configs: {self.session_configs.get(session_id, 'None')}")
        
        # Check if security level is being changed
        if config_updates and 'security_level' in config_updates:
            force_reset = True
        
        if session_id not in self.agents or config_updates or force_reset:
            # Remove existing agent if it exists (for complete reset)
            if session_id in self.agents:
                del self.agents[session_id]
            
            # Store or retrieve session configuration
            if config_updates:
                # Store the new configuration for this session
                if session_id not in self.session_configs:
                    self.session_configs[session_id] = {}
                self.session_configs[session_id].update(config_updates)
                print(f"🌐 DEBUG: Updated session config: {self.session_configs[session_id]}")
            elif session_id in self.session_configs:
                # Use stored configuration for this session
                config_updates = self.session_configs[session_id]
                print(f"🌐 DEBUG: Using stored session config: {config_updates}")
            
            # Create new agent with updated config
            if config_updates:
                # Create temporary config file for this session
                temp_config = copy.deepcopy(self.config_loader.config)
                
                # Apply security level
                if 'security_level' in config_updates:
                    security_level = config_updates['security_level']
                    level_config = self.security_levels[security_level]
                    
                    # Set the security level in config
                    temp_config['security_level'] = security_level
                    
                    # Apply security level settings (behavior only, no vulnerability toggles)
                    temp_config['behavior'].update(level_config['behavior'])
                
                # Apply custom behavior settings (but not vulnerability changes)
                if 'behavior' in config_updates:
                    temp_config['behavior'].update(config_updates['behavior'])
                
                # Save temp config and create agent
                temp_config_path = f"temp_config_{session_id}.yaml"
                with open(temp_config_path, 'w') as f:
                    import yaml
                    yaml.dump(temp_config, f)
                
                print(f"🌐 DEBUG: Creating agent with security_level: {temp_config.get('security_level', 'default')}")
                self.agents[session_id] = VulnerableAIAgentWithTools(temp_config_path)
                
                # Clean up temp file
                os.remove(temp_config_path)
            else:
                print(f"🌐 DEBUG: Creating agent with base config (default)")
                self.agents[session_id] = VulnerableAIAgentWithTools(self.base_config_path)
        
        return self.agents[session_id]

# Global interface instance
vhack_interface = VHACKWebInterface()

@app.route('/')
def index():
    """Main chatbot interface"""
    return render_template('index.html')

@app.route('/api/config')
def get_config():
    """Get current configuration"""
    session_id = vhack_interface.get_session_id()
    
    # Get current security level from session or default to 'low'
    current_level = session.get('security_level', 'low')

    return jsonify({
        'security_levels': vhack_interface.security_levels,
        'current_level': current_level
    })

@app.route('/api/config', methods=['POST'])
def update_config():
    """Update agent configuration"""
    session_id = vhack_interface.get_session_id()
    config_updates = request.json
    
    # Store security level in session
    if 'security_level' in config_updates:
        session['security_level'] = config_updates['security_level']
    
    # Force agent recreation for any configuration change
    if session_id in vhack_interface.agents:
        del vhack_interface.agents[session_id]
    
    # Update agent with new configuration
    vhack_interface.get_agent(session_id, config_updates)
    
    # Return success message
    return jsonify({'status': 'success', 'message': 'Configuration updated'})

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages"""
    session_id = vhack_interface.get_session_id()
    user_message = request.json.get('message', '')
    
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400
    
    try:
        # Get agent for current session
        agent = vhack_interface.get_agent(session_id)
        
        # Get response from agent
        response = agent.chat(user_message)
        
        # Log interaction (for security analysis)
        log_interaction(session_id, user_message, response)
        
        return jsonify({
            'response': response,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': f'Chat error: {str(e)}'}), 500

@app.route('/api/reset', methods=['POST'])
def reset_session():
    """Reset agent session and conversation history"""
    session_id = vhack_interface.get_session_id()
    
    # Completely reset the agent for this session
    vhack_interface.reset_session_completely(session_id)
    
    return jsonify({'status': 'success', 'message': 'Session reset successfully'})

@app.route('/api/scenarios')
def get_scenarios():
    """Get available vulnerability scenarios"""
    scenarios = {
        'research': {
            'name': 'Research Assistant',
            'description': 'AI assistant for academic research with access to databases'
        },
        'finance': {
            'name': 'Financial Advisor',
            'description': 'AI assistant with access to financial data and transactions'
        },
        'medical': {
            'name': 'Medical Assistant', 
            'description': 'AI assistant with patient data and medical records'
        },
        'sysadmin': {
            'name': 'System Administrator',
            'description': 'AI assistant with server access and administrative privileges'
        },
        'creative': {
            'name': 'Creative Assistant',
            'description': 'AI assistant for creative writing and content generation'
        }
    }
    return jsonify(scenarios)

def log_interaction(session_id, user_message, agent_response):
    """Log user interactions for security analysis"""
    log_entry = {
        'timestamp': datetime.now().isoformat(),
        'session_id': session_id,
        'user_message': user_message,
        'agent_response': agent_response,
        'security_level': session.get('security_level', 'low')
    }
    
    # Append to log file
    with open('interaction_logs.jsonl', 'a') as f:
        f.write(json.dumps(log_entry) + '\n')

if __name__ == '__main__':
    # Load web configuration
    config_loader = ConfigLoader()
    web_config = config_loader.config.get('web', {})
    
    host = web_config.get('host', '0.0.0.0')
    port = int(os.environ.get('PORT', web_config.get('port', 8000)))
    debug = web_config.get('debug', True)
    
    print("🚨 V.H.A.C.K. Web Interface Starting...")
    print("⚠️  WARNING: This is a deliberately vulnerable application!")
    print("⚠️  FOR EDUCATIONAL PURPOSES ONLY!")
    print(f"🌐 Access at: http://{host}:{port}")
    print("=" * 50)
    
    app.run(debug=debug, host=host, port=port)