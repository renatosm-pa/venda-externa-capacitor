import { Component, HostListener, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController, Platform } from "@ionic/angular";
import { Router } from "@angular/router";
import { Credentials } from "../../seguranca/credentials";
import { AuthenticatedUser } from "../../seguranca/authenticated-user";
import { PermissaoSistema } from "../../seguranca/permissao-sistema";
import { PagePadrao } from "../../utils/page-padrao";
import { ConfiguracaoService } from "../../services/configuracao.service";
import { map } from "rxjs/operators";
import { UsuarioLogadoService } from "../../services/usuario-logado.service";
import { LoadingController } from '@ionic/angular';
import { LoaderService } from "../../services/loader.service";
import { LoginService } from './login.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { firstValueFrom, fromEvent, Subscription } from 'rxjs';
import { Device } from '@capacitor/device';
import { FiltroParametro } from 'src/app/utils/filtro-parametro';
import { async } from 'rxjs/internal/scheduler/async';
import { ResultadoCredencial } from 'src/app/services/resultado-credencial';
import { HttpUtilService } from 'src/app/services/http-util.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})

export class LoginPage extends PagePadrao implements OnInit {
    credentials = new Credentials();
    dadosconfig: any = {};
    private userRoles: string[] = [];
    private userSystems: string[] = [];
    private configuration: string[] = [];
    private editForm = false;
    //public empresaPermissao: Map<Number, PermissaoSistema> = new Map();
    public empresaPermissao: any = {};
    private respConfirm: boolean;
    public salva_senha: boolean;
    listaFilial: any = {};
    showPassword = false;
    passwordToggleIcon = 'eye';
    passwordToggleIconUser = 'user';
    public existe_device: any = {};
    public projeto_device: any;
    public versionCode: any;
    filtroParametro: FiltroParametro = new FiltroParametro();
    private backbuttonSubscription: Subscription;
    cliente_sinterbit: any;
    cnpj: any;
    filtroCliente: any;
    dadosdispositivo: any = {};
    quantidadeDispositivoRegistros: any;
    nome: any;
    dominio_servidor: any;

    text: any;
    index: any;


    // toggle_theme : boolean;
    constructor(
        public menuCtrl: MenuController,
        private router: Router,
        private http: HttpUtilService,
        private httpCliente: HttpClient,
        alertController: AlertController,
        private configuracaoService: ConfiguracaoService,
        private usuarioLogado: UsuarioLogadoService,
        public loaderService: LoaderService,
        public loginService: LoginService,
        public pedidoService: PedidoService,
        private modalCtrl: ModalController


    ) {
        super(alertController);
        this.menuCtrl.enable(false);

    }


    async ngOnInit() {
        await this.gerarChave();
        this.configuracaoService.verifyDarkTheme();
        // this.dominio_servidor = "jardimconstrucao.sinterbit.com.br";
        if (Capacitor.isNativePlatform()) {
            await App.getInfo().then((value) => {
                this.versionCode = value.version;

            });
        } else {
            alert('outro sistema')
            console.log();
        }

        this.pedidoService.objConfiguracao = this.configuracaoService.getConfigueData();
        if (this.pedidoService.objConfiguracao != null) {
            this.text = this.pedidoService.objConfiguracao.ip;
            this.index = this.text.indexOf('.'); // Procura o índice do primeiro ponto encontrado
            this.dominio_servidor = this.pedidoService.objConfiguracao.ip.substring(0, this.index);
            this.cnpj = this.pedidoService.objConfiguracao.cnpj;
            this.nome = this.pedidoService.objConfiguracao.nome;
        }


        this.credentials.password = localStorage.getItem('Senha');
        this.credentials.login = localStorage.getItem('Login');
        this.salva_senha = true;

        const event = fromEvent(document, 'backbutton');
        this.backbuttonSubscription = event.subscribe(async () => {
            const modal = await this.modalCtrl.getTop();
            if (modal) {
                modal.dismiss();
            }
        });

        // this.login();
    }

