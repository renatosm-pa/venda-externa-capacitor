import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { PedidoService } from './pedido.service';

@Injectable({
    providedIn: 'root'
})
export class ConfiguracaoService {
    private config = { ip: "123", idfilial: "1" }
    telaAtiva: string = '';
    public ip: string = '192.168.174.1';
    public filial: string = '1';
    public filial_id: any;


    constructor(
        public toastController: ToastController,
    ) {

    }
 

     setConfigueData(ip?: string, filial?: any, auto?: boolean, cor?:  string, macImpressora?: string, colunasImpressao?: string, estoque?:boolean, cnpj?: string, nome?: string) {
        let config = {
            ip: "192.168.174.1",
            filial: { id: 1 },
            inventarioAutomatico: true,
            cor:"tema-laranja",
            macImpressora: '123',
            colunasImpressao: '48',
            estoque:true,
            cnpj:'',
            nome:''
        }

        if ((ip != null) && (ip != undefined)) {
            config.ip = ip;
        }

        if ((filial != null) && (filial != undefined)) {
            config.filial = filial;
        }

        if ((cor != null) && (cor != undefined)) {
            config.cor = cor;
        }

        if ((macImpressora != null) && (macImpressora != undefined)) {
            config.macImpressora = macImpressora;
        }

        if ((colunasImpressao != null) && (colunasImpressao != undefined)) {
            config.colunasImpressao = colunasImpressao;
        }

        if((estoque != null) && (estoque != undefined)){
            config.estoque = estoque;
        }

        if((cnpj != null) && (cnpj != undefined)){
            config.cnpj = cnpj;
        }

        if((nome != null) && (nome != undefined)){
            config.nome = nome;
        }
        
        config.inventarioAutomatico = auto;
        localStorage.setItem("config", JSON.stringify(config))

    }


    setPedidoData(_pedido: string) {       
        localStorage.setItem("pedido", JSON.stringify(_pedido));
    }

    getPedidoData(): any {
        return JSON.parse(localStorage.getItem("pedido"));
    }


    getConfigueData(): any {
        return JSON.parse(localStorage.getItem("config"));
    }

    verifyDarkTheme() : boolean{
        if(localStorage.getItem('color-theme-dark')){
            document.body.setAttribute('color-theme','dark');
            return true;
        }else{
            document.body.setAttribute('color-theme','light');
            return false;
        }
    }

    changeTheme(event) {
        if(event.detail.checked) {
            document.body.setAttribute('color-theme','dark');
            localStorage.setItem('color-theme-dark','theme');
        }else{
            document.body.setAttribute('color-theme','light');
            localStorage.removeItem('color-theme-dark');
        }

    }


}
