import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDKPHexedG_d-8JoqFWNEHIivGRR6tK7pU',
  authDomain: 'data-repository-p03.firebaseapp.com',
  databaseURL: 'https://data-repository-p03-default-rtdb.firebaseio.com',
  projectId: 'data-repository-p03',
  storageBucket: 'data-repository-p03.firebasestorage.app',
  messagingSenderId: '408078363878',
  appId: '1:408078363878:web:53d07bbd5cf3013ff69f27',
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
