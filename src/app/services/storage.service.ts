import {Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
})

export class StorageService {

    public setLocalStorage(key: string, obj: string): void {
        localStorage.setItem(key, obj);
    }


    public getLocalStorage(key: string): string {
        return localStorage.getItem(key);
    }

    public removeLocalStorage(key: string): void {
        localStorage.removeItem(key);
    }

    //*************************************************************************

    public setSessionStorage(key: string, obj: any): void {
        sessionStorage.setItem(key, JSON.stringify(obj));
    }

    public getSessionStorage(key: string): any {
        const result = sessionStorage.getItem(key);

        if (result) {
            return JSON.parse(result);
        }
    }

    public removeSessionStorage(key: string): void {
        sessionStorage.removeItem(key);
    }

}

