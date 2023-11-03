import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfiguracaoService } from './configuracao.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ExceptionMessage } from "./ExceptionMessage";




@Injectable({ providedIn: 'root' })
export class HttpUtilService {


    private headers;
    private baseUrl: string;
    public showLogin = false;

    constructor(private configuracaoService: ConfiguracaoService,
        private httpCliente: HttpClient) {
    }

    getURLBase(): string {
        let objConfiguracao = this.configuracaoService.getConfigueData();
        //return 'http://' + objConfiguracao.ip + ':7081/api';
        return 'https://' + objConfiguracao.ip + '/api-erp';
    }

    getURLBaseImg(): string {
        let objConfiguracao = this.configuracaoService.getConfigueData();
        return 'https://' + objConfiguracao.ip + '/api-erp';
    }

    async post(resource: string, payload, options?: HttpHeaders): Promise<any> {
        let url;
        url = this.getURLBase() + resource;        

        return  await firstValueFrom(this.httpCliente.post(url, payload));
    }

    put(resource: string, payload, servidorLocal?: boolean): Observable<any> {
        let url;
        url = this.getURLBase() + resource;
        return this.httpCliente.put(url, payload);
    }

    retornoPutPost(res) {
        const status = res.status;

        if (status == 204) {
            // não teve nenhum objeto localizado
            return null;
        }

        if (status == 401 || status == 403) {
            this.showLogin = true;
            return;
        }

        if (status != 200) {
            // 200 = teve resposta com dados
            throw new Error('Falha ao Carregar o Serviço (Status ' + status + ')');
        }

        const exceptionMessage: ExceptionMessage = res.json();

        if (exceptionMessage.message !== undefined) {
            throw new Error(exceptionMessage.message);
        }
    }

    delete(resource: string, servidorLocal?: boolean): Observable<any> {
        let url;
        url = this.getURLBase() + resource;
        return this.httpCliente.delete(url);
    }

    async postGeral(resource: string, payload, options?: HttpHeaders): Promise<any> {
       
        let url = 'https://' + resource; 
        return  await firstValueFrom(this.httpCliente.post(url, payload));
    }

    async postGeral2(resource: string, payload, options?: HttpHeaders, observe: 'body' | 'response' = 'body'): Promise<any> {
        let url = 'https://' + resource;
        // const reqOptions = {};
        // reqOptions['headers'] = options ? options : this.getHeader();
        // reqOptions['observe'] = observe;

        const headers = new HttpHeaders();
      
      
        return  await firstValueFrom(this.httpCliente.post(url, payload, {  observe: 'response' }));
        
    }

    async get(resource: string): Promise<any> {
        let url;
        url = this.getURLBase() + resource;

        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        // return  this.httpCliente.get(url, { headers, observe: 'response' }  );
        
       
        let result: any = await firstValueFrom(this.httpCliente.get(url, { headers, observe: 'response' }));

        if (result && result.errorCode) {
            return Promise.reject(result.message);
        }

        return Promise.resolve(result.body);
    
    }

    async postBlob(resource: string, payload, servidorLocal?: boolean): Promise<any> {

        let url;

        url = this.getURLBase() + resource;


        const result: any = await this.httpCliente.post(url, payload, {
            responseType: 'blob',
            observe: 'response'
        }).toPromise();

        if (result && result.errorCode) {
            // throw(result.message);
            return Promise.reject(result.message);
        }

        return Promise.resolve(result);
    }

    async getBlob(resource: string, servidorLocal?: boolean): Promise<any> {

        let url;

        url = this.getURLBase() + resource;


        // const h = new HttpHeaders();
        // h.append('Content-Type', 'application/json');
        // h.append('sessionId', 'I8794@&8jHGGFgh%_');

        const result: any = await this.httpCliente.get(url, {
            responseType: 'blob',
            observe: 'response'
        }).toPromise();

        if (result && result.errorCode) {
            // throw(result.message);
            return Promise.reject(result.message);
        }

        return Promise.resolve(result);
    }

       // get2(resource: string): Observable<any> {
    //     let url = this.getURLBase() + resource;
    //     return this.httpCliente.get(url, { headers: this.getHeader() });
    // }

    // setHeaders(headersParams): HttpHeaders {


