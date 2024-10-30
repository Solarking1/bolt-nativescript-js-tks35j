import { Observable } from '@nativescript/core';
import { AudioPlayer } from '../../services/audio-player';
import { UserService } from '../../services/user-service';
import { ErrorHandler } from '../../utils/error-handler';

export function createMeditationPlayerViewModel(meditation) {
    const viewModel = new Observable();
    const audioPlayer = new AudioPlayer();
    const userService = new UserService();
    let progressInterval;

    // Initialize with meditation data
    viewModel.currentSession = meditation || {
        title: "Morning Mindfulness",
        author: "Sarah Johnson",
        description: "Start your day with clarity and purpose through this guided meditation.",
        imageUrl: "~/images/morning-meditation.jpg",
        audioUrl: "https://example.com/meditations/morning-mindfulness.mp3",
        duration: 600
    };

    viewModel.isPlaying = false;
    viewModel.progress = 0;
    viewModel.currentTime = "0:00";
    viewModel.duration = audioPlayer.formatTime(viewModel.currentSession.duration);
    viewModel.isLoading = false;
    viewModel.hasError = false;
    viewModel.errorMessage = '';

    const startProgressTracking = () => {
        stopProgressTracking();
        progressInterval = setInterval(() => {
            if (viewModel.isPlaying) {
                const currentTime = audioPlayer.getCurrentTime();
                const duration = audioPlayer.getDuration();
                const progress = (currentTime / duration) * 100;
                
                viewModel.set('progress', progress);
                viewModel.set('currentTime', audioPlayer.formatTime(currentTime));
            }
        }, 1000);
    };

    const stopProgressTracking = () => {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    };

    viewModel.onPlayPause = async () => {
        try {
            viewModel.set('isLoading', true);
            viewModel.set('hasError', false);
            viewModel.set('errorMessage', '');
            
            if (viewModel.isPlaying) {
                await audioPlayer.pause();
                stopProgressTracking();
            } else {
                await audioPlayer.play(viewModel.currentSession.audioUrl);
                startProgressTracking();
                
                await userService.updateUserProgress({
                    title: viewModel.currentSession.title,
                    duration: Math.floor(audioPlayer.getCurrentTime() / 60)
                });
            }
            
            viewModel.set('isPlaying', !viewModel.isPlaying);
        } catch (error) {
            const message = ErrorHandler.handle(error, 'MeditationPlayback');
            viewModel.set('hasError', true);
            viewModel.set('errorMessage', message);
        } finally {
            viewModel.set('isLoading', false);
        }
    };

    viewModel.onSeek = async (args) => {
        try {
            const seekTime = (args.value / 100) * audioPlayer.getDuration();
            await audioPlayer.seekTo(seekTime);
            viewModel.set('currentTime', audioPlayer.formatTime(seekTime));
        } catch (error) {
            ErrorHandler.handle(error, 'MeditationSeek');
        }
    };

    viewModel.onUnloaded = async () => {
        try {
            stopProgressTracking();
            await audioPlayer.stop();
        } catch (error) {
            ErrorHandler.handle(error, 'MeditationCleanup');
        }
    };

    return viewModel;
}