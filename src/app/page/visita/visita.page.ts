import { Component, NgZone, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController, NavController, Platform, ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Credentials } from "../../seguranca/credentials";
import { HttpUtilService } from "../../services/http-util.service";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { AuthenticatedUser } from "../../seguranca/authenticated-user";
import { PermissaoSistema } from "../../seguranca/permissao-sistema";
import { PagePadrao } from "../../utils/page-padrao";

import { ConfiguracaoService } from "../../services/configuracao.service";
import { PedidoService } from 'src/app/services/pedido.service';

import { UsuarioLogadoService } from 'src/app/services/usuario-logado.service';

import { LoaderService } from 'src/app/services/loader.service';
import { StringUtils } from 'src/app/utils/string-utils';
//import { CalendarModal, CalendarModalOptions, CalendarModule } from 'ion2-calendar';
import { Keyboard } from '@capacitor/keyboard';
import { Geolocation, GeolocationOptions, GeolocationPosition } from '@capacitor/geolocation';




@Component({
  selector: 'app-visita',
  templateUrl: './visita.page.html',
  styleUrls: ['./visita.page.scss'],
})
export class VisitaPage extends PagePadrao implements OnInit {
  nomeCliente: any;
  public sumirtela: boolean = false;
  public dadosVisita: any = {};
  public listaCliente;
  listaFilial: any;
  filial_id: any = { id: 1 };
  public idVendedor: any;
  acaoVisita: any;
  constructor(public menuCtrl: MenuController,
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
    public platform: Platform,
    public modalCtrl: ModalController,
     

  ) {
    super(alertController);
    this.menuCtrl.enable(true);
  }





