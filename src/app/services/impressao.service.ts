import { Injectable, NgZone, OnInit } from '@angular/core';
import { ConfiguracaoService } from './configuracao.service';
import { DatePipe, formatNumber } from '@angular/common';
import { encode } from 'punycode';
import { __assign } from 'tslib';
import { HttpUtilService } from './http-util.service';
import { count } from 'rxjs/operators';
import { AlertController, MenuController, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PedidoService } from './pedido.service';
import { UsuarioLogadoService } from './usuario-logado.service';
import { LoaderService } from './loader.service';


@Injectable({
    providedIn: 'root',
})
export class Impressao {
    listaItens: any = [];
    constructor(
      //  private bs: BluetoothSerial,
        private http: HttpUtilService,
        private configuracaoService: ConfiguracaoService,
        public pedidoService: PedidoService,

        public menuCtrl: MenuController,
        private router: Router,
        alertController: AlertController,
        private usuarioLogado: UsuarioLogadoService,
        private navCtrl: NavController,
        public loaderService: LoaderService,
        private ngZone: NgZone,
        public toastController: ToastController,

        public modalController: ModalController,
        public platform: Platform

    ) {


    }


    comandos = {
        LF: [0x0a],
        ESC: [0x1b],
        FS: [0x1c],
        GS: [0x1d],
        US: [0x1f],
        FF: [0x0c],
        DLE: [0x10],
        DC1: [0x11],
        DC4: [0x14],
        EOT: [0x04],
        NUL: [0x00],
        //EOL: [\n],
        HORIZONTAL_LINE: {
            HR_58MM: '================================',
            HR2_58MM: '************'
        },
        FEED_CONTROL_SEQUENCES: {
            CTL_LF: [0x0a], // Print and line feed
            CTL_FF: [0x0c], // Form feed
            CTL_CR: [0x0d], // Carriage return
            CTL_HT: [0x09], // Horizontal tab
            CTL_VT: [0x0b], // Vertical tab
        },
        LINE_SPACING: {
            LS_DEFAULT: [0x1b, 0x32],
            LS_SET: [0x1b, 0x33]
        },
        HARDWARE: {
            HW_INIT: [0x1b, 0x40], // Clear data in buffer and reset modes
            HW_SELECT: [0x1b, 0x3d, 0x01], // Printer select
            HW_RESET: [0x1b, 0x3f, 0x0a, 0x00], // Reset printer hardware
        },
        CASH_DRAWER: {
            CD_KICK_2: [0x1b, 0x70, 0x00], // Sends a pulse to pin 2 []
            CD_KICK_5: [0x1b, 0x70, 0x01], // Sends a pulse to pin 5 []
        },
        MARGINS: {
            BOTTOM: [0x1b, 0x4f], // Fi0x bottom size
            LEFT: [0x1b, 0x6c], // Fi0x left size
            RIGHT: [0x1b, 0x51], // Fi0x right size
        },
        PAPER: {
            PAPER_FULL_CUT: [0x1d, 0x56, 0x00], // Full cut paper
            PAPER_PART_CUT: [0x1d, 0x56, 0x01], // Partial cut paper
            PAPER_CUT_A: [0x1d, 0x56, 0x41], // Partial cut paper
            PAPER_CUT_B: [0x1d, 0x56, 0x42], // Partial cut paper
        },
        TEXT_FORMAT: {
            TXT_NORMAL: [0x1b, 0x21, 0x00], // Normal text
            TXT_2HEIGHT: [0x1b, 0x21, 0x10], // Double height text
            TXT_2WIDTH: [0x1b, 0x21, 0x20], // Double width text
            TXT_4SQUARE: [0x1b, 0x21, 0x30], // Double width & height text
            TXT_CUSTOM_SIZE: function (width, height) { // other sizes
                var widthDec = (width - 1) * 16;
                var heightDec = height - 1;
                var sizeDec = widthDec + heightDec;
                return [0x1d, 0x21, String.fromCharCode(sizeDec)]
            },

            TXT_HEIGHT: {
                1: [0x00],
                2: [0x01],
                3: [0x02],
                4: [0x03],
                5: [0x04],
                6: [0x05],
                7: [0x06],
                8: [0x07]
            },
            TXT_WIDTH: {
                1: [0x00],
                2: [0x10],
                3: [0x20],
                4: [0x30],
                5: [0x40],
                6: [0x50],
                7: [0x60],
                8: [0x70]
            },

            TXT_UNDERL_OFF: [0x1b, 0x2d, 0x00], // Underline font OFF
            TXT_UNDERL_ON: [0x1b, 0x2d, 0x01], // Underline font 1-dot ON
            TXT_UNDERL2_ON: [0x1b, 0x2d, 0x02], // Underline font 2-dot ON
            TXT_BOLD_OFF: [0x1b, 0x45, 0x00], // Bold font OFF
            TXT_BOLD_ON: [0x1b, 0x45, 0x01], // Bold font ON
            TXT_ITALIC_OFF: [0x1b, 0x35], // Italic font ON
            TXT_ITALIC_ON: [0x1b, 0x34], // Italic font ON
            TXT_FONT_A: [0x1b, 0x4d, 0x00], // Font type A
            TXT_FONT_B: [0x1b, 0x4d, 0x01], // Font type B
            TXT_FONT_C: [0x1b, 0x4d, 0x02], // Font type C
            TXT_ALIGN_LT: [0x1b, 0x61, 0x00], // Left justification
            TXT_ALIGN_CT: [0x1b, 0x61, 0x01], // Centering
            TXT_ALIGN_RT: [0x1b, 0x61, 0x02], // Right justification
        }
    }

