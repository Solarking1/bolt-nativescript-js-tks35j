import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth-service';
import { navigate } from '../../utils/navigation';
import { showError } from '../../utils/dialogs';

export function createLoginViewModel() {
    const viewModel = new Observable();
    const authService = new AuthService();
    
    viewModel.email = "";
    viewModel.password = "";
    viewModel.isLoading = false;

    viewModel.onSignIn = async () => {
        if (!viewModel.email || !viewModel.password) {
            showError('Please enter both email and password');
            return;
        }

        try {
            viewModel.set('isLoading', true);
            await authService.signIn(viewModel.email, viewModel.password);
            navigate('main-page');
        } catch (error) {
            showError(error.message || 'Sign in failed');
        } finally {
            viewModel.set('isLoading', false);
        }
    };

    viewModel.onGoogleSignIn = async () => {
        try {
            viewModel.set('isLoading', true);
            await authService.signInWithGoogle();
            navigate('main-page');
        } catch (error) {
            showError(error.message || 'Google sign in failed');
        } finally {
            viewModel.set('isLoading', false);
        }
    };

    viewModel.onRegister = () => {
        navigate('register');
    };

    return viewModel;
}