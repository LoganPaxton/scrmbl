const audio = document.getElementById("audio");
const progressBar = document.getElementById("progress-bar");
const audioSource = document.getElementById("audio-source");

function playSong(title, src, author) {
    // We are not updating the title or author in the progress bar or player anymore.
    audioSource.src = src;
    audio.load();
    audio.play();
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

function stopSong() {
    audio.pause();
    audio.currentTime = 0;
}

function updateProgress() {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
    }
}

function seek(event) {
    const newTime = (event.target.value / 100) * audio.duration;
    audio.currentTime = newTime;
}
