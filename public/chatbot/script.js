(function() {
    // --- Configuration ---
    const WHATSAPP_LINK = "https://api.whatsapp.com/send/?phone=%2B5598991167252&text&type=phone_number&app_absent=0";
    
    // FAQ Data
    const faqData = [
        {
            id: 'consulta',
            text: 'Como funciona uma consulta com advogado?',
            answer: 'A consulta é o momento onde analisamos o seu caso detalhadamente para identificar a melhor estratégia jurídica. Pode ser presencial ou online.'
        },
        {
            id: 'atuacao',
            text: 'Áreas de atuação',
            answer: 'Atuamos em diversas áreas do Direito, incluindo Direito Civil, Trabalhista, Previdenciário e Consumidor. Fale com um analista para saber mais.'
        },
        {
            id: 'processo',
            text: 'Como entrar com um processo?',
            answer: 'Para entrar com um processo, precisamos analisar seus documentos e provas. Primeiramente, agende uma conversa rápida conosco.'
        },
        {
            id: 'tempo',
            text: 'Quanto tempo dura um processo?',
            answer: 'O tempo varia muito conforme o caso e a vara judicial. Não há um prazo fixo, mas trabalhamos para agilizar ao máximo.'
        },
        {
            id: 'whatsapp',
            text: 'Agendar atendimento no WhatsApp',
            answer: 'Claro! Clique no botão abaixo para falar diretamente com nossa equipe.'
        }
    ];

    // --- HTML Injection ---
    function injectChatbot() {
        // Create CSS Link
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/chatbot/style.css'; // Expecting file in public/chatbot/
        document.head.appendChild(link);

        // Create Chatbot Container
        const container = document.createElement('div');
        container.id = 'chatbot-container';
        container.innerHTML = `
            <div class="chatbot-window" id="chatbot-window">
                <div class="chatbot-header">
                    <span class="chatbot-title">Atendimento Jurídico</span>
                    <button class="chatbot-close" id="chatbot-close">✕</button>
                </div>
                <div class="chatbot-messages" id="chatbot-messages">
                    <div class="message bot">Olá! Sou o assistente virtual do escritório. Como posso te ajudar hoje?</div>
                    <div class="chatbot-options" id="chatbot-options">
                        <!-- Options will be injected here -->
                    </div>
                </div>
            </div>
            <button class="chatbot-fab" id="chatbot-fab" aria-label="Abrir chat">
                <svg viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
            </button>
        `;
        document.body.appendChild(container);

        // Load Options
        loadOptions();
        
        // Event Listeners
        document.getElementById('chatbot-fab').addEventListener('click', toggleChat);
        document.getElementById('chatbot-close').addEventListener('click', toggleChat);
    }

    // --- Logic ---
    function toggleChat() {
        const window = document.getElementById('chatbot-window');
        window.classList.toggle('active');
    }

    function loadOptions() {
        const optionsContainer = document.getElementById('chatbot-options');
        optionsContainer.innerHTML = ''; // Clear existing

        faqData.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = item.text;
            btn.onclick = () => handleOptionClick(item);
            optionsContainer.appendChild(btn);
        });
    }

    function handleOptionClick(item) {
        // Add User Message
        addMessage(item.text, 'user');

        // Add Bot Response
        addMessage(item.answer, 'bot');

        // Add WhatsApp Call to Action
        addWhatsAppCTA();
        
        // Re-show options for continued interaction
        setTimeout(() => {
                renderOptionsInChat(); 
        }, 500);
    }

    function addMessage(text, type) {
        const messagesDiv = document.getElementById('chatbot-messages');
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type}`;
        msgDiv.textContent = text;
        messagesDiv.appendChild(msgDiv);
        scrollToBottom();
    }

    function addWhatsAppCTA() {
        const messagesDiv = document.getElementById('chatbot-messages');
        const ctaDiv = document.createElement('div');
        ctaDiv.className = 'message bot';
        ctaDiv.style.backgroundColor = 'transparent';
        ctaDiv.style.padding = '0';
        ctaDiv.style.boxShadow = 'none';
        
        ctaDiv.innerHTML = `
            <a href="${WHATSAPP_LINK}" target="_blank" class="whatsapp-btn">
                Falar com analista no WhatsApp
            </a>
        `;
        messagesDiv.appendChild(ctaDiv);
        scrollToBottom();
    }
    
    function renderOptionsInChat() {
        const messagesDiv = document.getElementById('chatbot-messages');
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'chatbot-options';
        
        faqData.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = item.text;
            btn.onclick = () => handleOptionClick(item);
            optionsContainer.appendChild(btn);
        });
        
        messagesDiv.appendChild(optionsContainer);
        scrollToBottom();
    }

    function scrollToBottom() {
        const messagesDiv = document.getElementById('chatbot-messages');
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // --- Initialization ---
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectChatbot);
    } else {
        injectChatbot();
    }

})();
