import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from '@nativescript/firebase/auth';
import { ErrorHandler } from '../utils/error-handler';

export class AuthService {
    constructor() {
        this.auth = getAuth();
        this.googleProvider = new GoogleAuthProvider();
        this.currentUser = null;
        this.authStateSubscribers = new Set();
        
        // Initialize auth state listener
        this.auth.onAuthStateChanged(user => {
            this.currentUser = user;
            this.notifyAuthStateChange(user);
        });
    }

    async signIn(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw new Error(ErrorHandler.handle(error, 'SignIn'));
        }
    }

    async signUp(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw new Error(ErrorHandler.handle(error, 'SignUp'));
        }
    }

    async signInWithGoogle() {
        try {
            const credential = await this.googleProvider.credential(null);
            const userCredential = await signInWithCredential(this.auth, credential);
            return userCredential.user;
        } catch (error) {
            throw new Error(ErrorHandler.handle(error, 'GoogleSignIn'));
        }
    }

    async signOut() {
        try {
            await this.auth.signOut();
        } catch (error) {
            throw new Error(ErrorHandler.handle(error, 'SignOut'));
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    subscribeToAuthState(callback) {
        this.authStateSubscribers.add(callback);
        // Initial callback with current state
        callback(this.currentUser);
        
        return () => this.authStateSubscribers.delete(callback);
    }

    private notifyAuthStateChange(user) {
        this.authStateSubscribers.forEach(callback => callback(user));
    }
}