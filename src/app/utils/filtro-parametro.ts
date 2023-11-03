import { FiltroParametroItem } from "./filtro-parametro-item";

export class FiltroParametro {

    posicaoInicial: number;
    quantidadeRegistros: number;
    private itens: FiltroParametroItem[] = new Array();

    addItem(fieldName: string, fieldValue: string) {

        let item: FiltroParametroItem = this.get(fieldName);

        if (item == null) {

            item = new FiltroParametroItem();
            this.itens.push(item);
            item.field = fieldName;
        }

        item.value = fieldValue;

    }

    clear() {
        this.itens = new Array();
    }

    get(fieldName: string ): FiltroParametroItem {

        for (let item of this.itens) {
            if (fieldName === item.field) {
                return item;
            }
        }

        return null ;
    }


}
