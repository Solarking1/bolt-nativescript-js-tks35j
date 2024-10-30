import { Application } from '@nativescript/core';
import { initializeApp } from 'firebase/app';

// Initialize Firebase
const firebaseConfig = {
    // TODO: Add your Firebase configuration
};

initializeApp(firebaseConfig);

Application.run({ moduleName: 'components/auth/login-page' });