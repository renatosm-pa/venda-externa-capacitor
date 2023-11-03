import { AlertController, ToastController } from '@ionic/angular';

export class PagePadrao {
    loading:any;

    constructor(protected alertController: AlertController
      ) {



    }





    addErroException(e:any) {
        if (typeof e === 'object') {
            this.addErro(JSON.stringify(e));
        } else {
            this.addErro(e);
        }
    }


    async addErro(mensagem: string) {
        const alert = await this.alertController.create({
            header: 'Erro',
            animated: true,
            message: mensagem,
            buttons: ['OK']
        });
        await alert.present();
    }

    async addSucess(mensagem: string, header: string) {
        const alert = await this.alertController.create({
            header: header,
            animated: true,
            message: mensagem,
            buttons: ['OK']
        });

        await alert.present();
    }

    async addWarning(mensagem: string) {
        const alert = await this.alertController.create({

            header: 'Atenção',
            animated: true,
            message: mensagem,
            buttons: ['OK']
        });

        await alert.present();
    }





}
