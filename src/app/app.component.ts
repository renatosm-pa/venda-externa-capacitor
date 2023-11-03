import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ConfiguracaoService } from './services/configuracao.service';
import { PedidoService } from './services/pedido.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public selectedIndex: any;
  public appPages = [
    {
      title: 'Login',
      url: './login',
      icon: 'lock-open'
    },
    {
      title: 'Acesso Rápido',
      url: './acesso-rapido',
      icon: 'grid'
    },
    {
      title: 'Lista de Pedidos',
      url: './lista-pedido',
      icon: 'albums'
    },
    {
      title: 'Lista de Cliente',
      url: './cliente',
      icon: 'people'
    },
    {
      title: 'Cadastro Cliente',
      url: './cadastro-cliente',
      icon: 'person-add'
    },
    {
      title: 'Catálogo de Produto',
      url: './catalogo-produto',
      icon: 'file-tray-full'
    },
    {
      title: 'Grafico',
      url: './grafico-vendas',
      icon: 'pie-chart'
    },
    {
      title: 'Busca Preço',
      url: './busca-preco',
      icon: 'barcode'
    },
    {
      title: 'Inventário',
      url: './inventario',
      icon: 'scan'
    },
    {
      title: 'Agenda Visita',
      url: './lista-visita',
      icon: 'calendar'
    },
    {
      title: 'Configuração',
      url: './configuracao',
      icon: 'cog'
    },
    {
      title: 'Falteiro',
      url: './itens-falta',
      icon: 'barcode'
    }



  ];
  constructor(
    private platform: Platform,
    private configuracaoService: ConfiguracaoService,
    public pedidoService: PedidoService,
    public router: Router,
  ) {

    platform.backButton.subscribeWithPriority(999, () => {

    })
    platform.backButton.subscribe(() => {
      if (router.url == "/lista-produto") {       
        router.navigate(["/pedido"])
      }   
      
      if (router.url == "/lista-visita") {       
        router.navigate(["/acesso-rapido"])
      }

      if (router.url == "/catalogo-produto") {       
        router.navigate(["/acesso-rapido"])
      }

      if (router.url == "/busca-preco") {       
        router.navigate(["/acesso-rapido"])
      }

      if (router.url == "/inventario") {       
        router.navigate(["/acesso-rapido"])
      }

      if (router.url == "/tabs/tab1") {
        router.navigate(["/pedido"])
      }

      if (router.url == "/tabs/tab2") {
        router.navigate(["/tabs/tab1"])
      }

      if (router.url == "/grafico-vendas") {
        router.navigate(["/acesso-rapido"])
      }

      if (router.url == "/lista-pedido") {
        router.navigate(["/acesso-rapido"])
      }

      if (router.url == "/pedido") {
        router.navigate(["/lista-pedido"])
      }

      if (router.url == "/cadastro-cliente") {
        router.navigate(["/acesso-rapido"])
      }

      if (router.url == "/lista-cliente") {
        router.navigate(["/acesso-rapido"])
      }

      if (router.url == "/acesso-rapido") {
        router.navigate(["/login"])
      }

     
    })
    this.initializeApp();
  }


  initializeApp() {

  }

  ngOnInit() {
    //this.pedidoService.objConfiguracao = this.configuracaoService.getConfigueData();
    //document.getElementById("body").setAttribute('class', this.pedidoService.objConfiguracao.cor);

    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
