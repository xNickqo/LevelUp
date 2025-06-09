import { Env } from '@core/types/env';

export const environment: Env = {
  appVersion: `${require('../../package.json').version}-dev`,
  production: false,
  // eslint-disable-next-line no-template-curly-in-string
  apiBaseUrl: 'http://localhost:3000',
  firebase: {
    apiKey: 'AIzaSyB28et4TCMEj85pAVl9h1MvYjLVZ-8pc34',
    authDomain: 'angular-auth-51a73.firebaseapp.com',
    projectId: 'angular-auth-51a73',
    storageBucket: 'angular-auth-51a73.firebasestorage.app',
    messagingSenderId: '182696274421',
    appId: '1:182696274421:web:6ecd87ebccd6f9168fd8bc'
  },
  stripePublicKey: 'pk_test_51RLlcfQPOm2povebYqiiqOZmDwL2BNjEntWaxH5kScjkYIhjC0qR2n5fVmCyQgm4FdmTAiTaq2U7wcwyVSjLV3na00SKiwHYQQ'
};
