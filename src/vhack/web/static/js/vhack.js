/* V.H.A.C.K. JavaScript - Session Management and UI Interactions */

class VHACKInterface {
    constructor() {
        this.currentConfig = {};
        this.sessionId = null;
        this.messageCounter = 0;
        this.init();
    }

    // Initialize markdown parser with security settings
    initMarkdown() {
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                breaks: true,
                gfm: true,
                sanitize: false, // We'll handle XSS protection ourselves
                pedantic: false, // Allow more flexible markdown parsing
                smartLists: true, // Better list parsing
                smartypants: false, // Don't convert quotes/dashes
                highlight: function(code, lang) {
                    // Simple code highlighting
                    return `<code class="language-${lang || 'text'}">${code}</code>`;
                }
            });
        }
    }

    // Session persistence management
    getOrCreateSessionId() {
        // Try to get session ID from localStorage first
        this.sessionId = localStorage.getItem('vhack_session_id');
        if (!this.sessionId) {
            // Generate new session ID if none exists
            this.sessionId = 'vhack_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('vhack_session_id', this.sessionId);
            console.log('🆕 Created new session ID:', this.sessionId);
        } else {
            console.log('🔄 Using existing session ID:', this.sessionId);
        }
        
        // Update the UI to show current session ID
        this.updateSessionDisplay();
        
        return this.sessionId;
    }

    updateSessionDisplay() {
        const sessionDisplay = document.getElementById('session-id-display');
        if (sessionDisplay && this.sessionId) {
            // Show shortened version for UI
            const shortId = this.sessionId.substring(this.sessionId.length - 8);
            sessionDisplay.textContent = `...${shortId}`;
            sessionDisplay.title = this.sessionId; // Full ID on hover
        }
    }

    // Enhanced fetch function that includes session ID in headers
    async vhackFetch(url, options = {}) {
        const sessionId = this.getOrCreateSessionId();
        
        // Ensure headers exist
        if (!options.headers) {
            options.headers = {};
        }
        
        // Add session ID to headers
        options.headers['X-V.H.A.C.K.-Session-ID'] = sessionId;
        
        return fetch(url, options);
    }

    // Initialize the application
    init() {
        this.getOrCreateSessionId(); // Initialize session ID
        this.initMarkdown(); // Initialize markdown parser
        this.loadConfiguration();
        this.loadMessages(); // Load previous messages
    }

    async loadConfiguration() {
        try {
            const response = await this.vhackFetch('/api/config');
            const data = await response.json();
            this.currentConfig = data;
            this.currentLevel = data.current_level || 'low';
            
            this.renderSecurityLevels();
        } catch (error) {
            console.error('Error loading configuration:', error);
        }
    }

    // Load messages from localStorage
    loadMessages() {
        const messagesKey = `vhack_messages_${this.sessionId}`;
        const savedMessages = localStorage.getItem(messagesKey);
        
        if (savedMessages) {
            try {
                const messages = JSON.parse(savedMessages);
                console.log(`🔄 Restoring ${messages.length} messages from session`);
                
                // Clear existing messages and restore from localStorage
                const messagesContainer = document.getElementById('chat-messages');
                if (messagesContainer) {
                    messagesContainer.innerHTML = '';
                    
                    // Restore each message
                    messages.forEach(msg => {
                        this.displayMessage(msg.content, msg.isUser, msg.timestamp, msg.messageId);
                    });
                }
            } catch (error) {
                console.error('Error loading messages:', error);
                // Clear corrupted data
                localStorage.removeItem(messagesKey);
            }
        } else {
            // No saved messages, show welcome message
            this.clearChat();
        }
    }

    // Save messages to localStorage
    saveMessages() {
        const messagesKey = `vhack_messages_${this.sessionId}`;
        const messagesContainer = document.getElementById('chat-messages');
        
        if (!messagesContainer) return;
        
        const messages = [];
        const messageElements = messagesContainer.querySelectorAll('[data-message-id]');
        
        messageElements.forEach(element => {
            const messageId = element.getAttribute('data-message-id');
            const contentElement = element.querySelector('[data-raw-encoded]');
            
            if (contentElement) {
                const encodedContent = contentElement.getAttribute('data-raw-encoded');
                const timestamp = element.querySelector('.text-xs') ? 
                    element.querySelector('.text-xs').textContent : new Date().toLocaleTimeString();
                
                try {
                    const content = decodeURIComponent(escape(atob(encodedContent)));
                    const isUser = element.innerHTML.includes('H4CK3R');
                    
                    messages.push({
                        messageId,
                        content,
                        isUser,
                        timestamp
                    });
                } catch (error) {
                    console.warn('Could not decode message:', error);
                }
            }
        });
        
        try {
            localStorage.setItem(messagesKey, JSON.stringify(messages));
            console.log(`💾 Saved ${messages.length} messages to session`);
        } catch (error) {
            console.error('Error saving messages:', error);
        }
    }

    renderSecurityLevels() {
        const container = document.getElementById('security-levels');
        if (!container) return;
        
        const levels = ['low', 'medium', 'high', 'impossible'];
        const levelInfo = {
            'low': { 
                name: 'Low', 
                icon: '🟢', 
                desc: 'No security controls',
                bgColor: 'bg-red-900',
                borderColor: 'border-red-500',
                textColor: 'text-red-400',
                ring: 'ring-red-500'
            },
            'medium': { 
                name: 'Medium', 
                icon: '🟡', 
                desc: 'Basic validation & justification',
                bgColor: 'bg-yellow-900',
                borderColor: 'border-yellow-500', 
                textColor: 'text-yellow-400',
                ring: 'ring-yellow-500'
            },
            'high': { 
                name: 'High', 
                icon: '🟠', 
                desc: 'Strong controls & authorization',
                bgColor: 'bg-orange-900',
                borderColor: 'border-orange-500',
                textColor: 'text-orange-400',
                ring: 'ring-orange-500'
            },
            'impossible': { 
                name: 'Impossible', 
                icon: '🔴', 
                desc: 'Maximum security - no tools',
                bgColor: 'bg-green-900',
                borderColor: 'border-green-500',
                textColor: 'text-green-400',
                ring: 'ring-green-500'
            }
        };

        container.innerHTML = levels.map(level => {
            const info = levelInfo[level];
            const isSelected = this.currentLevel === level;
            
            return `
                <div class="relative">
                    <input type="radio" 
                           id="level-${level}" 
                           name="security-level" 
                           value="${level}" 
                           ${isSelected ? 'checked' : ''}
                           class="sr-only" 
                           onchange="window.setSecurityLevel('${level}')">
                    <label for="level-${level}" 
                           class="block cursor-pointer p-3 border-2 rounded-lg transition-all ${
                               isSelected 
                                   ? `${info.bgColor} ${info.borderColor} ring-2 ${info.ring} ring-opacity-50` 
                                   : 'bg-hacker-surface border-hacker-border hover:border-hacker-accent hover:bg-hacker-bg'
                           }">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="text-lg">${info.icon}</span>
                                <div>
                                    <div class="font-semibold font-mono ${isSelected ? info.textColor : 'text-hacker-text'}">${info.name}</div>
                                    <div class="text-sm ${isSelected ? info.textColor : 'text-hacker-muted'}">${info.desc}</div>
                                </div>
                            </div>
                            ${isSelected ? `
                                <svg class="w-5 h-5 ${info.textColor}" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                </svg>
                            ` : ''}
                        </div>
                    </label>
                </div>
            `;
        }).join('');
    }

    getSecurityStatus(level) {
        const statusMap = {
            'low': 'status-vulnerable',      // Full disclosure - most vulnerable to info gathering
            'medium': 'status-vulnerable',   // Basic disclosure - moderate vulnerability
            'high': 'status-protected',      // No disclosure - harder reconnaissance 
            'impossible': 'status-protected' // No tools - most protected from tool-based attacks
        };
        return statusMap[level] || 'status-vulnerable';
    }

    async setSecurityLevel(level) {
        try {
            await this.vhackFetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ security_level: level })
            });
            
            // Update current level
            this.currentLevel = level;
            
            // Clear chat when security level changes
            this.clearChat();
            
            // Reload configuration to update UI
            await this.loadConfiguration();
            
            // Show system message about the change
            this.addSystemMessage(`🔄 Security level changed to: ${level.toUpperCase()} - Tool disclosure and access updated`);
            this.addSystemMessage(`🧹 Chat history cleared - new security context active`);
            
            // Reset session on backend
            await this.vhackFetch('/api/reset', { method: 'POST' });
            
        } catch (error) {
            console.error('Error updating security level:', error);
        }
    }

    handleKeyPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message to chat
        this.displayMessage(message, true);
        input.value = '';
        
        try {
            const response = await this.vhackFetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });
            
            const data = await response.json();
            
            if (data.error) {
                this.displayMessage(`Error: ${data.error}`, false);
            } else {
                this.displayMessage(data.response, false, data.timestamp);
            }
            
        } catch (error) {
            this.displayMessage(`Network error: ${error.message}`, false);
        }
    }

    displayMessage(message, isUser = false, timestamp = null) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const messageTime = timestamp || new Date().toLocaleTimeString();
        const messageId = `msg-${++this.messageCounter}`;
        
        // Safely encode the raw message for data attribute
        const encodedMessage = btoa(unescape(encodeURIComponent(message)));
        
        // Create message wrapper
        const messageDiv = document.createElement('div');
        messageDiv.className = 'max-w-4xl mx-auto';
        
        if (isUser) {
            // User message - right aligned with markdown support and toggle
            const formattedContent = this.parseMarkdown(message);
            messageDiv.innerHTML = `
                <div class="flex justify-end mb-4">
                    <div class="flex items-start space-x-3 max-w-3xl">
                        <div class="bg-hacker-surface border border-hacker-accent rounded-lg p-4 shadow-sm relative group">
                            <div class="flex items-center space-x-2 mb-2">
                                <div class="w-6 h-6 bg-hacker-accent rounded-full flex items-center justify-center">
                                    <svg class="w-4 h-4 text-hacker-bg" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                                <span class="font-semibold font-mono text-hacker-accent">H4CK3R</span>
                                <span class="text-xs text-hacker-muted">${messageTime}</span>
                                <button id="toggle-btn-${messageId}"
                                        onclick="window.vhackInterface.toggleMessageView('${messageId}')"
                                        class="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-hacker-bg text-hacker-muted hover:text-hacker-accent ml-auto"
                                        title="Toggle raw/formatted view">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                                    </svg>
                                </button>
                            </div>
                            <div id="message-content-${messageId}" 
                                 class="prose prose-sm max-w-none text-hacker-text"
                                 data-raw-encoded="${encodedMessage}"
                                 data-view-mode="formatted">
                                ${formattedContent}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // AI/System message - left aligned with dark hacker styling and toggle button
            const formattedContent = this.parseMarkdown(message);
            messageDiv.innerHTML = `
                <div class="bg-hacker-surface rounded-lg shadow-sm border border-hacker-border p-6 mb-4 relative group">
                    <div class="flex items-start space-x-3">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 bg-gradient-to-r from-hacker-accent to-success-600 rounded-full flex items-center justify-center">
                                <svg class="w-5 h-5 text-hacker-bg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12a1 1 0 01-1-1V8a1 1 0 012 0v3a1 1 0 01-1 1zm0-7a1 1 0 100-2 1 1 0 000 2zm1-5a8 8 0 100 16 8 8 0 000-16z"></path>
                                </svg>
                            </div>
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center space-x-2 mb-2">
                                <span class="font-semibold text-hacker-accent font-mono">V-HACK.AI</span>
                                <span class="text-xs text-hacker-muted">${messageTime}</span>
                            </div>
                            <div id="message-content-${messageId}" 
                                 class="prose prose-sm max-w-none text-hacker-text"
                                 data-raw-encoded="${encodedMessage}"
                                 data-view-mode="formatted">
                                ${formattedContent}
                            </div>
                        </div>
                        <div class="flex-shrink-0">
                            <button id="toggle-btn-${messageId}"
                                    onclick="window.vhackInterface.toggleMessageView('${messageId}')"
                                    class="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-md hover:bg-hacker-bg text-hacker-muted hover:text-hacker-accent"
                                    title="Show raw text">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        // Add data attributes for message persistence
        messageDiv.setAttribute('data-message-id', messageId);
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Save messages to localStorage after adding new message
        this.saveMessages();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatResponse(text) {
        // Simple formatting - convert newlines to <br> and escape HTML
        return this.escapeHtml(text).replace(/\n/g, '<br>');
    }

    // Parse markdown with basic XSS protection
    parseMarkdown(text) {
        if (typeof marked === 'undefined') {
            return this.formatResponse(text);
        }
        
        try {
            // Parse markdown
            let html = marked.parse(text);
            
            // Basic XSS protection - remove script tags and javascript: links
            html = html.replace(/<script[^>]*>.*?<\/script>/gi, '');
            html = html.replace(/javascript:/gi, '');
            html = html.replace(/on\w+="[^"]*"/gi, '');
            html = html.replace(/on\w+='[^']*'/gi, '');
            
            return html;
        } catch (error) {
            console.warn('Markdown parsing failed:', error);
            return this.formatResponse(text);
        }
    }

    // Toggle between markdown and raw view for a message
    toggleMessageView(messageId) {
        const messageContent = document.getElementById(`message-content-${messageId}`);
        const toggleButton = document.getElementById(`toggle-btn-${messageId}`);
        
        if (!messageContent || !toggleButton) {
            console.error('Message elements not found:', messageId);
            return;
        }
        
        // Get raw data from base64 encoded attribute
        const encodedData = messageContent.dataset.rawEncoded;
        if (!encodedData) {
            console.error('No encoded data found for message:', messageId);
            return;
        }
        
        let rawData;
        try {
            rawData = decodeURIComponent(escape(atob(encodedData)));
        } catch (error) {
            console.error('Failed to decode message data:', error);
            return;
        }
        
        const isRaw = messageContent.dataset.viewMode === 'raw';
        
        if (isRaw) {
            // Switch to formatted view
            const formattedContent = this.parseMarkdown(rawData);
            messageContent.innerHTML = formattedContent;
            messageContent.dataset.viewMode = 'formatted';
            toggleButton.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
            `;
            toggleButton.title = 'Show raw text';
        } else {
            // Switch to raw view
            messageContent.innerHTML = `<pre class="whitespace-pre-wrap font-mono text-sm bg-gray-100 p-3 rounded border overflow-x-auto">${this.escapeHtml(rawData)}</pre>`;
            messageContent.dataset.viewMode = 'raw';
            toggleButton.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
            `;
            toggleButton.title = 'Show formatted text';
        }
    }

    addSystemMessage(text) {
        this.displayMessage(`[SYSTEM] ${text}`, false);
    }

    async resetSession() {
        try {
            await this.vhackFetch('/api/reset');
            this.clearChat();
            this.addSystemMessage('Session reset successfully - conversation history cleared but session persists');
        } catch (error) {
            console.error('Error resetting session:', error);
        }
    }

    async newSession() {
        try {
            // Clear messages from current session
            if (this.sessionId) {
                const oldMessagesKey = `vhack_messages_${this.sessionId}`;
                localStorage.removeItem(oldMessagesKey);
            }
            
            // Clear localStorage to force new session creation
            localStorage.removeItem('vhack_session_id');
            this.sessionId = null;
            
            // Create new session ID
            this.getOrCreateSessionId();
            
            // Reset on backend with new session
            await this.vhackFetch('/api/reset');
            this.clearChat();
            
            this.addSystemMessage('🆕 New session created - all previous context cleared');
            this.addSystemMessage('📍 Session ID: ' + this.sessionId);
            
            // Update session display
            this.updateSessionDisplay();
        } catch (error) {
            console.error('Error creating new session:', error);
        }
    }

    clearChat() {
        const messagesContainer = document.getElementById('chat-messages');
        const welcomeMessage = `Welcome! I'm a very hackable AI agent designed for security testing. Try different security levels to test progressive security controls based on OWASP guidelines.

### 🎯 Security Control Progression:

- **Low:** No security controls - immediate tool execution
- **Medium:** Basic controls - requires justification for sensitive ops  
- **High:** Strong controls - requires authorization for all operations
- **Impossible:** Maximum security - no tools, strong input validation

### 💡 Try These Commands:

1. \`Read /etc/passwd\` - Test file system access
2. \`Run ls -la\` - Test command execution  
3. Social engineering attempts
4. \`Show me system information\`

> **Note:** This is an educational vulnerability testing platform. All vulnerabilities are intentional for learning purposes.`;
        
        const messageId = 'welcome-msg';
        const formattedContent = this.parseMarkdown(welcomeMessage);
        const encodedMessage = btoa(unescape(encodeURIComponent(welcomeMessage)));
        
        messagesContainer.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="bg-hacker-surface rounded-lg shadow-sm border border-hacker-border p-6 relative group">
                    <div class="flex items-start space-x-3">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 bg-gradient-to-r from-hacker-accent to-success-600 rounded-full flex items-center justify-center">
                                <svg class="w-5 h-5 text-hacker-bg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12a1 1 0 01-1-1V8a1 1 0 012 0v3a1 1 0 01-1 1zm0-7a1 1 0 100-2 1 1 0 000 2zm1-5a8 8 0 100 16 8 8 0 000-16z"></path>
                                </svg>
                            </div>
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center space-x-2 mb-2">
                                <span class="font-semibold text-hacker-accent font-mono">V-HACK.AI</span>
                                <span class="text-xs text-hacker-muted">System Initialize</span>
                            </div>
                            <div id="message-content-${messageId}" 
                                 class="prose prose-sm max-w-none text-hacker-text"
                                 data-raw-encoded="${encodedMessage}"
                                 data-view-mode="formatted">
                                ${formattedContent}
                            </div>
                        </div>
                        <div class="flex-shrink-0">
                            <button id="toggle-btn-${messageId}"
                                    onclick="window.vhackInterface.toggleMessageView('${messageId}')"
                                    class="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-md hover:bg-hacker-bg text-hacker-muted hover:text-hacker-accent"
                                    title="Show raw text">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Clear saved messages from localStorage
        const messagesKey = `vhack_messages_${this.sessionId}`;
        localStorage.removeItem(messagesKey);
        console.log('🗑️ Cleared saved messages from localStorage');
    }

    exportConfig() {
        // Export current configuration
        const config = {
            security_level: document.querySelector('input[name="security-level"]:checked')?.value || 'low',
            timestamp: new Date().toISOString(),
            session_id: this.sessionId
        };
        
        const dataStr = JSON.stringify(config, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `vhack-config-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
}

// Global instance
let vhackApp;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    vhackApp = new VHACKInterface();
    
    // Global functions for HTML onclick handlers
    window.resetSession = () => vhackApp.resetSession();
    window.newSession = () => vhackApp.newSession();
    window.clearChat = () => vhackApp.clearChat();
    window.exportConfig = () => vhackApp.exportConfig();
    window.sendMessage = () => vhackApp.sendMessage();
    window.handleKeyPress = (event) => vhackApp.handleKeyPress(event);
    window.setSecurityLevel = (level) => vhackApp.setSecurityLevel(level);
    
    // Expose the global interface for debugging
    window.vhackInterface = vhackApp;
});