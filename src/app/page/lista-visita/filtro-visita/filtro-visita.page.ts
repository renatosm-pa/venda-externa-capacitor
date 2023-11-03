import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, ModalController, NavController, PopoverController, ToastController } from '@ionic/angular'
import { ConfiguracaoService } from 'src/app/services/configuracao.service';
import { HttpUtilService } from 'src/app/services/http-util.service';
import { LoaderService } from 'src/app/services/loader.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { UsuarioLogadoService } from 'src/app/services/usuario-logado.service';
import { StringUtils } from 'src/app/utils/string-utils';
import { FiltroPedidoService } from 'src/app/services/filtro-pedido.service';
import { ItemPedidoService } from 'src/app/services/item-pedido.service';
import { PagePadrao } from 'src/app/utils/page-padrao';
import { VisitaService } from 'src/app/services/visita.service';
import { Keyboard } from '@capacitor/keyboard';
import { map } from "rxjs/operators";
import { LoadingController } from '@ionic/angular';
import { firstValueFrom, fromEvent, Subscription } from 'rxjs';

import { FiltroParametro } from 'src/app/utils/filtro-parametro';
import { async } from 'rxjs/internal/scheduler/async';
import { ResultadoCredencial } from 'src/app/services/resultado-credencial';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

@Component({
    selector: 'app-filtro-visita',
    templateUrl: './filtro-visita.page.html',
    styleUrls: ['./filtro-visita.page.scss'],
})

export class FiltroVisitaPage extends PagePadrao implements OnInit {

    conf: any;
    quantidadeRegistros: any;
    posicaoInicial = 0;
    registrosPorPagina = 15;
    listaCliente: any;
    public sumirtela: boolean = false;
    tableStyle = 'bootstrap';
    public dadosVisita: any
    public idVendedor: any;
    nomeCliente: any;

    constructor(
        private popover: PopoverController,
        public menuCtrl: MenuController,
        private router: Router,
        private http: HttpUtilService,
        alertController: AlertController,
        private usuarioLogado: UsuarioLogadoService,
        private navCtrl: NavController,
        public loaderService: LoaderService,
        private ngZone: NgZone,
        private configuracaoService: ConfiguracaoService,
        public toastController: ToastController,
        public pedidoService: PedidoService,
        public modalController: ModalController,
        public visitaService: VisitaService
    ) {
        super(alertController);
        this.menuCtrl.enable(true);
    }




    dismiss() {
        this.modalController.dismiss({
            'dismissed': true
        });
    }

    irListaVisita() {
        this.router.navigate(['/lista-visita']);
    }

    async openCalendarVisita() {
        // const options: CalendarModalOptions = {
        //     title: 'Data da Visita',
        //     color: 'primary',
        //     closeLabel: 'Cancelar',
        //     doneLabel: 'OK',
        //     weekStart: 1,
        //     weekdays: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        //     canBackwardsSelected: true,
        // };

        // let myCalendar = await this.modalController.create({
        //     component: CalendarModal,
        //     componentProps: { options }
        // });


        // myCalendar.onDidDismiss().then(result => {

        //     let ANO = result.data.string.substr(0, 4);
        //     //console.log(ANO)    

        //     let MES = result.data.string.substr(5, 2);
        //     //console.log(MES)   

        //     let DIA = result.data.string.substr(8, 2);
        //     //console.log(DIA)

        //     // console.log(DIA + "/" + MES + "/" + ANO)
        //     this.visitaService.entradaConsultaVisita.dataVisita = DIA + "/" + MES + "/" + ANO

        // })

        // myCalendar.present();
    }

    async openCalendarProximaVisita() {
        // const options: CalendarModalOptions = {
        //     title: 'Data da Proxima Visita',
        //     color: 'primary',
        //     closeLabel: 'Cancelar',
        //     doneLabel: 'OK',
        //     weekStart: 1,
        //     weekdays: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        //     canBackwardsSelected: true,
        // };

        // let myCalendar = await this.modalController.create({
        //     component: CalendarModal,
        //     componentProps: { options }
        // });


        // myCalendar.onDidDismiss().then(result => {
        //     // console.log(result);
         
        //     let ANO = result.data.string.substr(0, 4);
        //     //console.log(ANO)   
        //     let MES = result.data.string.substr(5, 2);
        //     //console.log(MES) 
        //     let DIA = result.data.string.substr(8, 2);
        //     //console.log(DIA)    

        //     // console.log(DIA + "/" + MES + "/" + ANO)
        //     this.visitaService.entradaConsultaVisita.dataProximaVisita = DIA + "/" + MES + "/" + ANO
        // })

        // myCalendar.present();
    }

    async itemClienteSelecionado(cliente: any) {

        this.pedidoService.dadosVisita.cliente = cliente;
        this.nomeCliente = cliente.razaoSocial;

        console.log(cliente);
        this.sumirtela = true;
    }

    async carregarCliente() {

        if (await this.pedidoService.existePermissao("2.08.04") == true) {
            this.idVendedor = "null";
        } else {
            this.idVendedor = this.pedidoService.vendedorObj.id;
        }
        // alert(this.nomeCliente)
        this.loaderService.showLoader("Buscando Clientes...");
        this.sumirtela = false;
        this.listaCliente = await this.http.get('/clientes/nome/' + this.nomeCliente.toUpperCase() + "/" + this.idVendedor);
        Keyboard.hide();
        this.loaderService.hideLoader();
    }

    async ngOnInit() {
        this.conf = {
            firstDayOfWeek: 1,
            dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            dayNamesShort: ['Dom', 'Seg', 'Ter', 'Quar', 'Quin', 'Sex', 'Sáb'],
            dayNamesMin: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
            monthNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            today: 'Hoje',
            clear: 'Cancelar'
        };

        this.visitaService.entradaConsultaVisita = new Array();
        this.visitaService.entradaConsultaVisita = {
            posicaoInicial: this.posicaoInicial,
            quantidadeRegistros: this.registrosPorPagina,
            idCliente: this.nomeCliente,
            idFilial: this.pedidoService.objConfiguracao.filial.id,
            idUsuario: this.usuarioLogado.authUser.id,
            dataVisita:this.visitaService.entradaConsultaVisita.dataVisita,
            dataProximaVisita:this.visitaService.entradaConsultaVisita.dataProximaVisita,
        };
    }

    fechaFiltro() {
        //alert(this.visitaService.entradaConsultaVisita.dataVisita);
        this.visitaService.entradaConsultaVisita = {
            posicaoInicial: this.posicaoInicial,
            quantidadeRegistros: this.registrosPorPagina,
            idCliente: this.nomeCliente,
            idFilial: this.pedidoService.objConfiguracao.filial.id,
            idUsuario: this.usuarioLogado.authUser.id,
            dataVisita:this.visitaService.entradaConsultaVisita.dataVisita,
            dataProximaVisita:this.visitaService.entradaConsultaVisita.dataProximaVisita,
        };
        //alert(this.visitaService.entradaConsultaVisita.dataVisita);

        this.modalController.dismiss({
            'dismissed': true
        });
    }





}
