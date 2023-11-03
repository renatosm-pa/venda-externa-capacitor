export class StringUtils {



    static dateFormatSQLite = 'yyyy-MM-ddTHH:mm:ss';
    static dateFormatSincronizacao = 'dd-MM-yyyy HH:mm:ss';


    static brPrimeNg = {
        closeText: 'Fechar',
        prevText: 'Anterior',
        nextText: 'Próximo',
        currentText: 'Começo',
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        weekHeader: 'Semana',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: '',
        timeOnlyTitle: 'Só Horas',
        timeText: 'Tempo',
        hourText: 'Hora',
        minuteText: 'Minuto',
        secondText: 'Segundo',
        // currentText: 'Data Atual',
        ampm: false,
        month: 'Mês',
        week: 'Semana',
        day: 'Dia',
        allDayText: 'Todo Dia'
    };

    static isEmpty(value: string): boolean {

        return value == undefined || value == null || value.trim() == "";
    }

    static extraiNumeros(value: string): string {
        let result = "";
        let numeros = ['0', '1', '2', '3', '4', '5', "6", "7", "8", "9"];
        for (let index = 0; index < value.length; index++) {
            const caracter = value[index];

            if (caracter in numeros) {
                result += caracter;
            }
        }
        return result;
    }

    static string2Decimal(valor: string): string {

        valor = valor.replace(/\./gi, '');
        valor = valor.replace(',', '.');

        return valor;
    }

    static decimal2String(decimal) {
        decimal.replace('.', ';');
        decimal.replace(',', '.');
        decimal.replace(';', ',');
    }

    static string2Date(str: string): Date {
        let formatada = str.substr(0, 4);
        formatada += '-' + str.substr(4, 2);
        formatada += '-' + str.substr(6, 2);
        formatada += ' ' + str.substr(8, 2);
        formatada += ':' + str.substr(10, 2);
        formatada += ':' + str.substr(12, 2);

        return new Date(formatada);
    }

    static mascara(t, mask) {
        //alert(t.length)

       
        var i = t.length;
        var saida = mask.substring(1, 0);
        var texto = mask.substring(i)
        if (texto.substring(0, 1) != saida) {
            t += texto.substring(0, 1);
        }

        return t
    }

    static DateFormatadaInsert(str: string): Date {

        if (str !== '') {
            let DIA = str.substr(0, 2);
            console.log(DIA)
            let MES = str.substr(3, 2);
            console.log(MES)
            let ANO = str.substr(6, 4);
            console.log(ANO)


            return new Date(ANO + "-" + MES + "-" + DIA + " 00:00:00")


        }

    }

    static DateFormatada(str: string): String {
     let data = ""
        if (str !== '') {
            let DIA = str.substr(0, 2);
            console.log(DIA)
            let MES = str.substr(3, 2);
            console.log(MES)
            let ANO = str.substr(6, 4);
            console.log(ANO)

            data = ANO + "-" + MES + "-" + DIA ;
            return data


        }

    }

    static DateFormatadaMostrar(str: string): Date {
        let data = null;
        if (str !== undefined) {
            let ANO = str.substr(0, 4);
            console.log("ANO: " + ANO)
            let MES = str.substr(5, 2);
            console.log("MES: " + MES)
            let DIA = str.substr(8, 2);
            console.log("DIA: " + DIA)
            console.log(DIA + "/" + MES + "/" + ANO + " 00:00:00")
            data = DIA + "/" + MES + "/" + ANO;

        }
        return data;

    }


    static DateFormataDataAno(str: string): Date {
        let data = null;
        if (str !== undefined) {
            
            let ANO = str.substr(0, 4);
            //console.log("ANO: " + ANO);

            let MES = str.substr(5, 2);
            //console.log("MES: " + MES);
            
            //console.log(MES + "/" + ANO );
            data = MES + "/" + ANO ;

        }
        return data;

    }

    static getDescricaoSemana(diaSemana: number) {
        let dia;
        switch (diaSemana) {
            case 0: {
                dia = "DOMINGO";
                break;
            }
            case 1: {
                dia = "SEGUNDA";
                break;
            }

            case 2: {
                dia = "TERCA";
                break;
            }

            case 3: {
                dia = "QUARTA";
                break;
            }

            case 4: {
                dia = "QUINTA";
                break;
            }

            case 5: {
                dia = "SEXTA";
                break;
            }

            case 6: {
                dia = "SABADO";
                break;
            }

            case 7: {
                dia = "DOMINGO";
                break;
            }
        }

        return dia;
    }

    static stringTimeToDate(hora: string): Date {

        let shora = hora.substr(0, 2);
        let smin = hora.substr(3, 2);
        let sseg = hora.substr(6, 2);

        let tipo = hora.substr(9, 2);

        let h: number;
        h = +shora;

        if (tipo === 'PM') {
            h += 12;
        }

        let dataResult: Date;

        let sData;
        if (h < 10) {
            sData = "0000-01-01 0" + h + ":" + smin + ":" + sseg;
        } else {
            sData = "0000-01-01 " + h + ":" + smin + ":" + sseg;
        }

        dataResult = new Date(sData);

        return dataResult;
    }

    static trocaVirgulaPonto(valor) {
        return valor.replace(".", "").replace(",", ".")
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

    cpf_mask(v) {


        v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
        v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
        v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
        //de novo (para o segundo bloco de números)
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); //Coloca um hífen entre o terceiro e o quarto dígitos
        //alert('v: ' + v)
        return v;
    }

    cnpj_mask(v) {
        v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
        v = v.replace(/^(\d{2})(\d)/, '$1.$2'); //Coloca ponto entre o segundo e o terceiro dígitos
        v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3'); //Coloca ponto entre o quinto e o sexto dígitos
        v = v.replace(/\.(\d{3})(\d)/, '.$1/$2'); //Coloca uma barra entre o oitavo e o nono dígitos
        v = v.replace(/(\d{4})(\d)/, '$1-$2'); //Coloca um hífen depois do bloco de quatro dígitos
        return v;
    }


    static formatterNumberToCurrency(number: string) {
        return parseFloat(number).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).toString().replace('R$ ', "");
    }

    static formatterNumberToCurrencyperc(number: string) {
        return parseFloat(number).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).toString().replace('% ', "");
    }

    static formatReal(valor) {
        return StringUtils.formatterNumberToCurrency(valor);
    }


    static numberToReal(numero) {
        var numero = numero.toFixed(2).split('.');
        numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    }

    static apenasNumeros(string) {
        var numsStr = string.replace(/[^0-9]/g, '');
        return parseInt(numsStr);
    }


}
