import { Observable } from '@nativescript/core';
import { MeditationService } from '../../services/meditation-service';
import { navigate } from '../../utils/navigation';

export function createLibraryViewModel() {
    const viewModel = new Observable();
    const meditationService = new MeditationService();

    viewModel.categories = [
        { id: 'all', title: 'All' },
        { id: 'sleep', title: 'Sleep' },
        { id: 'focus', title: 'Focus' },
        { id: 'anxiety', title: 'Anxiety' },
        { id: 'stress', title: 'Stress Relief' }
    ];

    viewModel.meditations = [];

    viewModel.onNavigatingTo = async () => {
        try {
            const meditations = await meditationService.getMeditations();
            viewModel.set('meditations', meditations);
        } catch (error) {
            console.error('Failed to load meditations:', error);
        }
    };

    viewModel.onMeditationTap = (args) => {
        const meditation = viewModel.meditations[args.index];
        navigate('meditation-player', { meditation });
    };

    viewModel.onSearch = () => {
        navigate('search');
    };

    return viewModel;
}