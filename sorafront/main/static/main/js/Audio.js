document.addEventListener("DOMContentLoaded", function () {
    // Получаем элементы
    const audio = new Audio(trackUrl); // Аудиоэлемент (trackUrl передан через HTML)
    const playButton = document.querySelector(".play"); // Кнопка Play/Pause
    const volumeSlider = document.querySelector(".volume"); // Ползунок громкости
    const timeline = document.querySelector(".timeline"); // Таймлайн
    const progress = document.querySelector(".timeline .progress"); // Прогресс-бар
    const current = document.querySelector(".current"); // Текущее время
    const length = document.querySelector(".length"); // Общая длительность

    // Форматирование времени
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    }

    // Обновление прогресса воспроизведения
    function updateProgress() {
        if (!audio.duration) return; // Проверяем, загружен ли трек
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${percent}%`; // Обновляем ширину прогресс-бара
        current.textContent = formatTime(audio.currentTime); // Обновляем текущее время
    }

    // Обновление общей длительности трека
    function updateDuration() {
        if (!audio.duration) return; // Проверяем, загружен ли трек
        length.textContent = formatTime(audio.duration); // Устанавливаем общую длительность
    }

    // Обработчик для кнопки Play/Pause
    playButton.addEventListener("click", function () {
        if (audio.paused || audio.currentTime === 0) {
            audio.play(); // Воспроизведение
            playButton.classList.remove("play"); // Убираем класс "play"
            playButton.classList.add("pause"); // Добавляем класс "pause"
        } else {
            audio.pause(); // Пауза
            playButton.classList.remove("pause"); // Убираем класс "pause"
            playButton.classList.add("play"); // Добавляем класс "play"
        }
    });

    // Обновление громкости
    volumeSlider.addEventListener("input", function () {
        audio.volume = parseFloat(this.value); // Изменяем громкость (преобразуем в число)
        updateVolumeBarColor(); // Обновляем цвет прогресс-бара громкости
    });

    // Динамическое изменение цвета прогресс-бара громкости
    function updateVolumeBarColor() {
        const volumePercent = (volumeSlider.value / volumeSlider.max) * 100;
        volumeSlider.style.background = `linear-gradient(to right, #E0E0E0 ${volumePercent}%, rgba(255, 255, 255, 0.3) ${volumePercent}%)`;
    }

    // Перемотка трека по клику на таймлайн
    timeline.addEventListener("click", function (event) {
        const rect = timeline.getBoundingClientRect(); // Получаем размеры таймлайна
        const clickPosition = event.offsetX; // Координата клика относительно таймлайна
        const duration = audio.duration; // Общая длительность трека
        audio.currentTime = (clickPosition / rect.width) * duration; // Вычисляем новое время
    });

    // Обновление прогресса каждую секунду
    audio.addEventListener("timeupdate", updateProgress);

    // Загрузка длительности трека
    audio.addEventListener("loadedmetadata", updateDuration);

    // Автоматическая остановка после окончания трека
    audio.addEventListener("ended", function () {
        playButton.classList.remove("pause"); // Возвращаем класс "play"
        playButton.classList.add("play"); // Убеждаемся, что кнопка возвращается в состояние "play"
    });

    // Инициализация цвета прогресс-бара громкости
    updateVolumeBarColor();
});