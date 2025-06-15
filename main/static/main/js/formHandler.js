class FormHandler {
    constructor(trackManager) {
        this.trackManager = trackManager;
        this.createBtn = document.querySelector('.create-btn');
        this.styleInput = document.querySelector('.style-input');
        this.tempoInput = document.querySelector('.input-container2 .style-input');
        this.titleInput = document.querySelector('.tempo2 .style-input');
        this.placeholders = document.querySelectorAll('.placeholder');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.createBtn.addEventListener('click', () => this.generateMusic());
        
        const textareas = document.querySelectorAll('.style-input');
        textareas.forEach(textarea => {
            textarea.addEventListener('input', () => this.updatePlaceholder());
            textarea.addEventListener('change', () => this.updatePlaceholder());
        });
    }

    updatePlaceholder() {
        this.placeholders.forEach((placeholder, index) => {
            const textarea = document.querySelectorAll('.style-input')[index];
            placeholder.style.opacity = textarea.value.trim() === '' ? '1' : '0';
        });
    }

    async generateMusic() {
        const prompt = this.styleInput.value.trim();
        const tempo = this.tempoInput.value.trim();
        const title = this.titleInput.value.trim() || `Untitled ${new Date().toLocaleString()}`;
        
        if (!prompt) {
            alert('Please enter a music style');
            return;
        }
        
        this.createBtn.disabled = true;
        this.createBtn.textContent = 'Generating...';
        
        try {
            const response = await fetch('http://localhost:5050/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    duration: 30,
                    bpm: tempo,
                    name: title
                })
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                const newTrack = {
                    id: data.id,
                    title: title,
                    url: data.file,
                    liked: false,
                    createdAt: new Date().toISOString()
                };
                
                this.trackManager.addTrack(newTrack);
                this.trackManager.playTrack(0);
            } else {
                throw new Error(data.error || 'Failed to generate music');
            }
        } catch (error) {
            console.error('Generation error:', error);
            alert('Error generating music: ' + error.message);
        } finally {
            this.createBtn.disabled = false;
            this.createBtn.textContent = 'CREATE';
        }
    }
}
