import {Directive, DoCheck, ElementRef, HostListener, OnInit} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {NgModel} from '@angular/forms';
import {StringUtils} from '../../utils/string-utils';


@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[valorDecimal]'
})
export class ValorDecimalDirective implements OnInit {

    constructor(private ngModel: NgModel, private el: ElementRef<HTMLInputElement>) {
    }

    @HostListener('blur', [
        '$event.target',
        '$event.target.value',
    ])
    formatar(el: any, valor: string) {

        let isNumber = false;
        try {
            let testeNumber = +valor;
            if (!Number.isNaN(testeNumber)) {
                isNumber = true;
            }

        } catch (e) {
        }

        let result;
        const fn3 = new DecimalPipe('pt-BR');

        if (isNumber) {
            result = fn3.transform(valor, '1.2-2');
        } else {
            // Remove tudo que não for de "0" a "9" e ","
            const regex = /([^0-9,])/gm;
            result = valor.replace(regex, '');
            // Muda virgula para ponto
            result = result.replace(',', '.');
            // Formata para Decimal o valor
            result = fn3.transform(result, '1.2-2');
        }


        if (result !== null) {
            this.el.nativeElement.value = result;
        }
    }

    @HostListener('click')
    selecionar() {
        this.el.nativeElement.select();
    }

    ngOnInit(): void {
//data de atualizacao 27/04/2022

        this.ngModel.control.valueChanges.subscribe(() => {
                let val = this.el.nativeElement.value;


                const input: any = this.el.nativeElement;
                const ativo: any = document.activeElement;

                if (input.value !== ativo.value) {
                    //foi informado o valor diratamente no ngmodel
                    this.formatar(this.el, val);
                    return;
                }


                if (val == null || !val) {
                    return;
                }

                // Remove tudo que não for de "0" a "9" e ","
                const regex = /([^0-9,])/gm;
                val = val.replace(regex, '');
                this.el.nativeElement.value = val;


                val = val.replace(',', '.');

                try {
                    let numero: number = +val;
                    this.ngModel.control.setValue(numero, {
                        emitModelToViewChange: false,
                        emitViewToModelChange: true,
                        emitEvent: false
                    });
                } catch (ex) {
                    console.log(ex);
                }
            }
        );
    }


}
