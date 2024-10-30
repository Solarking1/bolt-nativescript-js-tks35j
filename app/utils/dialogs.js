import { alert } from '@nativescript/core/ui/dialogs';

export function showError(message) {
    return alert({
        title: 'Error',
        message: message,
        okButtonText: 'OK'
    });
}

export function showSuccess(message) {
    return alert({
        title: 'Success',
        message: message,
        okButtonText: 'OK'
    });
}