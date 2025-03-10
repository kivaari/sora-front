document.addEventListener("DOMContentLoaded", function () {
    const audio = new Audio(trackUrl);
    const playButton = document.querySelector(".play");
    const volumeSlider = document.querySelector(".volume");
    const timeline = document.querySelector(".timeline");
    const progress = document.querySelector(".timeline .progress");
    const current = document.querySelector(".current");
    const length = document.querySelector(".length");
    const audioName = document.querySelector(".audio-name");
    const loopButton = document.getElementById('loopButton');
    const loopImage = loopButton.querySelector('img');
    const likeButton = document.getElementById('likeButton');
    const likeImage = likeButton.querySelector('img');
    const textareas = document.querySelectorAll('.style-input');
    const placeholders = document.querySelectorAll('.placeholder');


    let isLiked = localStorage.getItem('isLiked') === 'true';
    let isLoop = false;
    const loopStates = {
        on: 'loopON.png',
        off: 'loopOff.png'
    };

    function initPlayer() {
        audio.volume = 1;
        volumeSlider.value = 100;
        isLoop = localStorage.getItem('audioLoop') === 'true';
        audio.loop = isLoop;
        setTrackName(trackUrl);
        updateLoopButton();
        initLikeButton();
        updatePlaceholder();
    }

    function setTrackName(url) {
        const fileName = url.split('/').pop().split('.')[0];
        const formattedName = fileName
            .replace(/_/g, ' ')
            .replace(/(^|\s)\S/g, match => match.toUpperCase());
        audioName.textContent = formattedName;
    }

    function updateLoopButton() {
        loopButton.classList.toggle('active', isLoop);
        loopImage.src = isLoop ? loopStates.on : loopStates.off;
        localStorage.setItem('audioLoop', isLoop);
    }

    volumeSlider.addEventListener("input", function () {
        audio.volume = this.value / 100;
    });

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    }

    function updateProgress() {
        if (!audio.duration) return;
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${percent}%`;
        current.textContent = formatTime(audio.currentTime);
    }

    function updateDuration() {
        if (!audio.duration) return;
        length.textContent = formatTime(audio.duration);
    }

    playButton.addEventListener("click", function () {
        if (audio.paused || audio.ended) {
            audio.play();
            playButton.classList.replace("play", "pause");
        } else {
            audio.pause();
            playButton.classList.replace("pause", "play");
        }
    });

    loopButton.addEventListener('click', () => {
        isLoop = !isLoop;
        audio.loop = isLoop;
        updateLoopButton();
    });

    timeline.addEventListener("click", function (event) {
        const rect = timeline.getBoundingClientRect();
        const clickPosition = event.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickPosition / rect.width) * duration;
    });

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", function() {
        if (!isLoop) {
            playButton.classList.replace("pause", "play");
            audio.currentTime = 0;
            progress.style.width = "0%";
        }
    });

    function initLikeButton() {
        likeImage.src = isLiked 
            ? likeButton.dataset.liked 
            : likeButton.dataset.unliked;
    }

    likeButton.addEventListener('click', () => {
        isLiked = !isLiked;
        localStorage.setItem('isLiked', isLiked);
        likeImage.src = isLiked 
            ? likeButton.dataset.liked 
            : likeButton.dataset.unliked;
    });

    volumeSlider.addEventListener('input', function() {
        const percent = (this.value / this.max) * 100;
        this.style.setProperty('--fill-percent', `${percent}%`);
        const firefoxGradient = `linear-gradient(to right, #E0E0E0 ${percent}%, rgba(224, 224, 224, 0.5) ${percent}%)`;
        this.style.background = firefoxGradient;
    });

    function updatePlaceholder() {
        placeholders.forEach((placeholder, index) => {
            const textarea = textareas[index];
            if (textarea.value.trim() === '') {
                placeholder.style.opacity = '1';
            } else {
                placeholder.style.opacity = '0';
            }
        });
    }

    textareas.forEach(textarea => {
        textarea.addEventListener('input', updatePlaceholder);
        textarea.addEventListener('change', updatePlaceholder);
    });

    const compCont = document.querySelector('.comp-cont');
    let isLoading = false;

    compCont.addEventListener('scroll', () => {
        if (!isLoading && compCont.scrollTop + compCont.clientHeight >= compCont.scrollHeight - 100) {
            isLoading = true;
            // Загрузка новых элементов
            loadMoreCompositions();
            isLoading = false;
        }
    });

    initPlayer();
});