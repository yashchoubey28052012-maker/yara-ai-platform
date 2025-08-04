// Global variables
let currentDocumentType = 'word';
let chatHistory = [];
let modalChatHistory = [];

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const chatModal = document.getElementById('chatModal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeDocumentTypes();
    initializeVideoUpload();
    initializeContactForm();
});

// Event Listeners
function initializeEventListeners() {
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Document type selection
    const docTypes = document.querySelectorAll('.doc-type');
    docTypes.forEach(type => {
        type.addEventListener('click', () => selectDocumentType(type.dataset.type));
    });

    // Chat input handlers
    const chatInput = document.getElementById('chatInput');
    const modalChatInput = document.getElementById('modalChatInput');
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendMessage();
        });
    }
    
    if (modalChatInput) {
        modalChatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendModalMessage();
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === chatModal) {
            closeChat();
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Smooth Scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Document Creator Functions
function initializeDocumentTypes() {
    selectDocumentType('word');
}

function selectDocumentType(type) {
    currentDocumentType = type;
    
    // Update active state
    document.querySelectorAll('.doc-type').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-type="${type}"]`).classList.add('active');
    
    // Update placeholder text
    const placeholder = getPlaceholderText(type);
    document.getElementById('documentPrompt').placeholder = placeholder;
}

function getPlaceholderText(type) {
    const placeholders = {
        word: "Describe the document you want to create (e.g., 'Create a business proposal for a new mobile app with market analysis, financial projections, and implementation timeline')",
        excel: "Describe the spreadsheet you need (e.g., 'Create a comprehensive budget tracker with monthly expenses, income categories, and savings goals with charts')",
        powerpoint: "Describe your presentation (e.g., 'Create a 10-slide presentation about renewable energy benefits, including statistics, case studies, and future outlook')"
    };
    return placeholders[type] || "Describe what you want to create...";
}

function generateDocument() {
    const prompt = document.getElementById('documentPrompt').value.trim();
    if (!prompt) {
        alert('Please describe what document you want to create');
        return;
    }

    const preview = document.getElementById('documentPreview');
    preview.style.display = 'block';
    preview.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Generating your document with AI...</div>';

    // Simulate AI document generation with more realistic timing
    setTimeout(() => {
        const content = generateDocumentContent(currentDocumentType, prompt);
        preview.innerHTML = content;
        
        // Add download and edit buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 1rem; margin-top: 2rem; justify-content: center;';
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'btn btn-primary';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Document';
        downloadBtn.onclick = () => downloadDocument(currentDocumentType, prompt);
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-outline';
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Document';
        editBtn.onclick = () => editDocument(currentDocumentType, prompt);
        
        const regenerateBtn = document.createElement('button');
        regenerateBtn.className = 'btn btn-secondary';
        regenerateBtn.innerHTML = '<i class="fas fa-redo"></i> Regenerate';
        regenerateBtn.onclick = () => generateDocument();
        
        buttonContainer.appendChild(downloadBtn);
        buttonContainer.appendChild(editBtn);
        buttonContainer.appendChild(regenerateBtn);
        preview.appendChild(buttonContainer);
    }, 3000);
}

function generateDocumentContent(type, prompt) {
    const templates = {
        word: `
            <div class="document-header">
                <h3><i class="fas fa-file-word"></i> Generated Word Document</h3>
                <div class="document-meta">
                    <span><i class="fas fa-calendar"></i> ${new Date().toLocaleDateString()}</span>
                    <span><i class="fas fa-user"></i> Created by Yara AI</span>
                    <span><i class="fas fa-file-alt"></i> ${Math.floor(Math.random() * 5 + 3)} pages</span>
                </div>
            </div>
            <div class="document-content">
                <h4>${prompt}</h4>
                
                <h5>Executive Summary</h5>
                <p>This comprehensive document has been generated based on your specific request: "${prompt}". Our AI has analyzed your requirements and created a structured document with relevant sections, professional formatting, and actionable content.</p>
                
                <h5>Key Highlights</h5>
                <ul>
                    <li>Comprehensive analysis of the requested topic</li>
                    <li>Data-driven insights and recommendations</li>
                    <li>Professional formatting and structure</li>
                    <li>Ready-to-use templates and frameworks</li>
                </ul>
                
                <h5>Main Content</h5>
                <p>The document includes detailed sections covering all aspects of your request. Each section has been carefully crafted to provide maximum value and actionable insights. The content is structured to be both informative and practical, ensuring you can immediately implement the recommendations.</p>
                
                <h5>Conclusion and Next Steps</h5>
                <p>This AI-generated document provides a solid foundation for your project. The recommendations and insights can be customized further based on your specific requirements and organizational needs.</p>
                
                <div class="document-stats">
                    <div class="stat-item">
                        <strong>Word Count:</strong> ${Math.floor(Math.random() * 2000 + 1500)}
                    </div>
                    <div class="stat-item">
                        <strong>Reading Time:</strong> ${Math.floor(Math.random() * 8 + 5)} minutes
                    </div>
                    <div class="stat-item">
                        <strong>Complexity:</strong> Professional
                    </div>
                </div>
            </div>
        `,
        excel: `
            <div class="document-header">
                <h3><i class="fas fa-file-excel"></i> Generated Excel Spreadsheet</h3>
                <div class="document-meta">
                    <span><i class="fas fa-calendar"></i> ${new Date().toLocaleDateString()}</span>
                    <span><i class="fas fa-user"></i> Created by Yara AI</span>
                    <span><i class="fas fa-table"></i> ${Math.floor(Math.random() * 5 + 3)} worksheets</span>
                </div>
            </div>
            <div class="document-content">
                <h4>${prompt}</h4>
                
                <h5>Spreadsheet Overview</h5>
                <p>This intelligent spreadsheet has been designed based on your requirements. It includes multiple worksheets, automated calculations, and professional formatting.</p>
                
                <div class="excel-preview">
                    <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem;">
                        <thead>
                            <tr style="background: #667eea; color: white;">
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Category</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Amount</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Date</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Status</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="background: #f8f9fa;">
                                <td style="border: 1px solid #ddd; padding: 12px;">Sample Category A</td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$${Math.floor(Math.random() * 5000 + 1000)}</td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${new Date().toLocaleDateString()}</td>
                                <td style="border: 1px solid #ddd; padding: 12px;"><span style="background: #28a745; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">Active</span></td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${Math.floor(Math.random() * 100)}%</td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 12px;">Sample Category B</td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$${Math.floor(Math.random() * 5000 + 1000)}</td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${new Date().toLocaleDateString()}</td>
                                <td style="border: 1px solid #ddd; padding: 12px;"><span style="background: #ffc107; color: black; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">Pending</span></td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${Math.floor(Math.random() * 100)}%</td>
                            </tr>
                            <tr style="background: #f8f9fa;">
                                <td style="border: 1px solid #ddd; padding: 12px;">Sample Category C</td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$${Math.floor(Math.random() * 5000 + 1000)}</td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${new Date().toLocaleDateString()}</td>
                                <td style="border: 1px solid #ddd; padding: 12px;"><span style="background: #28a745; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">Complete</span></td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">100%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <h5>Features Included</h5>
                <ul>
                    <li>Automated calculations and formulas</li>
                    <li>Data validation and error checking</li>
                    <li>Professional charts and graphs</li>
                    <li>Conditional formatting</li>
                    <li>Summary dashboards</li>
                </ul>
                
                <div class="document-stats">
                    <div class="stat-item">
                        <strong>Worksheets:</strong> ${Math.floor(Math.random() * 5 + 3)}
                    </div>
                    <div class="stat-item">
                        <strong>Formulas:</strong> ${Math.floor(Math.random() * 50 + 20)}
                    </div>
                    <div class="stat-item">
                        <strong>Charts:</strong> ${Math.floor(Math.random() * 8 + 3)}
                    </div>
                </div>
            </div>
        `,
        powerpoint: `
            <div class="document-header">
                <h3><i class="fas fa-file-powerpoint"></i> Generated PowerPoint Presentation</h3>
                <div class="document-meta">
                    <span><i class="fas fa-calendar"></i> ${new Date().toLocaleDateString()}</span>
                    <span><i class="fas fa-user"></i> Created by Yara AI</span>
                    <span><i class="fas fa-images"></i> ${Math.floor(Math.random() * 15 + 8)} slides</span>
                </div>
            </div>
            <div class="document-content">
                <h4>${prompt}</h4>
                
                <h5>Presentation Overview</h5>
                <p>This professional presentation has been crafted to effectively communicate your message with engaging visuals, clear structure, and compelling content.</p>
                
                <div class="slides-preview">
                    <div class="slide-item" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; margin: 1rem 0; border-radius: 10px; text-align: center;">
                        <h5>Slide 1: Title Slide</h5>
                        <h6 style="font-size: 1.2rem; margin: 1rem 0;">${prompt}</h6>
                        <p>Presented by: Yara AI Assistant</p>
                        <p>Date: ${new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <div class="slide-item" style="background: #f8f9fa; padding: 2rem; margin: 1rem 0; border-radius: 10px; border-left: 4px solid #667eea;">
                        <h5>Slide 2: Agenda & Overview</h5>
                        <ul style="text-align: left; margin: 1rem 0;">
                            <li>Introduction and objectives</li>
                            <li>Key concepts and definitions</li>
                            <li>Main content and analysis</li>
                            <li>Case studies and examples</li>
                            <li>Conclusions and recommendations</li>
                            <li>Q&A and next steps</li>
                        </ul>
                    </div>
                    
                    <div class="slide-item" style="background: #f8f9fa; padding: 2rem; margin: 1rem 0; border-radius: 10px; border-left: 4px solid #28a745;">
                        <h5>Slide 3: Key Statistics</h5>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 1rem 0;">
                            <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px;">
                                <div style="font-size: 2rem; font-weight: bold; color: #667eea;">${Math.floor(Math.random() * 100)}%</div>
                                <div style="font-size: 0.9rem; color: #666;">Growth Rate</div>
                            </div>
                            <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px;">
                                <div style="font-size: 2rem; font-weight: bold; color: #28a745;">${Math.floor(Math.random() * 500)}K</div>
                                <div style="font-size: 0.9rem; color: #666;">Users</div>
                            </div>
                            <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px;">
                                <div style="font-size: 2rem; font-weight: bold; color: #ffc107;">${Math.floor(Math.random() * 50)}M</div>
                                <div style="font-size: 0.9rem; color: #666;">Revenue</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="slide-item" style="background: #f8f9fa; padding: 2rem; margin: 1rem 0; border-radius: 10px; border-left: 4px solid #dc3545;">
                        <h5>Slide ${Math.floor(Math.random() * 15 + 8)}: Conclusion</h5>
                        <p>Summary of key findings and actionable recommendations for implementation.</p>
                        <div style="background: white; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                            <strong>Next Steps:</strong>
                            <ul style="margin: 0.5rem 0;">
                                <li>Review and validate findings</li>
                                <li>Develop implementation timeline</li>
                                <li>Assign responsibilities</li>
                                <li>Schedule follow-up meetings</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="document-stats">
                    <div class="stat-item">
                        <strong>Total Slides:</strong> ${Math.floor(Math.random() * 15 + 8)}
                    </div>
                    <div class="stat-item">
                        <strong>Duration:</strong> ${Math.floor(Math.random() * 30 + 15)} minutes
                    </div>
                    <div class="stat-item">
                        <strong>Animations:</strong> Professional
                    </div>
                </div>
            </div>
        `
    };
    
    return templates[type] || '<p>Document generated successfully!</p>';
}

function downloadDocument(type, prompt) {
    // Simulate document download with more realistic content
    const filename = `${prompt.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.${getFileExtension(type)}`;
    
    // Create more detailed content for download
    const content = `
YARA AI GENERATED DOCUMENT
==========================

Document Type: ${type.toUpperCase()}
Title: ${prompt}
Generated: ${new Date().toLocaleString()}
Created by: Yara AI Platform

DOCUMENT SUMMARY:
This document was generated using advanced AI technology based on your specific requirements.
The content has been structured to provide maximum value and actionable insights.

CONTENT OUTLINE:
- Executive Summary
- Main Content Sections
- Data Analysis and Insights
- Recommendations
- Conclusion and Next Steps

For the complete formatted document with professional styling, charts, and detailed content,
please use the full version available through the Yara AI platform.

Visit: https://yara-ai-platform.vercel.app
Contact: support@yara-ai.com

© 2025 Yara AI Platform. All rights reserved.
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Show success message
    showNotification(`Document "${filename}" has been downloaded successfully!`, 'success');
}

function editDocument(type, prompt) {
    showNotification('Opening document editor... This feature will allow you to customize and refine your generated document.', 'info');
}

function getFileExtension(type) {
    const extensions = {
        word: 'docx',
        excel: 'xlsx',
        powerpoint: 'pptx'
    };
    return extensions[type] || 'txt';
}

// Video Editor Functions
function initializeVideoUpload() {
    const uploadArea = document.getElementById('videoUpload');
    const fileInput = document.getElementById('videoFile');
    
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('drop', handleDrop);
        fileInput.addEventListener('change', handleFileSelect);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
    e.currentTarget.style.borderColor = '#5a67d8';
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.style.background = '';
    e.currentTarget.style.borderColor = '#667eea';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleVideoFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleVideoFile(file);
    }
}

function handleVideoFile(file) {
    if (!file.type.startsWith('video/')) {
        showNotification('Please select a video file (MP4, AVI, MOV, WMV)', 'error');
        return;
    }
    
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
        showNotification('File size too large. Please select a video under 100MB.', 'error');
        return;
    }
    
    const preview = document.getElementById('videoPreview');
    preview.style.display = 'block';
    preview.innerHTML = `
        <div class="video-header">
            <h4><i class="fas fa-video"></i> Video Loaded: ${file.name}</h4>
            <div class="video-info">
                <span><i class="fas fa-file"></i> Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                <span><i class="fas fa-clock"></i> Type: ${file.type}</span>
            </div>
        </div>
        <video controls style="width: 100%; max-width: 600px; margin: 1.5rem 0; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <source src="${URL.createObjectURL(file)}" type="${file.type}">
            Your browser does not support the video tag.
        </video>
        <div class="video-actions">
            <p><i class="fas fa-check-circle" style="color: #28a745;"></i> Video is ready for AI-powered editing. Use the tools above to enhance your video.</p>
            <div class="video-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 100%; background: #28a745;"></div>
                </div>
                <span>Upload Complete</span>
            </div>
        </div>
    `;
    
    showNotification('Video uploaded successfully! You can now use AI tools to edit your video.', 'success');
}

