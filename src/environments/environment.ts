// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyDYT9XaFi5KaXN2LyG-tW3Gri0pgdLEJ54",
    authDomain: "namu-scm.firebaseapp.com",
    projectId: "namu-scm",
    storageBucket: "namu-scm.appspot.com",
    messagingSenderId: "144316053830",
    appId: "1:144316053830:web:b183e1c0b832991b260d47"
  },
  //apiBaseURI :'http://localhost:8080/api/'
  apiBaseURI :'https://namu-scm.n-e.kr/api/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
