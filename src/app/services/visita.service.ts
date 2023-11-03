import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, ModalController, NavController, ToastController } from '@ionic/angular';
import { ConfiguracaoService } from './configuracao.service';
import { HttpUtilService } from './http-util.service';
import { ItemPedidoService } from './item-pedido.service';
import { LoaderService } from './loader.service';
import { UsuarioLogadoService } from './usuario-logado.service';

@Injectable({
    providedIn: 'root'
})
export class VisitaService {
  
    public entradaConsultaVisita: any = {} ;
    
  

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
        public modalController: ModalController
        ) {
    }


    finalizarPedido() {
        this.router.navigate(['/tabs']);
    }


 
}