    async ionViewDidEnter() {
        this.pedidoService.objConfiguracao = this.configuracaoService.getConfigueData();
        if (this.pedidoService.objConfiguracao != null) {
            this.text = this.pedidoService.objConfiguracao.ip;
            this.index = this.text.indexOf('.'); // Procura o índice do primeiro ponto encontrado
            this.dominio_servidor = this.pedidoService.objConfiguracao.ip.substring(0, this.index);
            this.cnpj = this.pedidoService.objConfiguracao.cnpj;

            if (Capacitor.isNativePlatform()) {
                await App.getInfo().then((value) => {
                    this.versionCode = value.build;
                    // alert(this.versionCode)
                });
            } else {
                alert('outro sistema')
                console.log();
            }



            this.projeto_device = new Object();
            this.existe_device = new Array();
            this.listaFilial = new Array();

            await this.configuracaoService.setConfigueData(this.dominio_servidor + '.sinterbit.com.br', { id: 1 }, true, "tema-laranja", "", "", true, this.cnpj, this.nome);
            await this.buscaParametroSistema();
            await this.gerarChave();
            await this.BuscarVersaoProjeto();
            if (this.projeto_device.versao != undefined) {
                if (this.versionCode < this.projeto_device.versao) {
                    // Open the Google Play Store
                    Browser.open({
                        url: 'https://play.google.com/store/apps/details?id=interagese.vendas.externas',
                    });
                    alert("Atualize seu aplicativo!");
                } else {
                    await this.gerarChave();
                    await this.BuscaDevice();
                }
            } else {
                alert("erro");
            }
        } else {
            await this.gerarChave();
        }


    }

    async cadastraDominio() {
        if ((this.dominio_servidor == null) || (this.dominio_servidor == "")) {

            alert('DomÍnio não informado!');
            this.loaderService.hideLoader();
            return false;
        } else {
            this.configuracaoService.setConfigueData(this.dominio_servidor + '.sinterbit.com.br', { id: 1 }, true, "tema-laranja", "", "", true, this.cnpj, this.nome);
            await this.buscaParametroSistema();
        }

    }

    async cadastraDispositivo() {

        if (!this.validar()) {
            this.loaderService.hideLoader();
            return;
        }


        await this.cadastraDominio();
        await this.getQtdDispositivoPermitido();
        await this.getQuantidadeDispositivos();

        if (this.cliente_sinterbit != null) {
            if (this.quantidadeDispositivoRegistros >= this.cliente_sinterbit.quantidadeDispositivo) {
                alert('Só é permitido no máximo ' + this.cliente_sinterbit.quantidadeDispositivo + ' Dispositivos !');
                return;
            } else {
                await this.BuscaDevice();
                if (this.existe_device.caminho != undefined) {

                } else {
                    await this.gravaDispositivoCliente();
                    await this.VerificarVersao();
                }

            }
        } else {
            alert('CNPJ não encontrado! ');
        }


    }

    async getQuantidadeDispositivos() {
        //this.cnpj = "97.446.531/0001-44";
        this.filtroParametro.clear();
        this.filtroParametro.addItem('documento', this.cnpj);
        this.quantidadeDispositivoRegistros = await this.http.postGeral(this.loginService.dominio_servidor_conf + '/api-adm/dispositivo/countPost/', this.filtroParametro);
        //this.quantidadeDispositivoRegistros = await this.http.postGeral('srv01.sinterbit.com.br/api-adm/dispositivo/countPost/', this.filtroParametro);
        //this.quantidadeDispositivoRegistros = await this.http.postGeral('sinterbit.com.br:7084/api/dispositivo/countPost/', this.filtroParametro);
        //alert("quantidade Dispositivo Cadastrados : " + this.quantidadeDispositivoRegistros);
    }

    async getQtdDispositivoPermitido() {
        //this.cnpj = "97.446.531/0001-44";
        this.filtroParametro.clear();
        this.filtroParametro.addItem('documento', this.cnpj);
        this.cliente_sinterbit = await this.http.postGeral(this.loginService.dominio_servidor_conf + '/api-adm/clientes/documento/', this.filtroParametro);
        //this.cliente_sinterbit = await this.http.postGeral('srv01.sinterbit.com.br/api-adm/clientes/documento/', this.filtroParametro);
        //this.cliente_sinterbit = await this.http.postGeral('sinterbit.com.br:7084/api/clientes/documento/', this.filtroParametro);
        //alert("quantidade Dispositivo permitido : " + this.cliente_sinterbit.quantidadeDispositivo);
        return Promise.resolve();
    }

    mascara(t, mask) {
        //alert(t.length)


        var i = t.length;
        var saida = mask.substring(1, 0);
        var texto = mask.substring(i)
        if (texto.substring(0, 1) != saida) {
            t += texto.substring(0, 1);
        }

        return t
    }