    stringToArray(bufferString) {
        let uint8Array = new TextEncoder().encode(bufferString);
        return uint8Array;
    }

    async imprimirPedidoAndroid(pedido) {
    //     this.pedidoService.objConfiguracao = await this.configuracaoService.getConfigueData();
    //    // console.log(pedido);
    //     return new Promise(async (resolve, reject) => {
    //         if (pedido != null && pedido != undefined) {

    //             try {

    //                 this.loaderService.showLoader("Imprimindo Pedido...");
                    
    //                 const colunas = this.pedidoService.objConfiguracao.colunasImpressao;

    //                 let texto = this.imprimirLinhaTracejada() + " \n " +
    //                     this.centralizar(this.pedidoService.filialSelecionada.nomeFantasia) + " \n "+
    //                     this.centralizar(""+this.pedidoService.filialSelecionada.enderecoFilial?.fone1) +" \n "+
    //                     this.centralizar(this.pedidoService.filialSelecionada.enderecoFilial?.endereco  +" Nr. "+
    //                                      this.pedidoService.filialSelecionada.enderecoFilial?.numero    +" - "+
    //                                      this.pedidoService.filialSelecionada.enderecoFilial?.bairro  ) +" \n ";
    //                 texto += this.imprimirLinhaTracejada() + " \n " +
    //                     "Pedido: " + pedido.id + " -  Emissao: " + this.DateFormatadaMostrar(pedido.dataEmissao) + " \n " +
    //                     "Cliente: " + pedido.cliente?.razaoSocial.substring(0, 35) + " \n " +
    //                     "Documento: " + pedido.cliente?.cpfCnpj + " \n " +
    //                     "Vendedor: " + pedido.vendedor?.nomeVendedor + " -  Plano: " + pedido.planoPagamento?.nome + " \n ";
    //                 texto += this.imprimirLinhaTracejada() + " \n ";
    //                 texto += this.centralizar("ITENS DO PEDIDO") + " \n ";
    //                 texto += this.imprimirLinhaTracejada() + " \n ";
                    

    //                 let i = 0;
    //                 await this.carregarItemPedido(pedido.id);
    //                 for (let itens of this.listaItens) {
    //                     i = i + 1;
    //                     texto += i + " - " + itens.nomeProduto + " \n "

    //                     if(itens.percentualDescontoAcrescimoItem > 0){
    //                         texto += this.alinharEsquerdaDireita(" ", itens.quantidadeVendida + " " + itens.unidade + " x " + this.numberToReal(itens.valorUnitario)+" - "+this.numberToReal(itens.valorDescontoAcrescimoItem)+"("+itens.percentualDescontoAcrescimoItem +"%) = "+ this.numberToReal(itens.valorTotal)  + " \n ")
    //                     }else{
    //                         texto += this.alinharEsquerdaDireita(" ", itens.quantidadeVendida + " " + itens.unidade + " x " + this.numberToReal(itens.valorUnitario)+" = "+ this.numberToReal(itens.valorTotal)  + " \n ") 
    //                     }
                        
    //                 }
    //                 texto += this.imprimirLinhaTracejada() + " \n ";

    //                 if(pedido.percentualDesconto > 0){
    //                     texto += this.alinharEsquerdaDireita("TOTAL:"+this.totalItemPedido()+" - "+this.numberToReal(pedido.valorDesconto)+"("+pedido.percentualDesconto+"%) ","PAGAR:"+this.numberToReal(pedido.totalApagar)  + " \n ");
    //                 }else{
    //                     texto += this.alinharEsquerdaDireita("","TOTAL GERAL: R$ " +this.totalItemPedido() + " \n ");
    //                 }
                    
    //                 texto += this.imprimirLinhaTracejada() + " \n ";
    //                 texto += "   " + " \n ";
    //                 texto += this.imprimirLinhaPonto() + " \n ";
    //                 texto += this.centralizar("(Assinatura do Cliente)") + " \n ";
    //                 texto += "   " + " \n ";
    //                 texto += "   " + " \n ";
     
    //                 console.log(texto);
    //                 await this.bs.enable();
    //                 await this.conectar();
    //                 await this.bs.write(texto);

    //                 this.loaderService.hideLoader();
    //                 // resolve('ok');
    //             } catch (e) {
    //                 reject(e);
    //             }


    //         } else {
    //             reject('Pedido não informado');
    //         }

    //     });
    }

