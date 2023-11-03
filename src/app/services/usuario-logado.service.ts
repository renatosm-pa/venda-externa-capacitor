import {Injectable} from '@angular/core';
import {AuthenticatedUser} from "../seguranca/authenticated-user";

@Injectable({
    providedIn: 'root'
})
export class UsuarioLogadoService {
    public authUser: AuthenticatedUser;



    constructor() {

    }




}
