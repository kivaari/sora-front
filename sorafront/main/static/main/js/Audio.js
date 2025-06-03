document.addEventListener("DOMContentLoaded", function () {
    const audio = new Audio();
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
    const trackLikeButtons = document.querySelectorAll('.lik');

    let currentTrackId = null;

    document.querySelectorAll('.comp-img').forEach(img => {
        img.addEventListener('click', function() {
            const trackPath = this.dataset.track;
            const trackElement = this.closest('.composition');
            currentTrackId = trackElement ? trackElement.dataset.trackId : null; // Получаем ID трека

            if (trackPath) {
                audio.src = trackPath;
                setTrackName(trackPath);
                audio.play();
                playButton.classList.replace("play", "pause");
                updatePlayerLikeButton(); // Обновляем кнопку лайка в плеере при смене трека
            }
        });
    });

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
        updateLoopButton();
        // initLikeButton(); // Эта функция будет заменена updatePlayerLikeButton
        updatePlaceholder();

        const firstTrack = document.querySelector('.comp-img');
        if (firstTrack) {
            const trackPath = firstTrack.dataset.track;
            const trackElement = firstTrack.closest('.composition');
            currentTrackId = trackElement ? trackElement.dataset.trackId : null;
            if (trackPath) {
                audio.src = trackPath;
                setTrackName(trackPath);
                updatePlayerLikeButton(); // Обновляем кнопку лайка в плеере при инициализации
            }
        }
        updateAllTrackLikeButtons(); // Обновляем все кнопки лайка в списке при загрузке страницы
    }

    function setTrackName(url) {
        const fileName = decodeURIComponent(url.split('/').pop().split('.')[0]);
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


    function getTrackLikeState(trackId) {
        return localStorage.getItem(`liked_${trackId}`) === 'true';
    }

    function setTrackLikeState(trackId, liked) {
        localStorage.setItem(`liked_${trackId}`, liked);
    }

    function updatePlayerLikeButton() {
        if (currentTrackId) {
            const isLiked = getTrackLikeState(currentTrackId);
            likeImage.src = isLiked 
                ? likeButton.dataset.liked 
                : likeButton.dataset.unliked;
        } else {
            // Если трек не выбран, показываем состояние по умолчанию (не лайкнут)
            likeImage.src = likeButton.dataset.unliked;
        }
    }

    function updateTrackLikeButton(buttonElement, trackId) {
        const isLiked = getTrackLikeState(trackId);
        const imgElement = buttonElement.querySelector('img');
        if (imgElement) {
            imgElement.src = isLiked 
                ? buttonElement.dataset.likedSrc 
                : buttonElement.dataset.unlikedSrc;
        }
    }

    function updateAllTrackLikeButtons() {
        trackLikeButtons.forEach(button => {
            const trackId = button.dataset.trackId;
            if (trackId) {
                updateTrackLikeButton(button, trackId);
            }
        });
    }

    // Обработчик клика для кнопки лайка в плеере
    likeButton.addEventListener('click', () => {
        if (currentTrackId) {
            const isLiked = !getTrackLikeState(currentTrackId);
            setTrackLikeState(currentTrackId, isLiked);
            updatePlayerLikeButton(); // Обновляем кнопку в плеере
            // Находим соответствующую кнопку в списке и обновляем ее
            const correspondingTrackButton = document.querySelector(`.lik[data-track-id="${currentTrackId}"]`);
            if (correspondingTrackButton) {
                updateTrackLikeButton(correspondingTrackButton, currentTrackId);
            }
        }
    });

    // Обработчики кликов для кнопок лайка в списке
    trackLikeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const trackId = this.dataset.trackId;
            if (trackId) {
                const isLiked = !getTrackLikeState(trackId);
                setTrackLikeState(trackId, isLiked);
                updateTrackLikeButton(this, trackId); // Обновляем текущую кнопку в списке

                // Если лайкнутый трек сейчас играет в плеере, обновляем кнопку в плеере
                if (currentTrackId === trackId) {
                    updatePlayerLikeButton();
                }
            }
        });
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