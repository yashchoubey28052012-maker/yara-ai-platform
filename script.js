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
        word: "Describe the document you want to create (e.g., 'Create a business proposal for a new mobile app')",
        excel: "Describe the spreadsheet you need (e.g., 'Create a budget tracker with monthly expenses')",
        powerpoint: "Describe your presentation (e.g., 'Create a presentation about renewable energy')"
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
    preview.innerHTML = '<div class="loading">Generating your document...</div>';

    // Simulate AI document generation
    setTimeout(() => {
        const content = generateDocumentContent(currentDocumentType, prompt);
        preview.innerHTML = content;
        
        // Add download button
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'btn btn-primary';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Document';
        downloadBtn.onclick = () => downloadDocument(currentDocumentType, prompt);
        preview.appendChild(downloadBtn);
    }, 2000);
}

function generateDocumentContent(type, prompt) {
    const templates = {
        word: `
            <h3>Generated Word Document</h3>
            <div class="document-content">
                <h4>Document Title: ${prompt}</h4>
                <p><strong>Executive Summary:</strong></p>
                <p>This document has been generated based on your request: "${prompt}". The AI has created a structured document with relevant sections and content.</p>
                
                <p><strong>Main Content:</strong></p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                
                <p><strong>Conclusion:</strong></p>
                <p>This document provides a comprehensive overview of the requested topic and can be further customized based on your specific needs.</p>
            </div>
        `,
        excel: `
            <h3>Generated Excel Spreadsheet</h3>
            <div class="document-content">
                <h4>Spreadsheet: ${prompt}</h4>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <tr style="background: #667eea; color: white;">
                        <th style="border: 1px solid #ddd; padding: 8px;">Category</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Amount</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Date</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Notes</th>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Sample Data 1</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">$100</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">2025-01-01</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">Generated by AI</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">Sample Data 2</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">$200</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">2025-01-02</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">AI Generated</td>
                    </tr>
                </table>
                <p>This spreadsheet template has been created based on your requirements and includes sample data structure.</p>
            </div>
        `,
        powerpoint: `
            <h3>Generated PowerPoint Presentation</h3>
            <div class="document-content">
                <h4>Presentation: ${prompt}</h4>
                <div style="background: #f8f9fa; padding: 1rem; margin: 1rem 0; border-left: 4px solid #667eea;">
                    <h5>Slide 1: Title Slide</h5>
                    <p><strong>${prompt}</strong></p>
                    <p>Presented by: AI Assistant</p>
                </div>
                <div style="background: #f8f9fa; padding: 1rem; margin: 1rem 0; border-left: 4px solid #667eea;">
                    <h5>Slide 2: Overview</h5>
                    <ul>
                        <li>Introduction to the topic</li>
                        <li>Key points and objectives</li>
                        <li>Expected outcomes</li>
                    </ul>
                </div>
                <div style="background: #f8f9fa; padding: 1rem; margin: 1rem 0; border-left: 4px solid #667eea;">
                    <h5>Slide 3: Main Content</h5>
                    <p>Detailed information about your requested topic with supporting data and analysis.</p>
                </div>
                <div style="background: #f8f9fa; padding: 1rem; margin: 1rem 0; border-left: 4px solid #667eea;">
                    <h5>Slide 4: Conclusion</h5>
                    <p>Summary of key points and next steps.</p>
                </div>
                <p>This presentation outline has been generated based on your requirements.</p>
            </div>
        `
    };
    
    return templates[type] || '<p>Document generated successfully!</p>';
}

function downloadDocument(type, prompt) {
    // Simulate document download
    const filename = `${prompt.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.${getFileExtension(type)}`;
    
    // Create a simple text content for download
    const content = `Document: ${prompt}\nType: ${type.toUpperCase()}\nGenerated by Yara AI Platform\nDate: ${new Date().toLocaleDateString()}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert(`Document "${filename}" has been downloaded!`);
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
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.style.background = '';
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
        alert('Please select a video file');
        return;
    }
    
    const preview = document.getElementById('videoPreview');
    preview.style.display = 'block';
    preview.innerHTML = `
        <h4>Video Loaded: ${file.name}</h4>
        <video controls style="width: 100%; max-width: 500px; margin: 1rem 0;">
            <source src="${URL.createObjectURL(file)}" type="${file.type}">
            Your browser does not support the video tag.
        </video>
        <p>Video is ready for editing. Use the controls above to edit your video.</p>
    `;
}

function trimVideo() {
    alert('AI Video Trimming feature activated! This would open the video trimming interface.');
}

function addEffects() {
    alert('AI Effects feature activated! This would open the effects selection panel.');
}

function addText() {
    alert('AI Text Overlay feature activated! This would open the text editing interface.');
}

function addMusic() {
    alert('AI Music Addition feature activated! This would open the music library.');
}

// Chat Functions
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMessageToChat('chatMessages', message, 'user');
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const response = generateAIResponse(message);
        addMessageToChat('chatMessages', response, 'bot');
    }, 1000);
}

function sendModalMessage() {
    const input = document.getElementById('modalChatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMessageToChat('modalChatMessages', message, 'user');
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const response = generateAIResponse(message);
        addMessageToChat('modalChatMessages', response, 'bot');
    }, 1000);
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

function generateAIResponse(message) {
    const responses = [
        "I understand your question. Let me help you with that!",
        "That's a great question! Here's what I think...",
        "I can definitely help you with that. Let me provide some information.",
        "Based on your question, I'd recommend the following approach...",
        "That's an interesting point. Here's my perspective on it.",
        "I'm here to help! Let me break this down for you.",
        "Great question! I can assist you with document creation, video editing, or any other tasks.",
        "I'm Yara, your AI assistant. I can help you create documents, edit videos, or answer any questions you have!"
    ];
    
    // Simple keyword-based responses
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('document') || lowerMessage.includes('word') || lowerMessage.includes('excel') || lowerMessage.includes('powerpoint')) {
        return "I can help you create documents! Use the Document Creator section to generate Word documents, Excel spreadsheets, or PowerPoint presentations. Just describe what you need and I'll create it for you.";
    }
    
    if (lowerMessage.includes('video') || lowerMessage.includes('edit')) {
        return "I can help you edit videos! Upload your video file in the Video Editor section and use our AI-powered tools to trim, add effects, text, or music to your videos.";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello! I'm Yara, your personalized AI assistant. I can help you create documents, edit videos, or answer any questions you have. What would you like to do today?";
    }
    
    if (lowerMessage.includes('help')) {
        return "I'm here to help! I can assist you with:\n• Creating Word documents, Excel spreadsheets, and PowerPoint presentations\n• Editing videos with AI-powered tools\n• Answering questions on any topic\n• Providing guidance and support\n\nWhat would you like help with?";
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Modal Functions
function openChat() {
    chatModal.style.display = 'block';
}

function closeChat() {
    chatModal.style.display = 'none';
}

function openDocumentCreator() {
    scrollToSection('documents');
}

function openVideoEditor() {
    scrollToSection('video');
}

// Utility Functions
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Processing...</div>';
    }
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '';
    }
}

// Add some CSS for loading animation
const style = document.createElement('style');
style.textContent = `
    .loading {
        text-align: center;
        padding: 2rem;
        color: #667eea;
        font-weight: 500;
    }
    
    .loading i {
        margin-right: 0.5rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .fa-spin {
        animation: spin 1s linear infinite;
    }
    
    .nav-menu.active {
        display: flex;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: white;
        flex-direction: column;
        padding: 1rem;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);