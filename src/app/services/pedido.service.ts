import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
// import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AlertController, MenuController, ModalController, NavController, ToastController } from '@ionic/angular';
import { ConfiguracaoService } from './configuracao.service';
import { HttpUtilService } from './http-util.service';
import { ItemPedidoService } from './item-pedido.service';
import { LoaderService } from './loader.service';
import { UsuarioLogadoService } from './usuario-logado.service';

@Injectable({
    providedIn: 'root'
})
export class PedidoService {
    public entradaConsulta: any;
    public entradaConsultaPrdoduto: any;
    public entradaConsultaVisita: any;
    public dadosVisita: any = {};
    public dadosPedido: any = {};
    public dadosFalteiro: any = {};
    public acao_inserir_falteiro: boolean = true;
    public nomeCliente: string = '1';
    public objConfiguracao: any;
    public objPedidoOFF: any;
    public produtoSelecionado: any;
    public listaProdutopesq: any;
    public unidade_nome: any;
    public estoque_id: any;
    public acao_inserir: boolean = true;
    public acao_inserir_item: boolean = true;
    public valorTotalPedido: any;
    public percentualAcrescimoDesconto: any = 0;
    public listaPlanoPagamentoFilial: any;
    public quantidadeVendida: any;
    public percvalorDescontoAcrescimoItem: any;
    public valorDescontoAcrescimoItem: any;
    public valorDesconto: any;
    public tipoDescontoAcrescimoItem: any;
    public precoItem: any;
    public indexItem: any;
    public codItem: any;
    public filialSaidaEstoque: any;
    public qtdItens: any;
    public  filial_id: any;
    public plano_id: any= "1";
    public forma_id: any;
    public profissional_id: any;
    public grupo_id: any;
    public fabricante_id: any;
    public produto_id: any;
    public vendedorObj: any;
    public dataEmissao: any;
    public planoPagamento: any;
    public listaProfissional: any;
    public chaveDispositivo: any;
    public chaveDispositivo2: any;
    public estado_id: any = {};
    public cidade_id: any = {};
    public listarProduto: boolean = false;
    public filialSelecionada: any = {};
    public produto_falteiro: boolean = false;
    public dataEmissaoIncio: any;
    public dataEmissaoFim: any;


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
        public modalController: ModalController
        ) {
    }


    finalizarPedido() {
        this.router.navigate(['/tabs']);
    }


    valorProdutoDescontoPlanoFilial(valorProduto) {

        if(this.percentualAcrescimoDesconto != ""){
            let valorDesc= 0;
            valorDesc = (valorProduto * (this.percentualAcrescimoDesconto / 100));
            return valorProduto + valorDesc;
        }else{
            return valorProduto;
        }

    }


    async existePermissao(idPermissao: any): Promise<boolean> {
        let res;

        try {
            let url = '/usuariopermissoes/existe-permissao/' + this.usuarioLogado.authUser.permissaoSistema.idEmpresa
            + '/'+idPermissao+  '/'    + this.usuarioLogado.authUser.id;
            console.log("url: " + url);
            res = await this.http.get(url);
            alert("existePermissao: " + res);
        } catch (e) {
            console.log("erro: " + e.error.message);
            //this.addErroException(e.error.message);
        }

        return Promise.resolve(res);
    }
}