function trimVideo() {
    showNotification('🎬 AI Smart Trim activated! This feature analyzes your video and suggests optimal cutting points.', 'info');
}

function addEffects() {
    showNotification('✨ AI Effects library opened! Choose from professional filters, transitions, and visual enhancements.', 'info');
}

function addText() {
    showNotification('📝 AI Text Overlay activated! Add dynamic titles, captions, and animated text to your video.', 'info');
}

function addMusic() {
    showNotification('🎵 AI Music Library opened! Browse royalty-free tracks that match your video\'s mood and tempo.', 'info');
}

function enhanceQuality() {
    showNotification('🔍 AI Quality Enhancement started! Improving resolution, stabilization, and color correction.', 'info');
}

function autoSubtitles() {
    showNotification('💬 AI Auto Subtitles activated! Generating accurate captions with speaker recognition.', 'info');
}

// Chat Functions
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMessageToChat('chatMessages', message, 'user');
    input.value = '';
    
    // Show typing indicator
    addTypingIndicator('chatMessages');
    
    // Simulate AI response with more realistic timing
    setTimeout(() => {
        removeTypingIndicator('chatMessages');
        const response = generateAIResponse(message);
        addMessageToChat('chatMessages', response, 'bot');
    }, 1500);
}

function sendModalMessage() {
    const input = document.getElementById('modalChatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMessageToChat('modalChatMessages', message, 'user');
    input.value = '';
    
    // Show typing indicator
    addTypingIndicator('modalChatMessages');
    
    // Simulate AI response
    setTimeout(() => {
        removeTypingIndicator('modalChatMessages');
        const response = generateAIResponse(message);
        addMessageToChat('modalChatMessages', response, 'bot');
    }, 1500);
}

function askSuggestion(question) {
    document.getElementById('chatInput').value = question;
    sendMessage();
    scrollToSection('chat');
}

function addMessageToChat(containerId, message, sender) {
    const container = document.getElementById(containerId);
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = `<p>${message}</p>`;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    container.appendChild(messageDiv);
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function addTypingIndicator(containerId) {
    const container = document.getElementById(containerId);
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator(containerId) {
    const container = document.getElementById(containerId);
    const typingIndicator = container.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Enhanced AI responses with more context
    if (lowerMessage.includes('document') || lowerMessage.includes('word') || lowerMessage.includes('excel') || lowerMessage.includes('powerpoint')) {
        return `I can help you create professional documents! 📄 Our AI Document Creator supports:
        
        • **Word Documents**: Business proposals, reports, letters, and more
        • **Excel Spreadsheets**: Budget trackers, data analysis, financial models
        • **PowerPoint Presentations**: Pitch decks, training materials, project reports
        
        Simply describe what you need, and I'll generate a complete document with professional formatting, relevant content, and downloadable files. Would you like to try creating a document now?`;
    }
    
    if (lowerMessage.includes('video') || lowerMessage.includes('edit')) {
        return `I can help you edit videos with AI-powered tools! 🎬 Our Video Editor includes:
        
        • **Smart Trimming**: AI analyzes your video for optimal cuts
        • **Professional Effects**: Filters, transitions, and visual enhancements
        • **Text Overlays**: Dynamic titles, captions, and animated text
        • **Background Music**: Royalty-free tracks matched to your content
        • **Quality Enhancement**: Upscaling, stabilization, and color correction
        • **Auto Subtitles**: Accurate captions with speaker recognition
        
        Upload your video and let our AI transform it into professional content!`;
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return `Hello! 👋 I'm Yara, your personalized AI assistant. I'm here to help you with:
        
        🔹 **Document Creation**: Generate Word docs, Excel sheets, and PowerPoint presentations
        🔹 **Video Editing**: Professional video editing with AI-powered tools
        🔹 **Question Answering**: Get instant help on any topic
        🔹 **Task Assistance**: Step-by-step guidance for your projects
        
        What would you like to accomplish today? I'm ready to help make your work easier and more efficient!`;
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
        return `I'm your all-in-one AI assistant! Here's how I can help you: 🚀
        
        **📄 Document Creation**
        • Generate professional Word documents, Excel spreadsheets, and PowerPoint presentations
        • Create business proposals, financial models, and training materials
        • Professional formatting and downloadable files
        
        **🎬 Video Editing**
        • AI-powered trimming, effects, and enhancements
        • Add text overlays, music, and subtitles
        • Quality improvement and professional finishing
        
        **💬 Intelligent Assistance**
        • Answer questions on any topic
        • Provide step-by-step guidance
        • Help with planning and problem-solving
        
        **🌟 Available 24/7**
        • Instant responses and support
        • Personalized recommendations
        • Continuous learning and improvement
        
        What specific task would you like help with?`;
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('free')) {
        return `Great question about pricing! 💰 Yara AI Platform offers:
        
        **🆓 Free Tier**
        • 5 documents per month
        • Basic video editing (up to 5 minutes)
        • Standard AI chat support
        • Community templates
        
        **⭐ Pro Plan - $19/month**
        • Unlimited document generation
        • Advanced video editing (up to 60 minutes)
        • Priority AI support
        • Premium templates and effects
        • Export in multiple formats
        
        **🏢 Enterprise - Custom Pricing**
        • Team collaboration features
        • Custom branding
        • API access
        • Dedicated support
        
        Start with our free tier and upgrade anytime! Would you like to try creating your first document?`;
    }
    
    // Default responses for general queries
    const responses = [
        "That's a great question! I'm here to help you find the best solution. Could you provide a bit more detail about what you're looking for?",
        "I understand what you're asking about. Let me provide you with some helpful information and guidance on this topic.",
        "Excellent point! Based on my knowledge, I can offer some insights that might be useful for your situation.",
        "I'm glad you asked! This is something I can definitely help you with. Let me break it down for you step by step.",
        "That's an interesting question! I have some ideas that could help you achieve what you're looking for.",
        "I can assist you with that! Let me provide some practical suggestions and recommendations.",
        "Great question! I'm here to help you succeed. Here's what I recommend based on your needs.",
        "I understand your request! As your AI assistant, I can guide you through this process effectively."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            if (name && email && message) {
                showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
                this.reset();
            } else {
                showNotification('Please fill in all fields before submitting.', 'error');
            }
        });
    }
}

// Modal Functions
function openChat() {
    chatModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeChat() {
    chatModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openDocumentCreator() {
    scrollToSection('documents');
}

function openVideoEditor() {
    scrollToSection('video');
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 3000;
        max-width: 400px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.3s ease;
    }
    
    .notification-content {
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        color: white;
        font-weight: 500;
    }
    
    .notification-success .notification-content {
        background: linear-gradient(135deg, #28a745, #20c997);
    }
    
    .notification-error .notification-content {
        background: linear-gradient(135deg, #dc3545, #e74c3c);
    }
    
    .notification-warning .notification-content {
        background: linear-gradient(135deg, #ffc107, #f39c12);
        color: #333;
    }
    
    .notification-info .notification-content {
        background: linear-gradient(135deg, #667eea, #764ba2);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 50%;
        transition: background 0.3s ease;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .typing-dots {
        display: flex;
        gap: 4px;
        padding: 1rem;
    }
    
    .typing-dots span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #667eea;
        animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes typing {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .document-header {
        border-bottom: 2px solid #667eea;
        padding-bottom: 1rem;
        margin-bottom: 2rem;
    }
    
    .document-meta {
        display: flex;
        gap: 2rem;
        margin-top: 1rem;
        font-size: 0.9rem;
        color: #666;
    }
    
    .document-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-top: 2rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
    }
    
    .stat-item {
        text-align: center;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .video-header {
        text-align: center;
        margin-bottom: 1rem;
    }
    
    .video-info {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-top: 0.5rem;
        font-size: 0.9rem;
        color: #666;
    }
    
    .video-actions {
        text-align: center;
        margin-top: 1rem;
    }
    
    .video-progress {
        margin-top: 1rem;
    }
    
    .progress-bar {
        width: 100%;
        height: 8px;
        background: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }
    
    .progress-fill {
        height: 100%;
        transition: width 0.3s ease;
    }
`;
document.head.appendChild(notificationStyles);