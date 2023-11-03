import {PermissaoSistema} from './permissao-sistema';


export class AuthenticatedUser {
  private readonly sessionId: string;
  public roles: string[];
  public systems: string[];
  public configuration: string[];
  public login: string;
  public id: number;
  public nome: string;
  public token: string;
  public permissaoSistema: PermissaoSistema;
  public percentuais;

  constructor(jwt: string) {

    const jwtParts: string[] = jwt.split('.');
    const jwtBody = atob(jwtParts[1]);
    const claims = JSON.parse(jwtBody);

    this.percentuais = claims.percentuais;
    this.sessionId = claims.sessionId;
    this.roles = claims.roles;
    this.systems = claims.systems;
    this.configuration = claims.config;
    this.login = claims.login;
    this.id = claims.user_id;
    this.token = jwt;
    this.nome = claims.sub;

  }

  hasPermissao(idPermissao: string) {

    if (this.permissaoSistema === undefined || this.permissaoSistema.permissoes === undefined) {

      return false;
    } else {
      if (this.permissaoSistema.permissoes.indexOf(idPermissao) > -1) {

        return true;
      }
    }

    return false;
  }

  getSessionId() {
    return this.sessionId;
  }
}