  async getLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      // Trate os dados de localização aqui
      this.getGPSLocation();
    } catch (error) {
      if (error.code === 1) {
        console.error('Serviços de localização desativados. Ative o GPS.');
        alert("Serviços de localização desativados. Ative o GPS.");
      
      } else {
        console.error('Erro ao acessar a localização:', error);
        
      }
    }
  }



  async getGPSLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    const latitude = coordinates.coords.latitude;
    const longitude = coordinates.coords.longitude;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude} `);
  }

  async checkGpsStatus() {
    try {
     

      await Geolocation.getCurrentPosition();
      console.log('GPS is enabled');
      this.getGeolocalizacao();
    } catch (error) {
      console.error('GPS is not enabled or there was an error', error);
      // Display a toast message to the user
      this.presentToast('Please enable GPS/Location services.');

      const requestPermissionResult = await Geolocation.requestPermissions();
      if (requestPermissionResult.location === 'granted') {
        const position: GeolocationPosition = await Geolocation.getCurrentPosition();
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${ latitude }, Longitude: ${ longitude } `);
      } else {
        console.log('Location permission denied.');
      }
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000, // Adjust as needed
      position: 'bottom', // Adjust as needed
    });
    toast.present();
  }


  async ionViewWillEnter() {

  }

  async ngOnInit() {
    this.checkStatusGps();
    this.dadosVisita = new Object();
    if (this.pedidoService.dadosVisita.id != undefined) {
      this.dadosVisita = this.pedidoService.dadosVisita;
      this.itemClienteSelecionado(this.dadosVisita.cliente);
      this.dadosVisita.dataProximaVisita = StringUtils.DateFormatadaMostrar(this.dadosVisita.dataProximaVisita);
      this.acaoVisita = "A";
    } else {
      this.acaoVisita = "I";
    }
    
  }

  irListaVisita() {
    this.router.navigate(['/lista-visita']);
  }

  avancar() {
    this.router.navigate(['/lista-pedido']);
  }

  async checkStatusGps() {
    try {
      await Geolocation.getCurrentPosition();
      // GPS está ligado
     alert("GPS está ligado")
    } catch (error) {
      if (error.code === 2) {
        // Código 2 indica que o GPS está desativado
        alert("GPS está desativado")
      } else {
        alert("Outro erro ocorreu, trate conforme necessário");
        const permission = await Geolocation.checkPermissions();
        if (permission.location === 'granted') {
          // Permissão concedida, você pode acessar a localização
          this.getGeolocalizacao();
        } else {
          // Permissão negada, lidar com isso aqui
        }
      }
    }
  }

  

  async getGeolocalizacao() {

    const coordinates = await Geolocation.getCurrentPosition();
    this.dadosVisita.latitude = coordinates.coords.latitude;
    this.dadosVisita.longitude = coordinates.coords.longitude;
    console.log('longitude:' + this.dadosVisita.longitude);
    console.log('latitude: ' + this.dadosVisita.latitude);


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
    this.listaFilial = await this.http.get('/filiais');
  }

  async carregarCliente() {

    if (await this.pedidoService.existePermissao("2.08.04") == true) {
      this.idVendedor = "null";
    } else {
      this.idVendedor = this.pedidoService.vendedorObj.id;
    }
    this.loaderService.showLoader("Buscando Clientes...");
    this.sumirtela = true;
    this.listaCliente = await this.http.get('/clientes/nome/' + this.nomeCliente.toUpperCase() + "/" + this.idVendedor);
    Keyboard.hide();
    this.loaderService.hideLoader();
  }

  async itemClienteSelecionado(cliente: any) {
    this.dadosVisita.cliente = cliente;
    this.nomeCliente = cliente.razaoSocial;
    console.log(cliente);
    this.sumirtela = false;
  }

  async openCalendar() {
    // const options: CalendarModalOptions = {
    //   title: 'Proxima Visita',
    //   color: 'primary',
    //   closeLabel: 'Cancelar',
    //   doneLabel: 'OK',
    //   weekStart: 1,
    //   disableWeeks: [0, 8],
    //   weekdays: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    //   canBackwardsSelected: true,
    // };

    // let myCalendar = await this.modalCtrl.create({
    //   component: CalendarModal,
    //   componentProps: { options }
    // });



    // myCalendar.onDidDismiss().then(result => {


    //   //  console.log(result.data.string);

    //   let ANO = result.data.string.substr(0, 4);
    //   // console.log(ANO)



    //   let MES = result.data.string.substr(5, 2);
    //   // console.log(MES)


    //   let DIA = result.data.string.substr(8, 2);
    //   //  console.log(DIA)

    //   //  console.log(DIA + "/" + MES + "/" + ANO)
    //   this.dadosVisita.dataProximaVisita = DIA + "/" + MES + "/" + ANO

    // })

    // myCalendar.present();
  }

  validar() {

    if ((this.nomeCliente == null) || (StringUtils.isEmpty(this.nomeCliente.trim()))) {
      alert('Nome não informado!');
      this.loaderService.hideLoader();
      return false;
    }

    if ((this.dadosVisita.obs == null) || (StringUtils.isEmpty(this.dadosVisita.obs.trim()))) {
      alert('obs não informado!');
      this.loaderService.hideLoader();
      return false;
    }
    return true;
  }

  async gravarVisita() {

    this.getLocation();
    this.checkGpsStatus();
/*  if (this.acaoVisita == 'I') {
      await this.getGeolocalizacao();
    }

   /* this.dadosVisita.filial = { id: this.pedidoService.objConfiguracao.filial.id }
    this.dadosVisita.vendedor = { id: this.pedidoService.vendedorObj.id }
    this.dadosVisita.obs = this.dadosVisita.obs.toUpperCase();

    if (this.dadosVisita.dataProximaVisita != undefined) {
      this.dadosVisita.dataProximaVisita = StringUtils.DateFormatadaInsert(this.dadosVisita.dataProximaVisita);

    }

    console.log(JSON.stringify(this.dadosVisita));

    await this.gravaVisita();*/

  }

  async gravaVisita() {
    if (this.acaoVisita == 'I') {
      //this.checkLocationPermission();
      this.loaderService.showLoader("Gravando Visita...");
    } else {
      this.loaderService.showLoader("Alterando Visita...");
    }

    if (!this.validar()) {
      this.loaderService.hideLoader();
      return;
    }

    this.dadosVisita.atributoPadrao = new Object();
    this.dadosVisita.atributoPadrao.idUsuario = this.usuarioLogado.authUser.id;
    this.dadosVisita.atributoPadrao.nomeUsuario = this.usuarioLogado.authUser.nome;
    this.dadosVisita.atributoPadrao.dataRegistro = new Date();

    let res
    try {


      if (this.acaoVisita == 'I') {
        let url = '/visita';
        this.dadosVisita.atributoPadrao.dominioEvento = '1';
        res = await this.http.post(url, this.dadosVisita);
      } else {
        let url = '/visita/alterar';
        this.dadosVisita.atributoPadrao.dominioEvento = '2';
        res = await this.http.post(url, this.dadosVisita);

      }


      if (res.message != undefined) {
        this.loaderService.hideLoader();
        this.addErroException(JSON.stringify(res.message));
      } else {
        this.loaderService.hideLoader();
        this.addSucess("Cadastrado com Sucesso! ", "Visita ");
        this.irListaVisita();
      }


    } catch (e) {
      this.loaderService.hideLoader();
      this.addErroException(e);

    }


    return Promise.resolve();
    this.loaderService.hideLoader();
  }


  //Verifique se o aplicativo tem permissão de acesso GPS 
  // async checkGPSPermission() {
  //   await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
  //     async result => {
  //       if (result.hasPermission) {
  //         //Se tiver permissão, mostre a caixa de diálogo 'Ligar GPS'
  //         await this.askToTurnOnGPS();
  //       } else {
  //         //Se não tiver permissão, peça permissão
  //         await this.requestGPSPermission();
  //       }
  //     },
  //     err => {
  //       alert(err);
  //     }
  //   );
  // }

  // async requestGPSPermission() {
  //   await this.locationAccuracy.canRequest().then((canRequest: boolean) => {
  //     if (canRequest) {
  //       console.log("4");
  //     } else {
  //       //Show 'GPS Permission Request' dialogue
  //       this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
  //         .then(
  //           async () => {
  //             // call method to turn on GPS
  //             await this.askToTurnOnGPS();
  //           },
  //           error => {
  //             //Show alert if user click on 'No Thanks'
  //             alert('requestPermission Error requesting location permissions ' + error);
  //             return;
  //           }
  //         );
  //     }
  //   });
  // }

  // async askToTurnOnGPS() {
  //   await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
  //     async () => {
  //       // When GPS Turned ON call method to get Accurate location coordinates
  //       await this.getGeolocalizacao();
  //     },
  //     error => {
  //       alert('Error requesting location permissions ' + JSON.stringify(error));
  //       return;
  //     }
  //   );
  // }



}
