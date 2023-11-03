import {Directive, ElementRef, HostListener} from '@angular/core';
import {NgModel} from '@angular/forms';
import {DatePipe} from '@angular/common';

@Directive({
    selector: '[dataBrasil]'
})
export class DataBrasilDirective {

    constructor(private ngModel: NgModel, private el: ElementRef<HTMLInputElement>,
                private datePipe: DatePipe) {
    }

    @HostListener('blur', [
        '$event.target',
        '$event.target.value',
    ])
    formatar(el: any, dataInformada: Date) {

        if (dataInformada == null) {
            return;
        }


        const result = this.datePipe.transform(dataInformada, 'yyyy-MM-dd');
        this.el.nativeElement.value = result!;


        // let isNumber = false;
        // try {
        //     let testeNumber = +dataInformada;
        //     if (!Number.isNaN(testeNumber)) {
        //         isNumber = true;
        //     }
        //
        // } catch (e) {
        // }
        //
        // let result;
        // const fn3 = new DatePipe('pt-BR');
        //
        // if (isNumber) {
        //     result = fn3.transform(dataInformada, 'dd/MM/yyyy');
        // } else {
        //     // Remove tudo que não for de "0" a "9" e ","
        //     const regex = /([^0-9,])/gm;
        //     result = dataInformada.replace(regex, '');
        //     // Muda virgula para ponto
        //     result = result.replace(',', '.');
        //     // Formata para Decimal o dataInformada
        //     result = fn3.transform(result, 'dd/MM/yyyy');
        // }
        //
        //
        // if (result !== null) {
        //     this.el.nativeElement.value = result;
        // }
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

                if (input !== ativo) {
                    //foi informado o valor diratamente no ngmodel
                    // this.formatar(this.el, val);
                    if (this.ngModel.model) {
                        this.formatar(this.el, this.ngModel.model);
                    }

                    return;
                }


                if (val == null || !val) {
                    return;
                }

                // Remove tudo que não for de "0" a "9" e ","
                // const regex = /([^0-9,])/gm;
                // val = val.replace(regex, '');
                // this.el.nativeElement.value = val;


                // val = val.replace(',', '.');

                try {
                    let dataDate: Date = this.parseDate(val);

                    this.ngModel.control.setValue(dataDate, {
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


    parseDate(dateString: string, date?: Date): Date {

        const dia = +dateString.substr(8, 2);
        const mes = +dateString.substr(5, 2);
        const ano = +dateString.substr(0, 4);

        if (date) {
            date.setFullYear(ano);
            date.setMonth(mes - 1);
            date.setDate(dia);
            return date;
        }

        if (dateString) {
            const data = new Date(Date.UTC(ano, mes - 1, dia, 12, 0, 0));
            return data;
        }

        return null!;
    }

}
