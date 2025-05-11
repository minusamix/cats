// src/core/audioManager.js

export class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.muted = false;
    }

    loadSound(name, src, loop = false) {
        const audio = new Audio(src);
        audio.loop = loop;
        this.sounds[name] = audio;
    }

    playSound(name, volume = 1.0, loop = null) {
        if (this.muted) return;
        const sound = this.sounds[name];
        if (sound) {
            if (loop !== null) sound.loop = loop;
            sound.volume = volume;
            if (!sound.paused && !sound.ended && sound.currentTime > 0) return;
            sound.currentTime = 0;
            sound.play();
        }
    }

    pauseSound(name) {
        const sound = this.sounds[name];
        if (sound && !sound.paused) {
            sound.pause();
        }
    }

    stopSound(name) {
        const sound = this.sounds[name];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    isPlaying(name) {
        const sound = this.sounds[name];
        return sound && !sound.paused && !sound.ended && sound.currentTime > 0;
    }

    setLoop(name, loop) {
        const sound = this.sounds[name];
        if (sound) sound.loop = loop;
    }

    playMusic(src, volume = 0.5, loop = true) {
        if (this.music) {
            this.music.pause();
        }
        this.music = new Audio(src);
        this.music.volume = volume;
        this.music.loop = loop;
        if (!this.muted) {
            this.music.play();
        }
    }

    stopMusic() {
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
        }
    }

    mute() {
        this.muted = true;
        for (const name in this.sounds) {
            this.pauseSound(name);
        }
        if (this.music) this.music.pause();
    }

    unmute() {
        this.muted = false;
        if (this.music) this.music.play();
    }
}