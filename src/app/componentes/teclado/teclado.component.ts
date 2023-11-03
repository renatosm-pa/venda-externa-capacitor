import {Component, HostListener, Input, OnInit, EventEmitter, Output, ChangeDetectorRef} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {ConfiguracaoService} from '../../services/configuracao.service';

@Component({
    selector: 'app-teclado',
    templateUrl: './teclado.component.html',
    styleUrls: ['./teclado.component.scss'],
})
export class TecladoComponent implements OnInit {

    @Output()
    enterPressed = new EventEmitter();

    @Input()
    inline: false;

    constructor(private ref: ChangeDetectorRef,
                private configuracaoService: ConfiguracaoService) {

    }

    async ionViewDidEnter() {
        this.input.value = '';
    }


    @Input()
    input: any;

    ngOnInit() {
        addEventListener('keyup', ev => {
            if (ev.key === 'Backspace') {
                this.acaoapagar();
            }
            let num = Number(ev.key);
            if (num >= 0 && num <= 9) {
                if (this.configuracaoService.telaAtiva != 'LOGIN') {
                    return null;
                }
                this.acaoNumero(num);
            }
        });

    }

    acaoNumero(numero: number) {
        this.input.value = this.input.value + numero;
    }

    acaoLimpar() {
        this.input.value = '';
    }


    acaoapagar() {
        this.input.value = this.input.value.substr(0, this.input.value.length - 1);
    }
}
