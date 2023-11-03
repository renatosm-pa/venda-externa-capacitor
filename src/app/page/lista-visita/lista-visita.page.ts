import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController, NavController } from "@ionic/angular";
import { Router } from "@angular/router";
import { HttpUtilService } from "../../services/http-util.service";
import { PagePadrao } from "../../utils/page-padrao";
import { UsuarioLogadoService } from "../../services/usuario-logado.service";
import { LoaderService } from "../../services/loader.service";
import { ClienteService } from 'src/app/services/cliente.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { VisitaService } from 'src/app/services/visita.service';
import { ConfiguracaoService } from 'src/app/services/configuracao.service';
import { FiltroVisitaPage } from './filtro-visita/filtro-visita.page';

@Component({
    selector: 'app-lista-visita',
    templateUrl: './lista-visita.page.html',
    styleUrls: ['./lista-visita.page.scss'],
})

export class VisitaListPage extends PagePadrao implements OnInit {

    public listaVisita: any;
    public nomeCliente: any;
    public acao: any;
    quantidadeRegistros: any;
    registrosPorPagina = 15;
    posicaoInicial = 0;
    entradaConsulta: any;

    tableStyle = 'bootstrap';

    constructor(
        public menuCtrl: MenuController,
        private router: Router,
        private http: HttpUtilService,
        alertController: AlertController,
        private usuarioLogado: UsuarioLogadoService,
        private navCtrl: NavController,
        public loaderService: LoaderService,
        public clienteService: ClienteService,
        public modalController: ModalController,
        public pedidoService: PedidoService,
        public visitaService: VisitaService,
        private configuracaoService: ConfiguracaoService,
    ) {
        super(alertController);
        this.menuCtrl.enable(true);

    }

    cadastroVisita() {
        this.pedidoService.dadosVisita = new Object();
        this.router.navigate(['/visita']);
    }


    irDebito() {
        this.router.navigate(['/titulo']);
    }


    ionViewWillEnter() {        
        this.acao = "L";
        this.listaVisita = new Array();       
        this.buscaVisita();
        this.loaderService.hideLoader();

    }

    ngOnInit() {
        
        this.pedidoService.objConfiguracao = this.configuracaoService.getConfigueData();
        this.pedidoService.dadosVisita = new Object();
        this.visitaService.entradaConsultaVisita = new Array();
        this.visitaService.entradaConsultaVisita = {
            posicaoInicial: this.posicaoInicial,
            quantidadeRegistros: this.registrosPorPagina,
            idCliente: this.nomeCliente,
            idFilial: this.pedidoService.objConfiguracao.filial.id,
            idUsuario: this.usuarioLogado.authUser.id,
            // dataVisita:this.visitaService.entradaConsultaVisita.dataVisita,
            // dataProximaVisita:this.visitaService.entradaConsultaVisita.dataProximaVisita,
        };
    }


    async abreFiltro() {
        const modal = await this.modalController.create({ component: FiltroVisitaPage });
        modal.onDidDismiss().then((data) => {
            this.consultar();
        });
        return await modal.present();
    }


    DateFormatadaMostrar(str: string): Date {
        let data = null;
        if (str !== undefined) {
            let ANO = str.substr(0, 4);
           // console.log("ANO: " + ANO)
            let MES = str.substr(5, 2);
           // console.log("MES: " + MES)
            let DIA = str.substr(8, 2);
           // console.log("DIA: " + DIA)
            //console.log(DIA + "/" + MES + "/" + ANO + " 00:00:00")
            data = DIA + "/" + MES + "/" + ANO;

        }
        return data;

    }

    voltar() {
        this.router.navigate(['/login']);
    }

    detalharVisita(visita){
        
        this.pedidoService.dadosVisita = visita;
        this.router.navigate(['/visita']); 
    }

    async perguntaVisita(visita: any) {

        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: '' + visita.cliente.nomeFantasia + '',
            message: 'Deseja alterar a Visita?',
            buttons: [
                {
                    text: 'Sim',
                    role: 'Sim',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        this.detalharVisita(visita);
                    }
                }, {
                    text: 'Não',
                    handler: () => {
                        //this.detalharPedido(pedido, index);

                    }
                }
            ]
        });

        await alert.present();
    }


    ligar(numero) {
        // this.callNumber.callNumber(numero, true)
        //     .then(res => console.log('Launched dialer!', res))
        //     .catch(err => console.log('Error launching dialer', err));
    }

    async buscaVisita() {
        this.pedidoService.objConfiguracao = this.configuracaoService.getConfigueData();
        this.posicaoInicial = 0;
        this.registrosPorPagina = 15;
       
        this.visitaService.entradaConsultaVisita = {
            posicaoInicial: this.posicaoInicial,
            quantidadeRegistros: this.registrosPorPagina,
            idCliente: this.nomeCliente,
            idFilial: this.pedidoService.objConfiguracao.filial.id,
            idUsuario: this.usuarioLogado.authUser.id,
            dataVisita:this.visitaService.entradaConsultaVisita.dataVisita,
            dataProximaVisita:this.visitaService.entradaConsultaVisita.dataProximaVisita,
        };

        await this.consultar();
    }

    async consultar() {
        try {
            this.quantidadeRegistros = await this.http.post('/visita/buscar-count', this.visitaService.entradaConsultaVisita);

            this.loaderService.showLoader("Buscando Visita...");
            this.listaVisita = await this.http.post('/visita/buscar', this.visitaService.entradaConsultaVisita);
            console.log(this.listaVisita);
            await this.loaderService.hideLoader();
            this.posicaoInicial += this.registrosPorPagina;

            if (this.listaVisita.length == 0) {
                await this.addWarning('Nenhum conteúdo encontrado');
            }


        } catch (e) {
            await this.addErro(e);
            await this.loaderService.hideLoader();
        }
    }

    async loadData(event) {
        await setTimeout(async () => {

            if (this.posicaoInicial >= this.quantidadeRegistros) {
                event.target.complete();
                return;
            }

            let url = '/visita/buscar';
            let novositems = await this.http.post(url, this.visitaService.entradaConsultaVisita);
            this.posicaoInicial += this.registrosPorPagina;

            for (let item of novositems) {
                this.listaVisita.push(item);
            }

            event.target.complete();

        }, 500);
    }


}