    validar() {

        if ((this.cnpj == null) || (this.cnpj == "")) {

            alert('Cnpj não informado!');
            this.loaderService.hideLoader();
            return false;
        }


        if ((this.nome == null) || (this.nome == "")) {

            alert('Nome não informado!');
            this.loaderService.hideLoader();
            return false;
        }

        if ((this.pedidoService.chaveDispositivo == null) || (this.pedidoService.chaveDispositivo == "")) {
            alert('cpf/Cnpj não informado!');
            this.loaderService.hideLoader();
            return false;
        }
        return true;
    }

    async gravaDispositivoCliente() {

        if (!this.validar()) {
            this.loaderService.hideLoader();
            return;
        }

        await this.cadastraDominio();
        this.loaderService.showLoader("Gravando Cliente...");
        this.dadosdispositivo.atributoPadrao = new Object();
        this.dadosdispositivo.atributoPadrao.idUsuario = 1;
        this.dadosdispositivo.atributoPadrao.nomeUsuario = 'admin';
        this.dadosdispositivo.atributoPadrao.dataRegistro = new Date();
        this.dadosdispositivo.atributoPadrao.dominioEvento = '1';
        this.dadosdispositivo.cliente = { cnpjCpf: this.cnpj };
        this.dadosdispositivo.descricao = this.nome.toUpperCase();
        this.dadosdispositivo.chave = this.pedidoService.chaveDispositivo.toUpperCase();


        let res
        try {
            //let url = 'sinterbit.com.br:7084/api/dispositivo';
            //let url = 'srv01.sinterbit.com.br/api-adm/dispositivo';
            let url = this.loginService.dominio_servidor_conf + '/api-adm/dispositivo';
            res = await this.http.postGeral(url, this.dadosdispositivo);

            if (res.message != undefined) {
                this.loaderService.hideLoader();
                this.addErroException(JSON.stringify(res.message));
            } else {
                this.loaderService.hideLoader();
                this.addSucess("Cadastrado com Sucesso! ", "Dispositivo do Cliente ");
                this.loaderService.hideLoader();
            }


        } catch (e) {
            this.loaderService.hideLoader();
            this.addErroException(e);

        }

        this.loaderService.hideLoader();
        return Promise.resolve();

    }

    async VerificarVersao() {
        if (Capacitor.isNativePlatform()) {
            App.getInfo().then((value) => {
                this.versionCode = value.build;
            });
        }
        await this.BuscarVersaoProjeto();
        if (this.projeto_device.versao != undefined) {
            if (this.versionCode < this.projeto_device.versao) {
                alert("Atualize seu aplicativo!");
                Browser.open({
                    url: 'https://play.google.com/store/apps/details?id=interagese.vendas.externas',
                });
            } else {
                await this.gerarChave();
                await this.BuscaDevice();
            }
        } else {
            alert("erro");
        }
    }

    async buscaParametroSistema() {
        this.loginService.dominio_servidor_conf = await this.http.get('/parametro-sistema/dominio-adm-api/DOMINIO_SERVIDOR');
        //alert('dominio_servidor_conf: '+JSON.stringify(this.loginService.dominio_servidor_conf))        
        console.log(this.loginService.dominio_servidor_conf);
    }

    async BuscaDevice() {
        try {
            await this.gerarChave();
            this.pedidoService.objConfiguracao = this.configuracaoService.getConfigueData();
            this.existe_device = await this.http.postGeral(this.loginService.dominio_servidor_conf + '/api-adm/dispositivo/caminho-servidor/', this.pedidoService.chaveDispositivo);
            //this.existe_device = await this.http.postGeral('srv01.sinterbit.com.br/api-adm/dispositivo/caminho-servidor/', this.pedidoService.chaveDispositivo);
            //this.existe_device = await this.http.postGeral('sinterbit.com.br:7084/api/dispositivo/caminho-servidor/', this.pedidoService.chaveDispositivo);
            //this.existe_device.caminho = "192.168.91.85"; 

            this.loaderService.hideLoader();
            if (this.existe_device.caminho != undefined) {
                if (this.pedidoService.objConfiguracao == null) {
                    this.configuracaoService.setConfigueData(this.existe_device.caminho, { id: 1 }, true, "tema-laranja", "", "", true, this.cnpj, this.nome);
                } else {
                    this.configuracaoService.setConfigueData(this.existe_device.caminho, { id: 1 }, true, "tema-laranja",
                        this.pedidoService.objConfiguracao.macImpressora, this.pedidoService.objConfiguracao.colunasImpressao, this.pedidoService.objConfiguracao.estoque, this.cnpj, this.nome);
                }
            } else {
                alert("Dispositivo não cadastrado!");
                return;
            }

        } catch (e) {
            this.addErro(e);
            alert("Erro Dispositivo não cadastrado!" + e);
            this.existe_device.caminho = undefined;
            this.loaderService.hideLoader();
        }
    }

