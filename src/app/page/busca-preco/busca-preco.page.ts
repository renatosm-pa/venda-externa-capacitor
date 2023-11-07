import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, MenuController, NavController, ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Credentials } from "../../seguranca/credentials";
import { HttpUtilService } from "../../services/http-util.service";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { AuthenticatedUser } from "../../seguranca/authenticated-user";
import { PermissaoSistema } from "../../seguranca/permissao-sistema";
import { PagePadrao } from "../../utils/page-padrao";
import { Chart } from "chart.js";
import { ConfiguracaoService } from "../../services/configuracao.service";
import { StringUtils } from 'src/app/utils/string-utils';

import { UsuarioLogadoService } from 'src/app/services/usuario-logado.service';
import { LoaderService } from 'src/app/services/loader.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-busca-preco',
  templateUrl: './busca-preco.page.html',
  styleUrls: ['./busca-preco.page.scss'],
})
export class BuscaPrecoPage extends PagePadrao implements OnInit {
  public scannedData: any;
  encodedData: '';
  encodeData: any;
  quantidadeRegistros: any;
  posicaoInicial = 0;
  registrosPorPagina = 15;
  public listaProduto: any;
  automatico: boolean;
  entradaConsultaPrdoduto: any;

  constructor(
    public menuCtrl: MenuController,
    private router: Router,
    alertController: AlertController,
    private configuracaoService: ConfiguracaoService,
    private http: HttpUtilService,
    public toastController: ToastController,
    private barcodeScanner: BarcodeScanner,
    private usuarioLogado: UsuarioLogadoService,
    private navCtrl: NavController,
    public loaderService: LoaderService,
    public pedidoService: PedidoService,

  ) {
    super(alertController);
    this.menuCtrl.enable(true);
  }



  async ngOnInit() {


  }

  async ionViewDidEnter() {

  }



  irListaPedido() {
    this.router.navigate(['/lista-pedido']);
  }

  goToBarcodeScan() {
    
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Place a barcode inside the scan area',
      resultDisplayDuration: 500,
      formats: 'QR_CODE , DATA_MATRIX , UPC_E,UPC_A,EAN_8,EAN_13,CODE_128,CODE_39,CODE_93,CODABAR,ITF,RSS14,RSS_EXPANDED,PDF_417,AZTEC,MSI',
      orientation: 'portrait',
    };



    this.barcodeScanner.scan(options).then(barcodeData => {

      this.scannedData = barcodeData.text;

      if(this.scannedData != ""){
        this.consultarProduto(this.scannedData);
      }
      

      //alert('Barcode data' + JSON.stringify(this.scannedData));
    }).catch(err => {
      console.log('Error', err);
    });
  }


  goToBarcodeScanManual() {
      if(this.scannedData != ""){
        this.consultarProduto(this.scannedData);
      }    
  }


  goToCreateCode() {
    this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, this.encodeData).then((encodedData) => {
      console.log(encodedData);
      this.encodedData = encodedData;
    }, (err) => {
      console.log('Error occured : ' + err);
    });
  }


  numberToReal(numero) {
    var numero = numero.toFixed(2).split('.');
    numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
  }


  async consultarProduto(EAN: any) {
    //alert('EAN: ' + EAN);
    try {
      this.entradaConsultaPrdoduto = new Array();
      this.entradaConsultaPrdoduto = {
        posicaoInicial: 0,
        quantidadeRegistros: this.registrosPorPagina,
        codFil: this.pedidoService.objConfiguracao.filial.id,
        codFab: "",
        codGrupo: "",
        codProduto: "",
        nomeProduto: "",
        codEan: EAN,
        estoque:"",
        valor:""
      };
      this.listaProduto = new Array();
      this.loaderService.showLoader("Buscando Produto...");
      this.listaProduto = await this.http.post('/estoque/busca-produto-filial', this.entradaConsultaPrdoduto);
      await this.loaderService.hideLoader();
      this.posicaoInicial += this.registrosPorPagina;
      console.log(JSON.stringify(this.listaProduto))
      if (this.listaProduto.length == 0) {
        await this.loaderService.hideLoader();
        await this.addWarning('Nenhum conteúdo encontrado');
      }


    } catch (e) {
      await this.loaderService.hideLoader();
      await this.addErro(e);

    }
  }





 

}
