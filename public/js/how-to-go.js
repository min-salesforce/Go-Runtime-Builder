/* How to Go AI Chat Interface */

class HowToGoChat {
    constructor() {
        this.messages = [];
        this.conversationState = {
            setupType: null,
            metadata: {},
            configuration: {},
            assets: {},
            features: []
        };
        
        this.initializeElements();
        this.bindEvents();
        this.setupAutoResize();
    }
    
    initializeElements() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.configPanel = document.getElementById('configPanel');
        this.configContent = document.getElementById('configContent');
        this.generatePagesBtn = document.getElementById('generatePages');
        this.restartChatBtn = document.getElementById('restartChat');
        this.connectionStatus = document.getElementById('connectionStatus');
        
        // Quick action buttons
        this.quickActionBtns = document.querySelectorAll('.quick-action-btn');
    }
    
    bindEvents() {
        // Send message events
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Input validation
        this.messageInput.addEventListener('input', () => {
            this.validateInput();
        });
        
        // Quick actions
        this.quickActionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            });
        });
        
        // Configuration panel actions
        this.generatePagesBtn.addEventListener('click', () => this.generatePages());
        this.restartChatBtn.addEventListener('click', () => this.restartChat());
        
        // Minimize config panel
        document.getElementById('minimizeConfig').addEventListener('click', () => {
            this.configPanel.style.display = 'none';
        });
    }
    
    setupAutoResize() {
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 100) + 'px';
        });
    }
    
    validateInput() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText;
    }
    
    async sendMessage() {
        const text = this.messageInput.value.trim();
        if (!text) return;
        
        // Add user message to chat
        this.addMessage('user', text);
        
        // Clear input
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        this.validateInput();
        
        // Show typing indicator
        this.showTyping();
        
        try {
            // Send to AI backend
            const response = await this.sendToAI(text);
            
            // Hide typing indicator
            this.hideTyping();
            
            // Add AI response
            this.addMessage('ai', response.message);
            
            // Update conversation state if provided
            if (response.conversationState) {
                this.conversationState = response.conversationState;
                this.updateConversationState(response.conversationState);
            } else if (response.state) {
                this.updateConversationState(response.state);
            }
            
            // Update generate button based on AI assessment
            if (response.canGenerate !== undefined) {
                this.generatePagesBtn.disabled = !response.canGenerate;
            }
            
            // Show auto-generation notification if content was generated
            if (response.autoGenerate) {
                this.showAutoGenerationNotification(response.conversationState);
            }
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTyping();
            this.addMessage('ai', "I'm sorry, I encountered an error. Please try again or restart the conversation.");
            this.updateConnectionStatus('error');
        }
    }
    
    async sendToAI(message) {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                conversationHistory: this.buildConversationHistory(),
                conversationState: this.conversationState
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to send message to AI');
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'AI service error');
        }
        
        return {
            message: data.message,
            state: data.state,
            canGenerate: data.canGenerate
        };
    }
    
    buildConversationHistory() {
        // Convert messages to chat format for AI
        return this.messages.map(msg => ({
            role: msg.type === 'ai' ? 'assistant' : 'user',
            content: msg.text
        }));
    }
    

    
    handleQuickAction(action) {
        const quickMessages = {
            'feature': "I want to build a feature or capability that users can interact with.",
            'agent': "I'm setting up an AI-powered agent or intelligent automation."
        };
        
        const message = quickMessages[action];
        if (message) {
            this.messageInput.value = message;
            this.validateInput();
            // Focus input for further editing if desired
            this.messageInput.focus();
        }
    }
    
    addMessage(type, text, isHtml = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = type === 'ai' ? 'AI' : '👤';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        // If HTML is passed directly, use it as-is, otherwise format markdown
        const formattedText = isHtml ? text : this.formatMessage(text);
        content.innerHTML = formattedText;
        
        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = this.formatTime(new Date());
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        messageDiv.appendChild(time);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Store message
        this.messages.push({ type, text, timestamp: new Date() });
    }
    
    formatMessage(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/(\d+)\.\s/g, '<br><strong>$1.</strong> ');
    }
    
    formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    showTyping() {
        this.typingIndicator.style.display = 'flex';
        this.updateConnectionStatus('thinking');
    }
    
    hideTyping() {
        this.typingIndicator.style.display = 'none';
        this.updateConnectionStatus('ready');
    }
    
    updateConnectionStatus(status) {
        const statusText = document.querySelector('.status-text');
        const indicator = this.connectionStatus;
        
        switch (status) {
            case 'thinking':
                statusText.textContent = 'AI is thinking...';
                indicator.style.color = '#f39800';
                break;
            case 'error':
                statusText.textContent = 'Connection error';
                indicator.style.color = '#d83b01';
                break;
            default:
                statusText.textContent = 'Ready';
                indicator.style.color = '#4bca81';
        }
    }
    
    updateConversationState(newState) {
        Object.assign(this.conversationState, newState);
        
        // Update configuration panel
        this.updateConfigurationPanel();
        
        // Show configuration panel if we have meaningful state
        if (this.conversationState.setupType) {
            this.configPanel.style.display = 'block';
        }
    }
    
    showAutoGenerationNotification(state) {
        // Add a visual indication that content was auto-generated
        if (state && state.metadata) {
            setTimeout(() => {
                this.addMessage('ai', `🎉 **Perfect!** I've generated a complete page configuration for you with contextually appropriate content. You can now generate your page immediately, or continue chatting to refine any details.`);
                
                // Animate the generate button to draw attention
                this.generatePagesBtn.style.animation = 'pulse 2s infinite';
                setTimeout(() => {
                    this.generatePagesBtn.style.animation = '';
                }, 6000);
            }, 500);
        }
    }
    
    updateConfigurationPanel() {
        let html = '';
        
        if (this.conversationState.setupType) {
            html += `<div class="config-item">
                <strong>Setup Type:</strong> ${this.formatSetupType(this.conversationState.setupType)}
            </div>`;
        }
        
        if (this.conversationState.metadata && this.conversationState.metadata.name) {
            html += `<div class="config-item">
                <strong>Name:</strong> ${this.conversationState.metadata.name}
            </div>`;
            
            if (this.conversationState.metadata.description) {
                html += `<div class="config-item">
                    <strong>Description:</strong> ${this.conversationState.metadata.description}
                </div>`;
            }
            
            // Show auto-generated content preview
            if (this.conversationState.stage === 'ready-to-generate') {
                html += `<div class="config-item auto-generated">
                    <strong>✨ Auto-Generated Content:</strong> Contextual placeholder content ready for your domain
                </div>`;
                
                if (this.conversationState.setupType === 'agent-setup' && this.conversationState.agentforce) {
                    const templates = this.conversationState.agentforce.templates;
                    if (templates && templates.length > 0 && templates[0].steps) {
                        const steps = templates[0].steps;
                        if (Array.isArray(steps) && steps.length > 0) {
                            html += `<div class="config-item">
                                <strong>Agent Steps:</strong> ${steps.length} configuration steps defined
                            </div>`;
                        }
                    }
                } else if (this.conversationState.features && this.conversationState.features.length > 0) {
                    html += `<div class="config-item">
                        <strong>Features:</strong> ${this.conversationState.features.length} feature(s) configured
                    </div>`;
                }
                
                if (this.conversationState.metadata && this.conversationState.metadata.cloud) {
                    html += `<div class="config-item">
                        <strong>Cloud:</strong> ${this.conversationState.metadata.cloud}
                    </div>`;
                }
            }
        }
        
        if (this.conversationState.detectedIntent) {
            html += `<div class="config-item">
                <strong>Status:</strong> ${this.formatStage(this.conversationState.stage || 'requirements-gathering')}
            </div>`;
        }
        
        if (html) {
            html = '<div class="config-items">' + html + '</div>';
            this.configContent.innerHTML = html;
            
            // Enable generate button if we have enough information
            const canGenerate = this.conversationState.setupType && this.conversationState.metadata && this.conversationState.metadata.name;
            this.generatePagesBtn.disabled = !canGenerate;
        }
    }
    
    formatStage(stage) {
        const stages = {
            'discovery': 'Exploring options',
            'requirements-gathering': 'Gathering requirements',
            'ready-to-generate': '🚀 Ready to generate!'
        };
        return stages[stage] || stage;
    }
    
    formatSetupType(type) {
        const types = {
            'feature-set-and-features': 'Feature Set & Features',
            'feature': 'Individual Feature', 
            'solution-initial-setup': 'Solution/Initial Setup',
            'agent-setup': 'Agent Setup'
        };
        return types[type] || type;
    }
    
    async generatePages() {
        if (!this.conversationState.setupType) return;
        
        try {
            this.generatePagesBtn.disabled = true;
            this.generatePagesBtn.textContent = 'Saving...';
            
            // Save the page permanently and get shareable URL
            const response = await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session: this.conversationState
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                const pageType = this.conversationState.setupType === 'agent-setup' ? 'Agent' : 'Feature';
                const icon = this.conversationState.setupType === 'agent-setup' ? '🤖' : '🎯';
                
                // Show success message with permanent URL
                const successMsg = `🎉 Perfect! Your page has been saved and is now accessible at a permanent URL!\n\n**${icon} Your Saved Page:**\n• <a href="${result.url}" target="_blank" style="color: #0176d3; text-decoration: underline; font-weight: bold;">${pageType} Page: ${result.name}</a>\n\n**📋 Shareable URL:** <code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-size: 12px;">${result.permanentUrl}</code>\n\nThis URL will remain accessible permanently and can be shared with others. The page includes all interactive features like edit mode and ownership toggle.`;
                this.addMessage('ai', successMsg, true);
                
                // Also show a copy-to-clipboard option
                this.addCopyUrlOption(result.permanentUrl, result.name);
                
                // Reset the generate button
                this.generatePagesBtn.textContent = '💾 Save & Get URL';
                this.generatePagesBtn.disabled = false;
            } else {
                throw new Error(result.error || 'Save failed');
            }
        } catch (error) {
            console.error('Error saving page:', error);
            this.addMessage('ai', "I encountered an error while saving your page. Please check your configuration and try again.");
            this.generatePagesBtn.textContent = '💾 Save & Get URL';
            this.generatePagesBtn.disabled = false;
        }
    }
    
    addCopyUrlOption(url, name) {
        const copyDiv = document.createElement('div');
        copyDiv.className = 'copy-url-option';
        copyDiv.style.cssText = 'margin-top: 16px; padding: 12px; background: #f8f9fa; border-radius: 8px; border-left: 3px solid #4bca81;';
        
        copyDiv.innerHTML = `
            <div style="font-size: 14px; font-weight: 500; margin-bottom: 8px;">📋 Quick Share</div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <input type="text" value="${url}" readonly style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 12px;">
                <button onclick="navigator.clipboard.writeText('${url}').then(() => { this.textContent = '✅ Copied!'; setTimeout(() => this.textContent = '📋 Copy URL', 2000); })" style="padding: 8px 12px; background: #0176d3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">📋 Copy URL</button>
            </div>
        `;
        
        // Add to the last AI message
        const lastMessage = this.chatMessages.lastElementChild;
        if (lastMessage && lastMessage.classList.contains('ai-message')) {
            lastMessage.appendChild(copyDiv);
        }
    }
    
    restartChat() {
        // Clear messages
        this.chatMessages.innerHTML = '';
        
        // Reset state
        this.messages = [];
        this.conversationState = {
            setupType: null,
            metadata: {},
            configuration: {},
            assets: {},
            features: []
        };
        
        // Hide config panel
        this.configPanel.style.display = 'none';
        
        // Add initial message
        this.addMessage('ai', "Hi! I'm your Salesforce Go assistant. I'm here to help you create the perfect configuration pages that follow all the official guidelines and standards.\n\nI understand the canonical rules, page hierarchies, and can guide you through the decision tree to determine the best setup type for your needs.\n\n**Let's get started:** What are you trying to build or configure in Salesforce?");
        
        // Reset input
        this.messageInput.value = '';
        this.validateInput();
        this.messageInput.focus();
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the chat when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new HowToGoChat();
});
