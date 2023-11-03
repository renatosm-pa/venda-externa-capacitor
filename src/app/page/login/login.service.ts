import { Injectable } from '@angular/core';
import { HttpUtilService } from "../../services/http-util.service";
import { AlertController } from "@ionic/angular";
import { UsuarioLogadoService } from "../../services/usuario-logado.service";
import { LoaderService } from "../../services/loader.service";
import { PagePadrao } from "../../utils/page-padrao";
import { PedidoService } from 'src/app/services/pedido.service';

@Injectable({
    providedIn: 'root'
})
export class LoginService extends PagePadrao {

    public dominio_servidor_conf: any;
    public existePermissaoUsuario: boolean;

    constructor(private http: HttpUtilService,
        alertController: AlertController,
        private usuarioLogado: UsuarioLogadoService,
        public pedidoService: PedidoService,
        public loaderService: LoaderService) {
        super(alertController);


    }


    async existePermissao(idPermissao: any) {

        let url = '/usuariopermissoes/existe-permissao/' 
            + this.usuarioLogado.authUser.permissaoSistema.idEmpresa
            + '/' + idPermissao + '/'
            + this.usuarioLogado.authUser.id;
        console.log("url: " + url);
        try {
            let res = await this.http.get(url);
            this.existePermissaoUsuario = res;
            console.log("existePermissao: " + this.existePermissaoUsuario);

        } catch (e) {
            console.log("erro: " + e.error.message);
            //this.addErroException(e.error.message);
        }

        return Promise.resolve(this.existePermissaoUsuario);
    }



    async buscaVendedorUsuario(idUsuario: any) {

        let entradaConsulta = {
            idUsuario: idUsuario,
        };
               
        try {                                                      
            this.pedidoService.vendedorObj  = await this.http.post('/vendedor/busca-usuario-vendedor', entradaConsulta);
            console.log("vendedorObj : "+JSON.stringify(this.pedidoService.vendedorObj));
        } catch (e) {
            console.log("erro: " + e.error.message);
            this.addErroException(e.error.message);
        }

        return Promise.resolve(this.pedidoService.vendedorObj);
    }

    // verifyDarkTheme() : boolean{
    //     if(localStorage.getItem('color-theme-dark')){
    //         document.body.setAttribute('color-theme','dark');
    //         return true;
    //     }else{
    //         document.body.setAttribute('color-theme','light');
    //         return false;
    //     }
    // }

    // changeTheme(event) {
    //     if(event.detail.checked) {
    //         document.body.setAttribute('color-theme','dark');
    //         localStorage.setItem('color-theme-dark','theme');
    //     }else{
    //         document.body.setAttribute('color-theme','light');
    //         localStorage.removeItem('color-theme-dark');
    //     }

    // }




}
