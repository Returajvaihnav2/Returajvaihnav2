import { Injectable } from '@angular/core';
import { EncrDecrService } from '../services/EncrDecrService';
@Injectable({
    providedIn: 'root'
})
export class BrowserStorageService {
    constructor(
        private encService: EncrDecrService
    ) { }

    setSessionStorageItem(key, value) {
        sessionStorage.setItem(key, this.encrypt(value));
    }

    getSessionStorageItem(key) {
        return this.decrypt(sessionStorage.getItem(key));
    }

    // For Remove Particular Field/Key
    removeSessionStorageItem(key) {
        sessionStorage.removeItem(key);
    }

    // Database has been entirely deleted.
    clearSessionStorage() {
        sessionStorage.clear();
    }

    setLocalStorageItem(key, data) {
        localStorage.setItem(key, this.encrypt(data));
    }

    getLocalStorageItem(key: any) {
        return this.decrypt(localStorage.getItem(key));
    }

    removeLocalStorageItem(key) {
        localStorage.removeItem(key);
    }

    clearLocalStorageItem() {
        localStorage.clear();
    }
    encrypt(value): any {
        if (value) {
            return this.encService.set(value);
        } else {
            return value;
        }
        // return value;
    }
    decrypt(value): any {
        if (value) {
            return this.encService.get(value);
        } else {
            return value;
        }
        // return value;
    }
}
