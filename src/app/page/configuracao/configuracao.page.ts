import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Credentials } from "../../seguranca/credentials";
import { HttpUtilService } from "../../services/http-util.service";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { AuthenticatedUser } from "../../seguranca/authenticated-user";
import { PermissaoSistema } from "../../seguranca/permissao-sistema";
import { PagePadrao } from "../../utils/page-padrao";
//import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ConfiguracaoService } from "../../services/configuracao.service";
import { NgModule } from '@angular/core';


@Component({
    selector: 'app-configuracao',
    templateUrl: './configuracao.page.html',
    styleUrls: ['./configuracao.page.scss'],
})
export class ConfiguracaoPage extends PagePadrao implements OnInit {
    private IP: any;
    public objConfiguracao: any = { id: 0 };
    public lblEstoque: string = "Todos os Estoque";
    public estoque: boolean = true;
    listaFilial: any = {};
    filial_id: any = { id: 1 };
    showConfiguracao: any;
    impressoras = [];
    toggle_theme : boolean;


    public entradaConsulta: any;
    constructor(
        public menuCtrl: MenuController,
        private router: Router,
        private http: HttpUtilService,
        alertController: AlertController,
        private configuracaoService: ConfiguracaoService,
        public toastController: ToastController,
       // private bluetoothSerial: BluetoothSerial,

    ) {
        super(alertController);
        this.menuCtrl.enable(true);
    }

    async ionViewDidEnter() {
        this.listarImpressoras();
    }

    async acaoEscolherEstoqueProdutoPesquisa(e: Event) {

        this.objConfiguracao.estoque = !this.objConfiguracao.estoque;

        if (this.objConfiguracao.estoque) {
            this.lblEstoque = "Todos os Estoque ";
        }

        if (!this.objConfiguracao.estoque) {
            this.lblEstoque = "Estoque Positivo";
        }
        this.GravaConfiguracao();
        e.stopPropagation()
    }

    listarImpressoras() {
    //     this.bluetoothSerial.list().then(async result => {
    //         this.impressoras = result;

    //         if (result.length <= 0) {
    //           //  alert('Nao foi possivel listar os dispositivos, verifique se o bluetooth esta ligado');
    //         } else {

    //         }

    //         // this.configuracao = await this.configService.getConfiguracao();
    //     }).catch(err => {
    //         alert('Nao foi possivel listar os dispositivos, verifique se o bluetooth esta ligado');
    //     });
    }

    async ionViewWillEnter() {


    }

    async ngOnInit() {
        this.listarImpressoras();
        this.listaFilial = new Array();
        this.showConfiguracao = false;
        this.objConfiguracao = this.configuracaoService.getConfigueData();

        if (this.objConfiguracao == null) {
            this.configuracaoService.setConfigueData();
        } else {
            this.configuracaoService.setConfigueData(this.objConfiguracao.ip, this.objConfiguracao.filial, true, this.objConfiguracao.cor,
                this.objConfiguracao.macImpressora, this.objConfiguracao.colunasImpressao, this.objConfiguracao.estoque);
        }

        if ((this.objConfiguracao != null) && (this.objConfiguracao != undefined)) {

            if ((this.objConfiguracao.ip != null) && (this.objConfiguracao.ip != "")) {
                this.showConfiguracao = true;
                this.filial_id = this.objConfiguracao.filial?.id;
                this.carregarFilial();
                this.showConfiguracao = true;
                this.configuracaoService.setConfigueData(this.objConfiguracao.ip, this.objConfiguracao.filial, true, this.objConfiguracao.cor,
                    this.objConfiguracao.macImpressora, this.objConfiguracao.colunasImpressao, this.objConfiguracao.estoque);
            } else {
                this.configuracaoService.setConfigueData(this.objConfiguracao.ip, 1, true, this.objConfiguracao.cor,
                    this.objConfiguracao.macImpressora, this.objConfiguracao.colunasImpressao, this.objConfiguracao.estoque);
                this.filial_id = 1;
            }
    

            
            if (this.objConfiguracao.estoque) {
                this.lblEstoque = "Todos os Estoque ";
            }

            if (!this.objConfiguracao.estoque) {
                this.lblEstoque = "Estoque Positivo";
            }

        } else {
            this.configuracaoService.setConfigueData();
            await this.carregarFilial();
        }

        if(this.configuracaoService.verifyDarkTheme()){
            this.toggle_theme = true;
        }

    }

    changeTheme(event) {
        this.configuracaoService.changeTheme(event);
    }

    avancar() {
        this.GravaConfiguracao();
        this.router.navigate(['/login']);
    }

    async GravaConfiguracao() {
        if (this.objConfiguracao.ip.length > 8) {
            this.objConfiguracao.filial = { id: this.filial_id }
            if (this.listaFilial != '') {
                this.configuracaoService.setConfigueData(this.objConfiguracao.ip, this.objConfiguracao.filial, true,
                    this.objConfiguracao.cor, this.objConfiguracao.macImpressora, this.objConfiguracao.colunasImpressao, this.objConfiguracao.estoque);
            } else {
                this.configuracaoService.setConfigueData(this.objConfiguracao.ip, "", true, this.objConfiguracao.cor,
                    this.objConfiguracao.macImpressora, this.objConfiguracao.colunasImpressao, this.objConfiguracao.estoque);
            }
            this.carregarFilial();
            document.getElementById("body").setAttribute('class', this.objConfiguracao.cor);
            this.Mensagem("Configuração inserida com sucesso!");
        }

    }

    async Mensagem(msg: any) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000,
            position: "bottom"
        });
        toast.present();
    }

    async carregarFilial() {
        this.listaFilial = new Array();
        //  alert(this.listaFilial)
        this.listaFilial = await this.http.get('/filiais');
        //   alert(this.listaFilial)

    }

}
