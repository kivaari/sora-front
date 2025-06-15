class AudioPlayer {
    constructor(trackUrl) {
        this.audio = new Audio(trackUrl);
        this.playButton = document.querySelector(".play");
        this.volumeSlider = document.querySelector(".volume");
        this.timeline = document.querySelector(".timeline");
        this.progress = document.querySelector(".timeline .progress");
        this.currentTimeDisplay = document.querySelector(".current");
        this.durationDisplay = document.querySelector(".length");
        this.audioName = document.querySelector(".audio-name");
        
        this.initPlayer();
        this.setupEventListeners();
    }

    initPlayer() {
        this.audio.volume = 1;
        this.volumeSlider.value = 100;
        this.setTrackName(this.audio.src);
    }

    setTrackName(url) {
        const fileName = url.split('/').pop().split('.')[0];
        const formattedName = fileName
            .replace(/_/g, ' ')
            .replace(/(^|\s)\S/g, match => match.toUpperCase());
        this.audioName.textContent = formattedName;
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    }

    updateProgress() {
        if (!this.audio.duration) return;
        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        this.progress.style.width = `${percent}%`;
        this.currentTimeDisplay.textContent = this.formatTime(this.audio.currentTime);
    }

    updateDuration() {
        if (!this.audio.duration) return;
        this.durationDisplay.textContent = this.formatTime(this.audio.duration);
    }

    setupEventListeners() {
        this.playButton.addEventListener("click", () => {
            if (this.audio.paused || this.audio.ended) {
                this.audio.play();
                this.playButton.classList.replace("play", "pause");
            } else {
                this.audio.pause();
                this.playButton.classList.replace("pause", "play");
            }
        });

        this.timeline.addEventListener("click", (event) => {
            const rect = this.timeline.getBoundingClientRect();
            const clickPosition = event.offsetX;
            const duration = this.audio.duration;
            this.audio.currentTime = (clickPosition / rect.width) * duration;
        });

        this.audio.addEventListener("timeupdate", () => this.updateProgress());
        this.audio.addEventListener("loadedmetadata", () => this.updateDuration());
        this.audio.addEventListener("ended", () => {
            if (!this.audio.loop) {
                this.playButton.classList.replace("pause", "play");
                this.audio.currentTime = 0;
                this.progress.style.width = "0%";
            }
        });

        this.volumeSlider.addEventListener("input", () => {
            this.audio.volume = this.volumeSlider.value / 100;
            const percent = (this.volumeSlider.value / this.volumeSlider.max) * 100;
            this.volumeSlider.style.setProperty('--fill-percent', `${percent}%`);
        });
    }
}
