import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, ModalController, NavController, Platform, PopoverController } from '@ionic/angular';
import { ConfiguracaoService } from 'src/app/services/configuracao.service';
import { HttpUtilService } from 'src/app/services/http-util.service';
import { LoaderService } from 'src/app/services/loader.service';
import { PdfService } from 'src/app/services/pdf.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { UsuarioLogadoService } from 'src/app/services/usuario-logado.service';
import { PagePadrao } from 'src/app/utils/page-padrao';
// import EscPosEncoder from 'esc-pos-encoder-ionic';
@Component({
  selector: 'app-acesso-rapido',
  templateUrl: './acesso-rapido.page.html',
  styleUrls: ['./acesso-rapido.page.scss'],
})
export class AcessoRapidoPage extends PagePadrao implements OnInit {

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
    public modalCtrl: ModalController,
    private menu: MenuController,
    private popoverCtrl: PopoverController,
    

  ) {
    super(alertController);
    this.menuCtrl.enable(true);

  }

  async ionViewWillEnter() {
    this.pedidoService.objConfiguracao = this.configuracaoService.getConfigueData();
    
  }

  ngOnInit() {
    this.pedidoService.objConfiguracao = this.configuracaoService.getConfigueData();
    //alert(this.pedidoService.objConfiguracao.filial.nomeFantasia)
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
    
  }


  irListaPedido() {
    this.router.navigate(['/lista-pedido']);
  }

  irPedido() {
    this.pedidoService.acao_inserir = true;
    this.pedidoService.dadosPedido = new Object();
    this.pedidoService.dadosPedido.endereco = new Object();
    this.pedidoService.dadosPedido.listaPedidoItem = new Array();
    this.pedidoService.nomeCliente = "";
    this.router.navigate(['/pedido']);

  }

  irListaCliente() {
    this.router.navigate(['/cliente']);
  }

  irCadastroCliente() {
    this.router.navigate(['/cadastro-cliente']);
  }

  irProduto() {
    this.router.navigate(['/catalogo-produto']);
  }

  irGraficoVendas() {
    this.router.navigate(['/grafico-vendas']);
  }


  irBuscaPreco() {
    this.router.navigate(['/busca-preco']);
  }

  irInventario() {
    this.router.navigate(['/inventario']);
  }


  irAgenda() {
    this.router.navigate(['/lista-visita']);
  }

  irConfiguracao() {
    this.router.navigate(['/configuracao']);
  }


}
