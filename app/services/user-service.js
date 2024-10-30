import { getAuth } from '@nativescript/firebase/auth';
import { getDatabase, ref, set, get } from '@nativescript/firebase/database';

export class UserService {
    constructor() {
        this.auth = getAuth();
        this.db = getDatabase();
    }

    async getUserData() {
        try {
            const user = this.auth.currentUser;
            if (!user) throw new Error('No user logged in');

            const userRef = ref(this.db, `users/${user.uid}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                return snapshot.val();
            }

            // Initialize new user data
            const userData = {
                id: user.uid,
                email: user.email,
                name: user.displayName || 'User',
                totalMinutes: 0,
                streak: 0,
                completedSessions: 0,
                recentActivity: [],
                createdAt: new Date().toISOString()
            };

            await set(userRef, userData);
            return userData;
        } catch (error) {
            console.error('Error getting user data:', error);
            throw error;
        }
    }

    async updateUserProgress(sessionData) {
        try {
            const user = this.auth.currentUser;
            if (!user) throw new Error('No user logged in');

            const userRef = ref(this.db, `users/${user.uid}`);
            const snapshot = await get(userRef);
            const userData = snapshot.val();

            // Update stats
            userData.totalMinutes += sessionData.duration;
            userData.completedSessions += 1;
            
            // Update streak
            const lastSession = userData.recentActivity[0];
            const today = new Date().toDateString();
            if (lastSession && lastSession.date === today) {
                userData.streak += 1;
            }

            // Add to recent activity
            userData.recentActivity.unshift({
                date: today,
                sessionName: sessionData.title,
                duration: sessionData.duration
            });

            // Keep only last 10 activities
            userData.recentActivity = userData.recentActivity.slice(0, 10);

            await set(userRef, userData);
            return userData;
        } catch (error) {
            console.error('Error updating user progress:', error);
            throw error;
        }
    }
}