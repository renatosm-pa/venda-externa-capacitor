import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then(m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./page/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'configuracao',
    loadChildren: () => import('./page/configuracao/configuracao.module').then(m => m.ConfiguracaoPageModule)
  },
  {
    path: 'acesso-rapido',
    loadChildren: () => import('./page/acesso-rapido/acesso-rapido.module').then(m => m.AcessoRapidoPageModule)
  },
  {
    path: 'visita',
    loadChildren: () => import('./page/visita/visita.module').then(m => m.VisitaPageModule)
  },
  {
    path: 'lista-visita',
    loadChildren: () => import('./page/lista-visita/lista-visita.module').then(m => m.VisitaListPageModule)
  },
  {
    path: 'lista-filial',
    loadChildren: () => import('./page/lista-filial/lista-filial.module').then(m => m.FilialListPageModule)
  },
  {
    path: 'lista-pedido',
    loadChildren: () => import('./page/lista-pedido/lista-pedido.module').then(m => m.PedidoListPageModule)
  },
  {
    path: 'busca-preco',
    loadChildren: () => import('./page/busca-preco/busca-preco.module').then(m => m.BuscaPrecoPageModule)
  },
  // {
  //   path: 'cliente',
  //   loadChildren: () => import('./page/lista-cliente/lista-cliente.module').then(m => m.ClienteListPageModule)
  // },
  // {
  //   path: 'lista-produto',
  //   loadChildren: () => import('./page/lista-produto/lista-produto.module').then(m => m.ProdutoListPageModule)
  // },
  // {
  //   path: 'pedido',
  //   loadChildren: () => import('./page/pedido/pedido.module').then(m => m.PedidoPageModule)
  // },
  // {
  //   path: 'tabs',
  //   loadChildren: () => import('./page/tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  // {
  //   path: 'tab1',
  //   loadChildren: () => import('./page/tab1/tab1.module').then(m => m.Tab1PageModule)
  // },
  // {
  //   path: 'tab2',
  //   loadChildren: () => import('./page/tab2/tab2.module').then(m => m.Tab2PageModule)
  // },
  // {
  //   path: 'inserir-item',
  //   loadChildren: () => import('./page/inseri-item/inseri-item.module').then(m => m.InserirItemPageModule)
  // },

  // {
  //   path: 'grafico-vendas',
  //   loadChildren: () => import('./page/grafico-vendas/grafico-vendas.module').then(m => m.GraficoVendaPageModule)
  // },
  // {
  //   path: 'filtro-component', loadChildren: './page/filtro-component/filtro-component.module#FiltroComponentPageModule'
  // },
  // {
  //   path: 'slide-component', loadChildren: './page/slide-component/slide-component.module#SlideComponentPageModule'
  // },
  // {
  //   path: 'catalogo-produto',
  //   loadChildren: () => import('./page/catalogo-produto/catalogo-produto.module').then(m => m.CatalogoProdutoListPageModule)
  // },

  // {
  //   path: 'inventario',
  //   loadChildren: () => import('./page/inventario/inventario.module').then(m => m.InventarioPageModule)
  // },



  // {
  //   path: 'itens-falta',
  //   loadChildren: () => import('./page/lista-itens-falta/lista-itens-falta.module').then(m => m.ItensFaltaListPageModule)
  // },
  // {
  //   path: 'cadastro-falteiro',
  //   loadChildren: () => import('./page/cadastro-falteiro/cadastro-falteiro.module').then(m => m.CadastroFalteiroListPageModule)
  // },
  // {
  //   path: 'cadastro-cliente',
  //   loadChildren: () => import('./page/cadastro-cliente/cadastro-cliente.module').then(m => m.CadastroClienteListPageModule)
  // }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
