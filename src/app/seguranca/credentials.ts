export class Credentials {
    login: string;
    password: string;

    exportCredentialsAsBase64(): string {
        return btoa(this.login + ':' + this.password);
    }
}