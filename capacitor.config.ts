import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'interagese.vendas.externas',
  appName: 'venda-externa',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
