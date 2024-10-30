import { Observable } from '@nativescript/core';
import { UserService } from '../../services/user-service';
import { DownloadManager } from '../../services/download-manager';

export function createProfileViewModel() {
    const viewModel = new Observable();
    const userService = new UserService();
    const downloadManager = new DownloadManager();

    // User Info
    viewModel.userName = "John Doe";
    viewModel.userEmail = "john@example.com";
    viewModel.userPhoto = "~/images/default-avatar.png";

    // Stats
    viewModel.totalMinutes = 0;
    viewModel.streak = 0;
    viewModel.completedSessions = 0;

    viewModel.recentActivity = [];
    viewModel.downloads = [];

    viewModel.onNavigatingTo = async () => {
        try {
            const userData = await userService.getUserData();
            const downloads = await downloadManager.getDownloadedContent();
            
            viewModel.set('totalMinutes', userData.totalMinutes);
            viewModel.set('streak', userData.streak);
            viewModel.set('completedSessions', userData.completedSessions);
            viewModel.set('recentActivity', userData.recentActivity);
            viewModel.set('downloads', downloads);
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    };

    viewModel.onDeleteDownload = async (args) => {
        try {
            const download = args.object.bindingContext;
            await downloadManager.deleteDownload(download.id);
            const downloads = await downloadManager.getDownloadedContent();
            viewModel.set('downloads', downloads);
        } catch (error) {
            console.error('Failed to delete download:', error);
        }
    };

    viewModel.onSettings = () => {
        navigate('settings');
    };

    return viewModel;
}