    async BuscarVersaoProjeto() {
        try {
            //alert(this.loginService.dominio_servidor_conf);            
            this.projeto_device = await this.http.postGeral(this.loginService.dominio_servidor_conf + '/api-adm/versao-dispositivo/versao/', "VENDA_EXTERNA");
            //this.projeto_device = await this.http.postGeral('srv01.sinterbit.com.br/api-adm/versao-dispositivo/versao/', "VENDA_EXTERNA");
            //this.projeto_device = await this.http.postGeral('sinterbit.com.br:7084/api/versao-dispositivo/versao/', "VENDA_EXTERNA");
            //alert(JSON.stringify(this.projeto_device));
            this.loaderService.hideLoader();
        } catch (e) {
            alert(e)
            this.loaderService.hideLoader();
            this.addErro(e);
        }
    }

    async gerarChave() {
        // this.pedidoService.chaveDispositivo = this.device.uuid;

        const deviceInfo: any = await Device.getInfo();
        console.log('Device Info:', deviceInfo);

        const deviceInfoId: any = await Device.getId();
        console.log('Device deviceInfoId:', deviceInfoId);

        this.pedidoService.chaveDispositivo = deviceInfoId.identifier;
        //alert('chave' + JSON.stringify(this.pedidoService.chaveDispositivo));
    }

    ngOnDestroy() {
        this.backbuttonSubscription.unsubscribe();
    }

    avancar() {
        this.router.navigate(['/pedido']);
    }

    configuracao() {
        console.log("/configuracao");
        this.router.navigate(['configuracao']);
    }

    sairApk() {
        navigator['app'].exitApp();
    }

    async login() {

        this.pedidoService.objConfiguracao = this.configuracaoService.getConfigueData();

        // if (this.pedidoService.objConfiguracao.filial.id == undefined) {
        //this.loaderService.hideLoader();
        //this.addWarning("Filial não informado!");
        //this.configuracao();
        //return
        // }

        this.loaderService.showLoader("Fazendo Login...");

        if (this.credentials.login == undefined) {
            this.loaderService.hideLoader();
            this.addWarning("Login não informado!");
            return
        }

        if (this.credentials.password == undefined) {
            this.loaderService.hideLoader();
            this.addWarning("Senha não informada!");
            return
        }

        localStorage.setItem('Login', this.credentials.login);
        localStorage.setItem('Senha', this.credentials.password);

        if (this.salva_senha == true) {
            localStorage.setItem('grava', 'sim');
            localStorage.setItem('Login', this.credentials.login);
            localStorage.setItem('Senha', this.credentials.password);
        } else {
            localStorage.setItem('grava', 'nao');
            localStorage.setItem('Login', '');
            localStorage.setItem('Senha', '');
        }

        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Basic ' + this.credentials.exportCredentialsAsBase64());
        let url = '/security/login';

        try {
            let res: any = await firstValueFrom(this.httpCliente.post(this.http.getURLBase() + url, null, { headers, observe: 'response' }   ));

            // let res: any = await this.httpCliente.post(this.http.getURLBase() + url, null, { headers, observe: 'response' }   ).subscribe((res: any) => {
            //     console.log(res);
            //     console.log(res.headers)
            // });
            //alert(JSON.stringify(res));
            //console.log(JSON.stringify(res));  
            // let res = await this.http.post(url, {}, headers, 'response');

            const header = res.headers;
            if (header != null && header != undefined && header.get('Authorization') != undefined) {

                const jwt: string = res.headers.get('Authorization');
                this.usuarioLogado.authUser = new AuthenticatedUser(jwt);
                // alert("authUser: "+JSON.stringify(this.usuarioLogado.authUser));
                this.userRoles = this.usuarioLogado.authUser.roles;
                //alert(JSON.stringify("userRoles: " + this.userRoles));
                this.userSystems = this.usuarioLogado.authUser.systems;
                //alert(JSON.stringify("userSystems: " + this.userSystems));
                this.configuration = this.usuarioLogado.authUser.configuration;
                //alert("" + JSON.stringify(this.configuration));

                this.loginService.buscaVendedorUsuario(this.usuarioLogado.authUser.id);
                await this.getPermissoes();
                this.loaderService.hideLoader();

                if (this.pedidoService.vendedorObj.filial == undefined) {
                    await this.carregarFilial();
                    if (this.listaFilial.length == 1) {
                        this.pedidoService.filialSelecionada = this.listaFilial[0];
                        //alert(this.pedidoService.filialSelecionada.nomeFantasia);
                        // alert(this.pedidoService.filialSelecionada.empresa?.endereco.endereco);
                        this.loaderService.hideLoader();
                        console.log("fil: " + this.listaFilial[0])
                        this.configuracaoService.setConfigueData(this.pedidoService.objConfiguracao.ip, this.listaFilial[0], true, this.pedidoService.objConfiguracao.cor,
                            this.pedidoService.objConfiguracao.macImpressora, this.pedidoService.objConfiguracao.colunasImpressao, this.pedidoService.objConfiguracao.estoque, this.cnpj, this.nome);
                        this.router.navigate(['/acesso-rapido']);//lista-pedido
                    } else {
                        this.loaderService.hideLoader();
                        this.router.navigate(['/lista-filial']);
                    }
                } else {
                    this.loaderService.hideLoader();
                    this.pedidoService.filialSelecionada = this.pedidoService.vendedorObj.filial;
                    this.configuracaoService.setConfigueData(this.pedidoService.objConfiguracao.ip, this.pedidoService.vendedorObj.filial, true, this.pedidoService.objConfiguracao.cor,
                        this.pedidoService.objConfiguracao.macImpressora, this.pedidoService.objConfiguracao.colunasImpressao, this.pedidoService.objConfiguracao.estoque, this.cnpj, this.nome);
                    this.router.navigate(['/acesso-rapido']);//acesso-rapido
                }

            } else {
                this.loaderService.hideLoader();
                this.router.navigate(['/login']);
            }

        } catch (e) {
            this.loaderService.hideLoader();
            //
            if (e.error.message == "Authentication Failed: Bad credentials") {
                this.addErroException("Usuario Não Cadastrado!");
            } else {
                this.addErroException(e.error.message);
            }
            console.log('message: ' + e.error);
        }
        return Promise.resolve();

    }

