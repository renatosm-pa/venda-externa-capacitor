import { Injectable } from '@angular/core';
// import { File, FileEntry } from '@ionic-native/file/ngx';
// import { FileTransfer } from '@ionic-native/file-transfer/ngx';
// import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform } from '@ionic/angular';

@Injectable()
export class PdfService {

    constructor(
        // private file: File,
        // private fileTransfer: FileTransfer,
        // private fileOpener: FileOpener,
        private platform: Platform
    ){ }

    downloadFile(res: any, nomeArquivo: any) {
        // var blob = new Blob([res], { type: "application/pdf" });
        // console.log(window.URL.createObjectURL(blob));

        // //Determine a native file path to save to
        // let filePath = null;
        // if (this.platform.is("ios")) {
        //     filePath = this.file.documentsDirectory;
        // } else {
        //     filePath = this.file.dataDirectory;
        // }

        // //Write the file
        // this.file.writeFile(filePath, nomeArquivo, blob, { replace: true }).then((fileEntry: FileEntry) => {
        //     console.log("File created!");
        //     //Open with File Opener plugin
        //     this.fileOpener.open(fileEntry.toURL(), "application/pdf").then(() =>
        //         console.log("File is opened")
        //     ).catch(err =>
        //         console.error("Error openening file: " + err)
        //     );

        // }).catch((err) => {
        //     console.error("Error creating file: " + err);
        //     throw err;  //Rethrow - will be caught by caller
        // });
    }
}
