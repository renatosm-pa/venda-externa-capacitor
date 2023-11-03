import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
// import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AlertController, MenuController, ModalController, NavController, ToastController } from '@ionic/angular';
// import { PedidoListPage } from '../page/lista-pedido/lista-pedido.page';
import { ConfiguracaoService } from './configuracao.service';
import { HttpUtilService } from './http-util.service';
import { LoaderService } from './loader.service';
import { UsuarioLogadoService } from './usuario-logado.service';

@Injectable({
    providedIn: 'root'
})
export class ItemPedidoService {



    constructor(public menuCtrl: MenuController,
        private router: Router,
        private http: HttpUtilService,
        alertController: AlertController,
        private usuarioLogado: UsuarioLogadoService,
        private navCtrl: NavController,
        public loaderService: LoaderService,
        private ngZone: NgZone,
        private configuracaoService: ConfiguracaoService,
        // private keyboard: Keyboard,
        public toastController: ToastController,
        public modalController: ModalController,
        // public pedidoListPage:PedidoListPage
        ) {
    }


    consultarPedido() {
     //   this.pedidoListPage.consultar();
    }




}
