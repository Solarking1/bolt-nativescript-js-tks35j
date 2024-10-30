import { Observable } from '@nativescript/core';

export function createViewModel() {
    const viewModel = new Observable();

    // Initial state
    viewModel.isPlaying = false;
    viewModel.currentSession = "Morning Meditation";
    viewModel.duration = "10 minutes";

    // Player controls
    viewModel.onPlayPause = () => {
        viewModel.set("isPlaying", !viewModel.get("isPlaying"));
        console.log("Play/Pause pressed");
    };

    viewModel.onPrevious = () => {
        console.log("Previous track");
    };

    viewModel.onNext = () => {
        console.log("Next track");
    };

    viewModel.onCategoryTap = (args) => {
        const category = args.object.getChildAt(0).text;
        console.log(`Selected category: ${category}`);
    };

    return viewModel;
}