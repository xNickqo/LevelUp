import { Env } from '@core/types/env';

export const environment: Env = {
  appVersion: `${require('../../package.json').version}-dev.local`,
  production: false,
  apiBaseUrl: 'http://localhost:3000',
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  },
  stripePublicKey: ''
};