    async carregarFilial() {
        this.listaFilial = new Array();
        //  alert(this.listaFilial)
        this.listaFilial = await this.http.get('/filiais');
        // alert(JSON.stringify(this.listaFilial) );
    }

    async getPermissoes() {

      //alert(this.getAuthenticatedUser().id);
      this.empresaPermissao =  await this.http.get(`/usuarios/perfil/${this.getAuthenticatedUser().id}`);
      //alert(JSON.stringify(this.getAuthenticatedUser().id));
      //let bodi = this.empresaPermissao[0].permissoes;
      //this.getAuthenticatedUser().permissaoSistema[0] = this.empresaPermissao[0].permissoes;
      const {idEmpresa, permissoes} = this.empresaPermissao[0];


      this.usuarioLogado.authUser.permissaoSistema    = permissoes;//this.empresaPermissao[0].permissoes;
      this.usuarioLogado.authUser.permissaoSistema.idEmpresa = idEmpresa;// this.empresaPermissao[0].idEmpresa
      
      // alert("id da empresaPermissao: " + JSON.stringify(this.getAuthenticatedUser().permissaoSistema));
      return true;

      //  return firstValueFrom(await this.http.get(`/usuarios/perfil/${this.getAuthenticatedUser().id}`));
        // return this.http
        //     .get(`/usuarios/perfil/${this.getAuthenticatedUser().id}`)
        //     .pipe(
        //         map(res => {
                    //Pega a primeira permissão
                    // this.empresaPermissao = res;
                    // //  alert(JSON.stringify(this.getAuthenticatedUser().id));
                    // this.getAuthenticatedUser().permissaoSistema = this.empresaPermissao[0];
                    // //  alert("id da empresaPermissao: " + JSON.stringify(this.getAuthenticatedUser().permissaoSistema.idEmpresa));
                    // return true;
        //         })
        //     );
    }

    getAuthenticatedUser(): AuthenticatedUser {
        return this.usuarioLogado.authUser;
    }

    togglePassword(): void {
        this.showPassword = !this.showPassword;

        if (this.passwordToggleIcon == 'eye') {
            this.passwordToggleIcon = 'eye-slash';
        } else {
            this.passwordToggleIcon = 'eye';
        }
    }


}
