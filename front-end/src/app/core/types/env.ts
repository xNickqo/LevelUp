export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export type Env = {
  appVersion: string;
  production: boolean;
  apiBaseUrl: string;
  firebase: FirebaseConfig;
  stripePublicKey: string;
};