    totalItemPedido(): any {

        let valorTotalPedido = 0;
        if (this.listaItens != null) {
            for (let itens of this.listaItens) {
                //console.log("valorTotal: " + itens.valorTotal);
                valorTotalPedido = valorTotalPedido + itens.valorTotal;
            }
        }

        return this.numberToReal(valorTotalPedido);
    }

    numberToReal(numero) {
        var numero = numero.toFixed(2).split('.');
        numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    }

    async carregarItemPedido(idPedido: any) {
        // alert(idPedido);
        this.listaItens = await this.http.get('/pedido-item/busca-id-pedido/' + idPedido);//as Array<any>
        // console.log(this.listaItens);
    }

    DateFormatadaMostrar(str: string): string {
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

    async conectar() {
        // let configuracao = await this.configuracaoService.getConfigueData();
        // return new Promise((resolve, reject) => {
        //     if (
        //         configuracao == undefined ||
        //         configuracao == null ||
        //         (configuracao.tipoImpressora != 'SOCKET' &&
        //             (configuracao.macImpressora == undefined ||
        //                 configuracao.macImpressora == null))
        //     ) {
        //         alert('Impressora não configurada')
        //         reject('Impressora não configurada');
        //     }

        //     this.bs.isConnected().then((success) => {
        //         resolve(success);
        //     }).catch(async (naoconectado) => {
        //         this.bs.connect(configuracao.macImpressora).subscribe((success) => {
        //             if (success == 'OK') {
        //                 resolve(success);
        //             } else {
        //                 alert('Erro ao conectar com a impressora');
        //                 reject('Erro ao conectar com a impressora');
        //             }
        //         });
        //     });


        // });
    }

    private imprimirLinhaTracejada(): string {

        let linha = '';
        for (let i = 0; i < this.pedidoService.objConfiguracao.colunasImpressao / 2; i++) {
            linha += '- ';
        }

        return linha;
    }

    centralizar(texto): string {

        const espacos =
            parseInt(((this.pedidoService.objConfiguracao.colunasImpressao -
                texto.length) / 2).toString(), 10);

        let stringEspacos = '';
        for (let i = 0; i < espacos; i++) {
            stringEspacos += ' ';
        }

        let text = stringEspacos + texto + stringEspacos;

        if (((this.pedidoService.objConfiguracao.colunasImpressao - text.length) % 2) > 0) {
            text += ' ';
        }

        return text;
    }

    alinharEsquerdaDireita(textoEsquerda: string, textoDireita: string): string {

        const espacos = this.pedidoService.objConfiguracao.colunasImpressao - (textoEsquerda.length + textoDireita.length);
        let texto = textoEsquerda;
        for (let i = 0; i < espacos; i++) {
            texto += ' ';
        }

        texto += textoDireita;
        // alert(texto);
        return texto;
    }

    completarComZeros(numero: string, digitos) {
        let completar = digitos - numero.length;

        for (let i = 0; i < completar; i++) {
            numero = '0' + numero;
        }

        return numero;
    }

    removerAcentos(s: String) {
        const map = {
            â: 'a',
            Â: 'A',
            à: 'a',
            À: 'A',
            á: 'a',
            Á: 'A',
            ã: 'a',
            Ã: 'A',
            ê: 'e',
            Ê: 'E',
            è: 'e',
            È: 'E',
            é: 'e',
            É: 'E',
            î: 'i',
            Î: 'I',
            ì: 'i',
            Ì: 'I',
            í: 'i',
            Í: 'I',
            õ: 'o',
            Õ: 'O',
            ô: 'o',
            Ô: 'O',
            ò: 'o',
            Ò: 'O',
            ó: 'o',
            Ó: 'O',
            ü: 'u',
            Ü: 'U',
            û: 'u',
            Û: 'U',
            ú: 'u',
            Ú: 'U',
            ù: 'u',
            Ù: 'U',
            ç: 'c',
            Ç: 'C',
        };

        return s.replace(/[\W\[\] ]/g, function (a) {
            return map[a] || a;
        });
    }

    private imprimirLinhaPonto() {

        let linha = '';
        for (let i = 0; i < this.pedidoService.objConfiguracao.colunasImpressao; i++) {
            linha += '.';
        }

        return linha;
    }





}
