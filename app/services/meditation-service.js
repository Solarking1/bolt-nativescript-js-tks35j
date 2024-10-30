import { getDatabase, ref, get, query, orderByChild, limitToLast } from '@nativescript/firebase/database';
import { DownloadManager } from './download-manager';
import { ErrorHandler } from '../utils/error-handler';

export class MeditationService {
    constructor() {
        this.db = getDatabase();
        this.downloadManager = new DownloadManager();
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    async getMeditations(category = 'all', limit = 20) {
        const cacheKey = `meditations_${category}_${limit}`;
        
        try {
            // Check cache first
            const cached = this.getFromCache(cacheKey);
            if (cached) return cached;

            const meditationsRef = ref(this.db, 'meditations');
            let meditationsQuery = query(meditationsRef, limitToLast(limit));
            
            if (category !== 'all') {
                meditationsQuery = query(meditationsQuery, orderByChild('category'), 
                    orderByChild('category').equalTo(category));
            }

            const snapshot = await get(meditationsQuery);
            let meditations = [];

            if (snapshot.exists()) {
                meditations = Object.values(snapshot.val());
                
                // Check offline availability in parallel
                const downloadChecks = meditations.map(async meditation => {
                    meditation.isDownloaded = await this.downloadManager.isDownloaded(meditation.id);
                    return meditation;
                });

                meditations = await Promise.all(downloadChecks);
                
                // Cache the results
                this.setCache(cacheKey, meditations);
            }

            return meditations;
        } catch (error) {
            throw new Error(ErrorHandler.handle(error, 'GetMeditations'));
        }
    }

    async getMeditationById(id) {
        const cacheKey = `meditation_${id}`;
        
        try {
            // Check cache first
            const cached = this.getFromCache(cacheKey);
            if (cached) return cached;

            const meditationRef = ref(this.db, `meditations/${id}`);
            const snapshot = await get(meditationRef);
            
            if (snapshot.exists()) {
                const meditation = snapshot.val();
                meditation.isDownloaded = await this.downloadManager.isDownloaded(id);
                
                // Cache the result
                this.setCache(cacheKey, meditation);
                return meditation;
            }
            return null;
        } catch (error) {
            throw new Error(ErrorHandler.handle(error, 'GetMeditationById'));
        }
    }

    private getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    private setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clearCache() {
        this.cache.clear();
    }
}