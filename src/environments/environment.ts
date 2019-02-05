// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase_config: {
    apiKey: "AIzaSyAUcxQtSwFxZUtf-mwViHE0H7W7_I-Iam4",
    authDomain: "rb-app-172b5.firebaseapp.com",
    databaseURL: "https://rb-app-172b5.firebaseio.com",
    projectId: "rb-app-172b5",
    storageBucket: "rb-app-172b5.appspot.com",
    messagingSenderId: "250422010518"
  },
  backendUrl: "http://localhost:3000/",
  rb_api_endpoints: {
    getCustomQuote: 'getCustomQuote',
    getTopMarketCap: 'getTopMarketCap',
    addNewUser: 'addNewUser',
    getNews: 'getNews'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
