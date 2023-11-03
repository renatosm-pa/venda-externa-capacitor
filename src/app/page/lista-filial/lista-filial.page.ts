import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AlertController, IonRouterOutlet, MenuController, ModalController, NavController, Platform, PopoverController } from "@ionic/angular";
import { Router } from "@angular/router";
import { HttpUtilService } from "../../services/http-util.service";
import { PagePadrao } from "../../utils/page-padrao";
import { UsuarioLogadoService } from "../../services/usuario-logado.service";
import { LoginPage } from "../login/login.page";
import { LoaderService } from "../../services/loader.service";
import { StringUtils } from 'src/app/utils/string-utils';
import { PedidoService } from 'src/app/services/pedido.service';
import { FiltroPedidoService } from 'src/app/services/filtro-pedido.service';
import { ConfiguracaoService } from 'src/app/services/configuracao.service';
import { Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PdfService } from 'src/app/services/pdf.service';






@Component({
    selector: 'app-lista-filial',
    templateUrl: './lista-filial.page.html',
    styleUrls: ['./lista-filial.page.scss'],
})
export class FilialListPage extends PagePadrao implements OnInit {
    public entradaConsulta: any;
    public listafilial: any;
    public nomeFilial: any;
    quantidadeRegistros: any;
    registrosPorPagina = 15;
    posicaoInicial = 0;
    tableStyle = 'bootstrap';
    subscribe: any;

    constructor(
        public menuCtrl: MenuController,
        private router: Router,
        private http: HttpUtilService,
        alertController: AlertController,
        private usuarioLogado: UsuarioLogadoService,
        private navCtrl: NavController,
        public loaderService: LoaderService,
        public pedidoService: PedidoService,
        private popover: PopoverController,
        public modalController: ModalController,
        private configuracaoService: ConfiguracaoService,
        private platform: Platform,
        private httpCliente: HttpClient,
        private pdfService: PdfService,
        public modalCtrl: ModalController,
        private menu: MenuController,
        private popoverCtrl: PopoverController,

    ) {
        super(alertController);
        this.menuCtrl.enable(true);

    }


    

    irlistaPedido() {
         this.router.navigate(['/lista-pedido']);
    }


    voltar() {
        this.router.navigate(['/']);
    }

    async ionViewDidEnter() {
      this.listafilial = new Array();
      await this.consultar();
    
    }

    async ngOnInit() {

        this.nomeFilial = "";
        this.pedidoService.objConfiguracao = this.configuracaoService.getConfigueData();
        this.entradaConsulta = new Array();

        if (this.pedidoService.vendedorObj == undefined) {
            alert("Usuario sem Vendedor cadastrado!");
            this.router.navigate(['configuracao']);
            return;
        }

        if (this.usuarioLogado.authUser == undefined) {
            alert('Não esta logado!');
            this.voltar();
        }

        
        this.loaderService.hideLoader();    
    }

    async consultar() {
        try {
            this.entradaConsulta = new Array();
            if (this.pedidoService.vendedorObj == undefined) {
                alert("Usuario sem Vendedor cadastrado!");
                this.router.navigate(['login']);
                return;
            }

            this.entradaConsulta = {
                posicaoInicial: 0,
                quantidadeRegistros: 100,
                razaoSocial: "",                
            };

            this.loaderService.showLoader("Buscando Filiais...");
            this.listafilial = await this.http.post('/filiais/busca-filiais', this.entradaConsulta);   
            this.loaderService.hideLoader();            

            if (this.listafilial.length == 0) {
                 this.addWarning('Nenhum conteúdo encontrado');
            }
            this.loaderService.hideLoader();
        } catch (e) {
             this.addErro(e);
             this.loaderService.hideLoader();
        }
    }


    async perguntaFilial(pedido: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-lista-pedido',
            header: ' Pedido (' + pedido.id + ')',
            message: 'Deseja <strong>Cancelar o Pedido</strong> </strong>?',
            buttons: [
                {
                    text: 'Sim',
                    role: 'Sim',

                    cssClass: 'primary',
                    handler: (blah) => {
                        //this.cancelarPedido(pedido.id);
                        this.consultar();
                        //this.Mensagem("Item " + pedidoitem.id + " removido com sucesso!");
                    }
                }, {
                    text: 'NÃO',
                    handler: () => {
                        console.log('Confirm Okay');
                        //this.detalharPedido(pedido, index);
                    }
                }
            ]
        });

        await alert.present();
    }


    async detalharListaFilial(filial: any){
        this.pedidoService.objConfiguracao = await this.configuracaoService.getConfigueData();

        this.pedidoService.filialSelecionada = filial;
        await this.configuracaoService.setConfigueData(this.pedidoService.objConfiguracao.ip, filial,true, 
                                                 this.pedidoService.objConfiguracao.cor,
                                                 this.pedidoService.objConfiguracao.macImpressora, 
                                                 this.pedidoService.objConfiguracao.colunasImpressao, 
                                                 this.pedidoService.objConfiguracao.estoque);

        this.router.navigate(['/acesso-rapido']);
    }

    

    ionViewDidLoad() {
        alert('ionViewDidLoad ModalPage');

    }







}
