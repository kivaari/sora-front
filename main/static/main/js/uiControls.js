class UIControls {
    constructor(trackManager) {
        this.trackManager = trackManager;
        this.loopButton = document.getElementById('loopButton');
        this.loopImage = this.loopButton.querySelector('img');
        this.likeButton = document.getElementById('likeButton');
        this.likeImage = this.likeButton.querySelector('img');
        
        this.isLoop = localStorage.getItem('audioLoop') === 'true';
        this.updateLoopButton();
        this.setupEventListeners();
    }

    updateLoopButton() {
        this.loopButton.classList.toggle('active', this.isLoop);
        this.loopImage.src = this.isLoop ? 
            this.loopButton.dataset.loopOn : this.loopButton.dataset.loopOff;
        localStorage.setItem('audioLoop', this.isLoop);
    }

    setupEventListeners() {
        this.loopButton.addEventListener('click', () => {
            this.isLoop = !this.isLoop;
            if (this.trackManager.audioPlayer) {
                this.trackManager.audioPlayer.audio.loop = this.isLoop;
            }
            this.updateLoopButton();
        });

        this.likeButton.addEventListener('click', () => {
            if (this.trackManager.currentTrackIndex >= 0) {
                const track = this.trackManager.tracks[this.trackManager.currentTrackIndex];
                track.liked = !track.liked;
                this.trackManager.saveTracks();
                this.likeImage.src = track.liked ? 
                    this.likeButton.dataset.liked : this.likeButton.dataset.unliked;
                this.trackManager.renderTrackList();
            }
        });
    }
}