    //     let headers = new HttpHeaders();
    //     headers.append('Content-Type', 'application/json');

    //     if (headersParams) {
    //         for (const header of headersParams) {
    //             headers = headers.append(header.header, header.value);
    //         }
    //     }

    //     return headers;
    // }

    // post2(resource: string, payload, options?: HttpHeaders, observe: 'body' | 'response' = 'body'): Observable<any> {

    //     let url = this.getURLBase() + resource;

    //     const reqOptions = {};

    //     reqOptions['headers'] = options ? options : this.getHeader();
    //     reqOptions['observe'] = observe;

    //     return this.httpCliente.post(url, payload, reqOptions);
    //     // .pipe(map((res) => {
    //     //     console.log('res = ' + res);
    //     //     this.retornoPutPost(res);
    //     //     return res;
    //     // }), catchError((res, obs) => {
    //     //     console.log('deu muito erro ' + JSON.stringify(res));

    //     //     return throwError(res);
    //     // }));

    // }   

    

    // public put2(resource: string, payload, options?: HttpHeaders, observe: 'body' | 'response' = 'body'): Observable<any> {

    //     let url = this.getURLBase() + resource;

    //     const reqOptions = {};

    //     reqOptions['headers'] = options ? options : this.getHeader();
    //     reqOptions['observe'] = observe;



    //     return this.http.put(url, payload, reqOptions).pipe(map(res => {
    //         this.retornoPutPost(res);

    //         return res;
    //     }), catchError((res: Response) => {
    //         if (res.status === 401 || res.status === 403) {
    //             this.showLogin = true;
    //             return;
    //         }
    //         return throwError(res);
    //     }));
    // }

    // public delete2(resource: string, payload): Observable<Response> {
    //     let url = this.getURLBase() + resource;

    //     return this.http.delete(url).pipe(map(res => {
    //         return res;
    //     }), catchError((res: Response) => {
    //         if (res.status === 401 || res.status === 403) {
    //             this.showLogin = true;
    //             return;
    //         }
    //         return throwError(res);
    //     }));
    // }

 

    // getText(resource: string): Observable<any> {
    //     let url = this.getURLBase() + resource;

    //     return this.httpCliente.get(url, { headers: this.getHeader() });
    // }

    // getTeste(): Observable<any> {
    //     return this.httpCliente.get('http://127.0.0.1:7083/api/tipoveiculos',
    //         { headers: this.getHeader() });
    // }

    // private getHeader(): HttpHeaders {
    //     const headersParams = [
    //         {
    //             header: 'sessionId',
    //             value: 'I8794@&8jHGGFgh%_'
    //         }
    //     ];

    //     const options = this.setHeaders(headersParams);
    //     return options;
    // }

    // setHeaders2(headersParams): HttpHeaders {


    //     let headers = new HttpHeaders();
    //     headers.append('Content-Type', 'application/json');

    //     if (headersParams) {
    //         for (const header of headersParams) {
    //             headers = headers.append(header.header, header.value);
    //         }
    //     }

    //     return headers;
    // }

    // setHeadersText(headersParams): HttpHeaders {


    //     let headers = new HttpHeaders();
    //     headers.append('Content-Type', 'application/json');

    //     if (headersParams) {
    //         for (const header of headersParams) {
    //             headers = headers.append(header.header, header.value);
    //         }
    //     }

    //     return headers;
    // }

    // private getHeader(): RequestOptions {

    //     const headersParams = [
    //         {
    //             header: 'sessionId',
    //             value: 'I8794@&8jHGGFgh%_',
    //         }
    //     ];


    //     const options = this.setHeaders(headersParams);
    //     return options;
    // }

    // setHeaders(headersParams): RequestOptions {

    //     this.headers = new Headers();
    //     this.headers.append('Content-Type', 'application/json');

    //     if (headersParams) {
    //         for (const header of headersParams) {
    //             this.headers.append(header.header, header.value);
    //         }
    //     }

    //     return new RequestOptions({ headers: this.headers, withCredentials: false });
    // }

    timeout(ms): Promise<String> {
        return new Promise((resolve, reject) => {
            let id = setTimeout(() => {
                clearTimeout(id);
                reject('Sem conexão com o servidor');
            }, ms)
        })
    }

}
