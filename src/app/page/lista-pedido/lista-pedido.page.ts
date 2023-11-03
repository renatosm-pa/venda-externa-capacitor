import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AlertController, IonRouterOutlet, MenuController, ModalController, NavController, Platform, PopoverController, ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
import { HttpUtilService } from "../../services/http-util.service";
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
import { Impressao } from 'src/app/services/impressao.service';
import { PagePadrao } from 'src/app/utils/page-padrao';
// import EscPosEncoder from 'esc-pos-encoder-ionic';



@Component({
    selector: 'app-lista-pedido',
    templateUrl: './lista-pedido.page.html',
    styleUrls: ['./lista-pedido.page.scss'],
})
export class PedidoListPage extends PagePadrao implements OnInit {

    public listaPedido: any;
    public pesquisaPedido: any;
    public acao: any;
    public nomeCliente: any;
    quantidadeRegistros: any;
    registrosPorPagina = 15;
    posicaoInicial = 0;
    tableStyle = 'bootstrap';
    subscribe: any;

    // set up hardware back button event.
    lastTimeBackPress = 0;
    timePeriodToExit = 2000;

    @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;



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
        private configuracaoService: ConfiguracaoService,
        private platform: Platform,
        private httpCliente: HttpClient,
        private pdfService: PdfService,
        private impressao: Impressao,
       // private statusBar: StatusBar,
        public modalCtrl: ModalController,
        private menu: MenuController,
        private popoverCtrl: PopoverController,
        public toastController: ToastController,
        public modalController: ModalController,


    ) {
        super(alertController);
        this.menuCtrl.enable(true);

    }

    novoPedido() {
        this.pedidoService.acao_inserir = true;
        this.pedidoService.dadosPedido = new Object();
        this.pedidoService.dadosPedido.endereco = new Object();
        this.pedidoService.dadosPedido.listaPedidoItem = new Array();
        this.pedidoService.nomeCliente = "";
        this.router.navigate(['/pedido']);
    }

    voltar() {
        this.router.navigate(['/']);
    }

    async ionViewDidEnter() {

        this.listaPedido = new Array();
        if (this.pedidoService.vendedorObj != undefined) {
            await this.buscaPedido();
        }

        this.pedidoService.objPedidoOFF = this.configuracaoService.getPedidoData();

        if ((this.pedidoService.objPedidoOFF.id == null) || (this.pedidoService.objPedidoOFF.id == undefined)) {
            await this.Mensagem("Existe um pedido que precisa ser finalizado!");
            await this.perguntaApagarItemPedidoInserit(this.pedidoService.objPedidoOFF);

        } else {
            await this.Mensagem("O pedido do " + this.pedidoService.objPedidoOFF.cliente.razaoSocial + " Precisa ser finalizado!");
            await this.perguntaApagarItemPedidoAlterar(this.pedidoService.objPedidoOFF);
        }

    }


    async perguntaApagarItemPedidoInserit(pedido: any) {

        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Pedido não Finalizado',
            message: '<trong>Deseja Deletar o Pedido</strong>',
            buttons: [
                {
                    text: 'Sim',
                    role: 'Sim',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('removeItemPedido');
                        this.configuracaoService.setPedidoData(null);
                        this.Mensagem("Pedido removido com sucesso!");
                    }
                }, {
                    text: 'Não',
                    handler: async () => {
                        console.log('novoPedido');
                        this.novoPedido();
                    }
                }
            ]
        });

        await alert.present();
    }

    async perguntaApagarItemPedidoAlterar(pedido: any) {

        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Pedido não finalizado',
            message: '<trong>Deseja Deletar o Item ?</strong>',
            buttons: [
                {
                    text: 'Sim',
                    role: 'Sim',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('removeItemPedido');
                        this.configuracaoService.setPedidoData(null);
                        this.Mensagem("Pedido removido com sucesso!");
                    }
                }, {
                    text: 'Não',
                    handler: async () => {
                        console.log('detalharPedido');
                        this.detalharPedido(this.pedidoService.objPedidoOFF, 1);
                    }
                }
            ]
        });

        await alert.present();
    }

    async buscaPedido() {
        // this.pedidoService.entradaConsulta = new Array();

        let vendedor = null;
        if (this.pedidoService.vendedorObj != undefined) {
            vendedor = this.pedidoService.vendedorObj.id;
        }

        this.pedidoService.entradaConsulta = {
            posicaoInicial: 0,
            quantidadeRegistros: 15,
            situacao: "",
            idPedido: '',
            dataEmissao: "",
            nomeCliente: this.nomeCliente,
            idFilial: this.pedidoService.objConfiguracao.filial.id,
            idVendedor: vendedor,
            dataEntrega: ""
        };

        await this.consultar();
    }

    async ngOnInit() {
        this.nomeCliente = "";
        this.pedidoService.objConfiguracao = this.configuracaoService.getConfigueData();
        this.pedidoService.entradaConsulta = new Array();

        if (this.pedidoService.objConfiguracao.filial.id == undefined) {
            alert("Escolha sua filial!");
            this.router.navigate(['login']);
            return;
        }


        if (this.pedidoService.vendedorObj == undefined) {
            alert("Usuario sem Vendedor cadastrado!");
            this.router.navigate(['login']);
            return;
        }

        let vendedor = null;
        if (this.pedidoService.vendedorObj != undefined) {
            vendedor = this.pedidoService.vendedorObj.id;
        }

        this.pedidoService.entradaConsulta = {
            posicaoInicial: 0,
            quantidadeRegistros: 15,
            situacao: "",
            idPedido: '',
            dataEmissao: "",
            nomeCliente: this.nomeCliente,
            idFilial: this.pedidoService.objConfiguracao.filial.id,
            idVendedor: vendedor,
            dataEntrega: ""
        };

        if (this.usuarioLogado.authUser == undefined) {
            alert('Não esta logado!');
            this.voltar();
        }


    }

    async Mensagem(msg: any) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000,
            position: "middle"
        });
        toast.present();
    }

    async consultar() {
        try {

            if (this.pedidoService.objConfiguracao.filial.id == undefined) {
                alert("Escolha sua filial!");
                this.router.navigate(['configuracao']);
                return;
            }

            if (this.pedidoService.vendedorObj == undefined) {
                alert("Usuario sem Vendedor cadastrado!");
                this.router.navigate(['login']);
                return;
            }

            this.posicaoInicial = 0;
            this.quantidadeRegistros = await this.http.post('/pedido/busca-pedido-count', this.pedidoService.entradaConsulta);

            this.loaderService.showLoader("Buscando Pedido...");
            this.listaPedido = await this.http.post('/pedido/busca-pedido', this.pedidoService.entradaConsulta);
            console.log(this.listaPedido);

            await this.loaderService.hideLoader();
            this.posicaoInicial += this.registrosPorPagina;

            if (this.listaPedido.length == 0) {
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

            let vendedor = null;
            if (this.pedidoService.vendedorObj != undefined) {
                vendedor = this.pedidoService.vendedorObj.id;
            }



            this.pedidoService.entradaConsulta = {
                posicaoInicial: this.posicaoInicial,
                quantidadeRegistros: this.registrosPorPagina,
                situacao: "",
                idPedido: '',
                dataEmissao: "",
                nomeCliente: "",
                idFilial: this.pedidoService.objConfiguracao.filial.id,
                idVendedor: vendedor,
                dataEntrega: ""
            };


            let url = '/pedido/busca-pedido';
            let novositems = await this.http.post(url, this.pedidoService.entradaConsulta);
            this.posicaoInicial += this.registrosPorPagina;

            for (let item of novositems) {
                this.listaPedido.push(item);
            }

            event.target.complete();

        }, 500);
    }

    numberToReal(numero) {
        var numero = numero.toFixed(2).split('.');
        numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    }

    DateFormatadaMostrar(str: string): Date {
        let data = null;
        if (str !== undefined) {
            let ANO = str.substr(0, 4);
            //console.log("ANO: " + ANO)
            let MES = str.substr(5, 2);
            //console.log("MES: " + MES)
            let DIA = str.substr(8, 2);
            //console.log("DIA: " + DIA)
            //console.log(DIA + "/" + MES + "/" + ANO + " 00:00:00")
            data = DIA + "/" + MES + "/" + ANO;

        }
        return data;

    }

    mostraSituacao(situacao) {
        let sit = "";
        if (situacao == 'EM_ANALISE') {
            sit = "Em Análise";
        }

        if (situacao == 'EM_SEPARACAO') {
            sit = "Em Separação";
        }

        if (situacao == 'SEPARADO') {
            sit = "Em Aberto";
        }

        if (situacao == 'PREPARANDO_ENTREGA') {
            sit = "Preparando para Entrega";
        }

        if (situacao == 'SAIU_ENTREGA') {
            sit = "Saiu para Entrega";
        }

        if (situacao == 'FINALIZADO') {
            sit = "Finalizado";
        }

        if (situacao == 'CANCELADO') {
            sit = "Cancelado";
        }

        if (situacao == 'AGUARDANDO_CONFIRMACAO_CLIENTE') {
            sit = "Aguardando Confirmação do Cliente";
        }

        return sit;
    }

    mostraPercentual(valorDescontoAcrescimoItem: any, valorUnitario: any, quantidadeVendida: any) {
        let perc_desc;
        perc_desc = ((valorDescontoAcrescimoItem / valorUnitario) * 100) / quantidadeVendida;
        return perc_desc;

    }

    async perguntaPedido(pedido: any, index: any) {
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
                        this.cancelarPedido(pedido.id);
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

    async cancelarPedido(idPedido: any) {
        try {
            let url = '/pedido/cancela/' + idPedido;
            let res = await this.http.get(url);
            this.loaderService.hideLoader();
        } catch (e) {
            this.loaderService.hideLoader();
            this.addErroException(e.error.message);
        }
        return Promise.resolve();
    }

    detalharPedido(pedido: any, index: any) {
        this.pedidoService.acao_inserir = false;
        this.pedidoService.dadosPedido = new Object();
        this.pedidoService.dadosPedido.endereco = new Object();
        this.pedidoService.dadosPedido.listaPedidoItem = new Array();
        this.listaPedido = new Array();
        //console.log("pedido: " + pedido);
        //console.log("cliente: " + pedido.cliente);

        this.pedidoService.dadosPedido = pedido;
        this.pedidoService.dadosPedido.cliente = pedido.cliente;
        this.pedidoService.dadosPedido.planoPagamento = pedido.planoPagamento;
        this.pedidoService.dadosPedido.formaPagamento = pedido.formaPagamento;
        this.pedidoService.dadosPedido.profissional = pedido.profissional;

        if ((pedido.dataEntrega != '') && (pedido.dataEntrega != null)) {
            this.pedidoService.dadosPedido.dataEntrega = StringUtils.DateFormatadaMostrar(pedido.dataEntrega);
        }


        //alert(this.pedidoService.dadosPedido.percentualDesconto);
        // this.pedidoService.planoPagamento.formaPagamento.dominioTipoPagamento = pedido.planoPagamento.formaPagamento.dominioTipoPagamento;

        this.router.navigate(['/pedido']);
    }

    async abreFiltro2() {
        // this.popover.create({
        //     component: FiltroComponentPage, cssClass: 'my-popover',
        //     showBackdrop: false
        // }).then((popoverElement) => {
        //     popoverElement.present();
        // });



    }

    async abreFiltro() {
        // const modal = await this.modalController.create({ component: FiltroComponentPage });
        // modal.onDidDismiss().then((data) => {
        //     this.consultar();
        // });
        // return await modal.present();
    }



    async perguntaRelatorioPDF(pedido: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-lista-pedido',
            header: ' Pedido (' + pedido.id + ')',
            message: 'Deseja que mostre o desconto do pedido?</strong> </strong>?',
            buttons: [
                {
                    text: 'Sim',
                    role: 'Sim',

                    cssClass: 'primary',
                    handler: (blah) => {
                        console.log('sim: ' + pedido.id);
                        this.carregarRelatorioPDF(pedido.id);
                    }
                }, {
                    text: 'NÃO',
                    handler: () => {
                        console.log('não');
                        this.carregarRelatorioSemDescontoPDF(pedido.id);
                    }
                }
            ]
        });

        await alert.present();
    }

    async carregarRelatorioPDF(idPedido: any) { //, mostrarDesc: any
        await this.loaderService.showLoader("Carregando PDF...");
        let filtroParametro = { idPedido: idPedido,
            empresa: this.pedidoService.objConfiguracao.filial.razaoSocial +' - CNPJ.:'+ this.pedidoService.objConfiguracao.filial.cpfCnpj ,
            empresa2:' Endereço:'+ this.pedidoService.objConfiguracao.filial.enderecoFilial.endereco+ ' - Fone: ' + this.pedidoService.objConfiguracao.filial.fone1};
        //alert(this.pedidoService.objConfiguracao.filial.razaoSocial)
        let json = JSON.stringify(filtroParametro);
        let res = await this.httpCliente.post(this.http.getURLBase() + '/pedido/pedido-cliente-pdf/', json, {
            headers: { 'sessionId': 'I8794@&8jHGGFgh%_' },
            observe: 'response',
            responseType: 'blob'
        }).toPromise();

        this.pdfService.downloadFile(res.body, "Pedido(" + idPedido + ").pdf");
        await this.loaderService.hideLoader();
        return res;
    }


    async carregarRelatorioSemDescontoPDF(idPedido: any) { //, mostrarDesc: any
        await this.loaderService.showLoader("Carregando PDF...");
        let filtroParametro = { idPedido: idPedido,
        empresa: this.pedidoService.objConfiguracao.filial.razaoSocial +' - CNPJ.:'+ this.pedidoService.objConfiguracao.filial.cpfCnpj ,
        empresa2:' Endereço:'+ this.pedidoService.objConfiguracao.filial.enderecoFilial.endereco+  ' - Fone: ' + this.pedidoService.objConfiguracao.filial.fone1};
        //alert(this.pedidoService.objConfiguracao.filial.razaoSocial+'  Fone:'+ this.pedidoService.objConfiguracao.filial.fone1 +' - End.:'+ this.pedidoService.objConfiguracao.filial.enderecoFilial.endereco)
        let json = JSON.stringify(filtroParametro);
        let res = await this.httpCliente.post(this.http.getURLBase() + '/pedido/pedido-sem-desc-cliente-pdf/', json, {
            headers: { 'sessionId': 'I8794@&8jHGGFgh%_' },
            observe: 'response',
            responseType: 'blob'
        }).toPromise();

        this.pdfService.downloadFile(res.body, "Pedido(" + idPedido + ").pdf");
        await this.loaderService.hideLoader();
        return res;
    }

    base64ToArrayBuffer(data) {
        var input = data.substring(data.indexOf(',') + 1);
        var binaryString = window.atob(input);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    };

    imprimirCupom(pedido) {
        this.impressao.imprimirPedidoAndroid(pedido);
    };
}
