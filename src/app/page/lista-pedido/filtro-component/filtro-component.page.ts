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
import { Keyboard } from '@capacitor/keyboard';
import {map} from 'rxjs/operators';



@Component({
  selector: 'app-filtro-component',
  templateUrl: './filtro-component.page.html',
  styleUrls: ['./filtro-component.page.scss'],
})
export class FiltroComponentPage implements OnInit {
  diaSemanada;
  mes: string;
  nomeSemana: string;
  conf: any;
  constructor(private popover: PopoverController,
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
  ) { }

  public sumirtela: boolean = true;
  public listaCliente;
  public listaGrupo;
  public situacao = new Array;
  
  ngOnInit() {

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
    
    this.pedidoService.entradaConsulta = new Array();

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
      nomeCliente: "",
      idFilial: this.pedidoService.objConfiguracao.filial.id,
      idVendedor: vendedor,
      dataEntrega: ""
    };


    this.carregarCliente();
    //this.carregarGrupo();
    this.sumirtela = true;
  }

  fechaFiltro2() {
    this.popover.dismiss();
  }

  fechaFiltro() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async carregarCliente() {
    this.sumirtela = false;
    this.listaCliente = await this.http.get('/clientes/nome/' + this.pedidoService.entradaConsulta.nomeCliente.toUpperCase());
    Keyboard.hide();
  }

  async itemClienteSelecionado(cliente: any) {
    console.log(cliente);
    this.pedidoService.entradaConsulta.nomeCliente = cliente.razaoSocial;
    this.sumirtela = true;
  }

  async openCalendar() {
    // const options: CalendarModalOptions = {
    //   title: 'Data da Emissão',
    //   color: 'primary',
    //   closeLabel: 'Cancelar',
    //   doneLabel: 'OK',
    //   weekStart: 1,
    //   weekdays: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    //   canBackwardsSelected: true,
    // };

    // let myCalendar = await this.modalController.create({
    //   component: CalendarModal,
    //   componentProps: { options }
    // });


    // myCalendar.onDidDismiss().then(result => {
    //   // console.log(result);
    //   // this.pedidoService.entradaConsulta.dataEmissao = result.data.date + "/" + result.data.months + "/" + result.data.years

    //   console.log(result.data.string);

    //   let ANO = result.data.string.substr(0, 4);
    //   //console.log(ANO)



    //   let MES = result.data.string.substr(5, 2);
    //   //console.log(MES)


    //   let DIA = result.data.string.substr(8, 2);
    //   //console.log(DIA)

    //   //console.log(DIA + "/" + MES + "/" + ANO)

      
    //    this.pedidoService.entradaConsulta.dataEmissao = DIA + "/" + MES + "/" + ANO
    // })

    // myCalendar.present();
  }

  async openCalendarEntrega() {
    // const options: CalendarModalOptions = {
    //   title: 'Data da Entrega',
    //   color: 'primary',
    //   closeLabel: 'Cancelar',
    //   doneLabel: 'OK',
    //   weekStart: 1,
    //   weekdays: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    //   canBackwardsSelected: true,
    // };

    // let myCalendar = await this.modalController.create({
    //   component: CalendarModal,
    //   componentProps: { options }
    // });


    // myCalendar.onDidDismiss().then(result => {
    //   // console.log(result);
    //   // this.pedidoService.entradaConsulta.dataEntrega = result.data.date + "/" + result.data.months + "/" + result.data.years

    //   console.log(result.data.string);

    //   let ANO = result.data.string.substr(0, 4);
    //   console.log(ANO)



    //   let MES = result.data.string.substr(5, 2);
    //   console.log(MES)


    //   let DIA = result.data.string.substr(8, 2);
    //   console.log(DIA)

    //   console.log(DIA + "/" + MES + "/" + ANO)
    //   this.pedidoService.entradaConsulta.dataEntrega = DIA + "/" + MES + "/" + ANO
    // })

    // myCalendar.present();
  }







}
