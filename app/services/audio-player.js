import { TNSPlayer } from '@nativescript/audio';

export class AudioPlayer {
    constructor() {
        this.player = new TNSPlayer();
        this.currentTime = 0;
        this.duration = 0;
        this.isLoaded = false;
        this._setupPlayerCallbacks();
    }

    _setupPlayerCallbacks() {
        this.player.on('error', (error) => {
            console.error('Audio player error:', error);
        });

        this.player.on('timeUpdate', (args) => {
            this.currentTime = args.currentTime;
        });

        this.player.on('finished', () => {
            this.currentTime = 0;
            this.isLoaded = false;
        });
    }

    async load(url) {
        try {
            await this.player.initFromUrl({
                audioUrl: url,
                loop: false,
                completeCallback: () => {
                    this.isLoaded = true;
                    this.duration = this.player.duration;
                },
                errorCallback: (error) => {
                    throw error;
                }
            });
        } catch (error) {
            console.error('Failed to load audio:', error);
            throw error;
        }
    }

    async play(url) {
        try {
            if (!this.isLoaded || this.player.audioUrl !== url) {
                await this.load(url);
            }
            await this.player.play();
        } catch (error) {
            console.error('Playback failed:', error);
            throw error;
        }
    }

    async pause() {
        try {
            await this.player.pause();
        } catch (error) {
            console.error('Failed to pause:', error);
            throw error;
        }
    }

    async seekTo(time) {
        try {
            await this.player.seekTo(time);
            this.currentTime = time;
        } catch (error) {
            console.error('Seek failed:', error);
            throw error;
        }
    }

    async stop() {
        try {
            await this.player.dispose();
            this.isLoaded = false;
            this.currentTime = 0;
        } catch (error) {
            console.error('Failed to stop:', error);
            throw error;
        }
    }

    getCurrentTime() {
        return this.currentTime;
    }

    getDuration() {
        return this.duration;
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}