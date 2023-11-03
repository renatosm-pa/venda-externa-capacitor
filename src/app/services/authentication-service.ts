import {Injectable, Injector} from '@angular/core';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ResultadoCredencial} from './resultado-credencial';
import {StorageService} from '../services/storage.service';
import {environment} from '../../environments/environment';
import { Credentials } from '../seguranca/credentials';
import { AuthenticatedUser } from '../seguranca/authenticated-user';



@Injectable({providedIn: 'root'})
export class AuthenticationService {
    atualizandoToken = false;

    public authUser: AuthenticatedUser;
    public empresaId: number;
    private editForm = false;

    empresaChange: Subject<number> = new Subject<number>();
    API_URL: string;
    showLogin = false;

    constructor(private http: HttpClient, private router: Router,
                private injector: Injector,
                private storageService: StorageService                
               ) {

        this.API_URL = environment.API_URL;

    }


    getAuthenticatedUser(): AuthenticatedUser {
        if (this.authUser == null) {
            const result = this.storageService.getSessionStorage('authUser');
            if (result) {
                this.authUser = JSON.parse(result);
            }
        }
        return this.authUser;
    }

    async login(credentials: Credentials): Promise<any> {

        const url = this.API_URL + '/auth/login/autenticar/VENDA_PASSAGEM';

        let headers = new HttpHeaders();

        headers = headers.set('Content-Type', 'application/json; charset=utf-8');

        const res: ResultadoCredencial | any = await this.http.post(url, credentials,
            {
                headers
            }).toPromise()
            .catch(reason => {
                return Promise.reject(reason);
            });

        await this.processarAuthUser(res);

       // this.empresaId = this.authUser.usuario.empresaId;

        /**
         * carregar configuracaoEmpresa
         */

       // const configuracaoEmpresa = await this.configuracaoEmpresaService.empresa(this.empresaId);
      //  this.storageService.setSessionStorage('configuracaoEmpresa', configuracaoEmpresa);

        return Promise.resolve({
            login: this.authUser.login,
            senha: null,
            id: this.authUser.id,
            atributoPadrao: null,
            nome: this.authUser.nome,
            codigoAcesso: null,
            empresaId: null
        });
    }


    logout() {
        // this.confirmationService.confirm({
        //     message: 'Deseja realmente encerrar sua sessão do sistema?',
        //     accept: () => {
        //         Cookie.delete('sessionId');
        //         this.authUser = null;
        //         Cookie.deleteAll();
        //         this.router.navigate(['/']);
        //     }
        // });

    }


    getEditForm(): boolean {
        return this.editForm;
    }

    setEditForm(editForm: boolean) {
        this.editForm = editForm;
    }


    refreshToken() {

        // const url = this.API_URL + '/auth/login/autenticaPorSessionId';

        // const credentials = {
        //     sessionId:null// this.authUser.sessionId
        // };

        // return this.http.post<any>(url, credentials).pipe(tap((res: ResultadoCredencial) => {
        //     if (res) {
        //         this.authUser = new AuthenticatedUser(res);
        //         this.storageService.setSessionStorage('authUser', this.authUser);
        //     } else {
        //         this.showLogin = true;
        //         this.storageService.setSessionStorage('empresaId', null);
        //         this.storageService.setSessionStorage('permissoes', null);
        //         this.storageService.setSessionStorage('authUser', null);
        //         this.router.navigate(['/login']);
        //     }
        // }));
    }


    private async processarAuthUser(res) {

        this.atualizandoToken = false;

        this.authUser = new AuthenticatedUser(res);

        this.storageService.setSessionStorage('authUser', this.authUser);

    }
}
