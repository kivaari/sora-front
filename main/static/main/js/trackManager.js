const PLAY_ICON_URL = '/static/main/PlayButton.png';
const PAUSE_ICON_URL = '/static/main/PauseButton.png';

class TrackManager {
  constructor() {
    this.audioBlock = document.querySelector('.audio-block');
    this.currentTrackIndex = 0;
    this.tracks = [];
    this.audioElement = new Audio();
    this.isPlaying = false;

    this.init();
  }

  async init() {
    if (!this.audioBlock) {
      console.error('Audio block container not found!');
      return;
    }

    this.tracks = await this.loadGeneratedTracks();

    if (this.tracks.length === 0) {
      this.loadTrack({ title: 'No tracks found', audioSrc: null });
      return;
    }

    this.loadTrack(this.tracks[this.currentTrackIndex]);

    const playBtn = this.audioBlock.querySelector('.play');
    if (playBtn) {
      playBtn.addEventListener('click', () => this.togglePlay());
    }

    const nextBtn = this.audioBlock.querySelector('.next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextTrack());
    }

    const prevBtn = this.audioBlock.querySelector('.back');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousTrack());
    }

    this.audioElement.addEventListener('ended', () => this.nextTrack());
  }

  async loadGeneratedTracks() {
    try {
      const response = await fetch('http://localhost:5050/tracks.json');
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Failed to load tracks.json:', err);
      return [];
    }
  }

  loadTrack(trackData) {
    this.currentTrack = trackData;
    const titleElement = this.audioBlock.querySelector('.audio-name');
    const lengthElement = this.audioBlock.querySelector('.length');
    const currentElement = this.audioBlock.querySelector('.current');

    if (titleElement) titleElement.textContent = trackData.title || 'Unknown Title';
    if (lengthElement) lengthElement.textContent = trackData.length || '0:00';
    if (currentElement) currentElement.textContent = trackData.currentTime || '0:00';

    this.updateLikeButton(trackData.liked);

    this.setPlayButtonIcon(false);

    if (trackData.audioSrc) {
      if (!this.audioElement) {
        this.audioElement = new Audio();
      }
      this.audioElement.src = trackData.audioSrc;
    }
  }

  togglePlay() {
    if (!this.currentTrack || !this.currentTrack.audioSrc) return;

    if (this.isPlaying) {
      this.audioElement.pause();
      this.isPlaying = false;
    } else {
      this.audioElement.play();
      this.isPlaying = true;
    }

    this.setPlayButtonIcon(this.isPlaying);
  }

  setPlayButtonIcon(isPlaying) {
    const playBtnImg = this.audioBlock.querySelector('.play img');
    if (!playBtnImg) return;
    playBtnImg.src = isPlaying ? PAUSE_ICON_URL : PLAY_ICON_URL;
    playBtnImg.alt = isPlaying ? 'Pause' : 'Play';
  }

  nextTrack() {
    if (this.tracks.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.loadTrack(this.tracks[this.currentTrackIndex]);
    if (this.isPlaying) this.audioElement.play();
  }

  previousTrack() {
    if (this.tracks.length === 0) return;
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.loadTrack(this.tracks[this.currentTrackIndex]);
    if (this.isPlaying) this.audioElement.play();
  }

  updateLikeButton(liked) {
    // Optional: Handle "like" UI here
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.trackManager = new TrackManager();
});

