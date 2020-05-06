# Kettagolf
  
Projekt on loodud Tallinna Ülikooli Digitehnoloogiate instituudi bakalaureusetöö raames.
  
## Kirjeldus  
Eesmärk on luua mobiilirakendus, mida saab kasutada teiste kettagolfi mängijate leidmiseks ning kettagolfi treeningute tulemuste märkimiseks. Rakendus on mõeldud nii alustavatele kui aktiivsetele mängijatele.  

Rakenduse kasutamiseks tuleb end kasutajaks registreerida. Registreerunud kasutajad saavad luua treeninguid, treeningus osalejateks saab lisada nii teisi registreerunud kasutajaid kui ka ühe treeningu põhiseid registreerimata kasutajaid. Mängukaaslaste otsimisel saavad kasutajad lisada kuulutusi ning vastata teiste lisatud kuulutustele.  
  
## Kasutatud tehnoloogiad  
Kasutatud tehnoloogiad ja teegid, koos versioonidega on failis [package.json](package.json).  

Kasutatud tehnoloogiad:
* [React Native](https://reactnative.dev/docs/getting-started)
* [Firebase](https://firebase.google.com/)

Kasutatud React Native'i teegid:
* [React Native Firebase](https://rnfirebase.io/)
* [React Navigation](https://reactnavigation.org/docs/getting-started)
* [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)
* [React Native Elements](https://react-native-elements.github.io/react-native-elements/docs/getting_started.html)
* [React Native Paper](https://callstack.github.io/react-native-paper/)
* [React Native Searchable Dropdown](https://github.com/zubairpaizer/react-native-searchable-dropdown)
* [React Native Image Picker](https://github.com/react-native-community/react-native-image-picker)
* [React Native Maps](https://github.com/react-native-community/react-native-maps)
* [React Native DateTimePicker](https://github.com/react-native-community/datetimepicker)  
  
## Paigaldamine
Rakendust on võimalik paigaldada ainult Androidi operatsioonisüsteemi kasutavatele mobiiltelefonidele. Selleks tuleb läbida järgnevad sammud:  
* Lae telefoni alla [Kettagolf.apk](Kettagolf.apk) fail
* Paigalda rakendus telefoni
* Ava rakendus ning logi sisse või loo kasutaja
  
Rakenduse käitamiseks läbi arenduskeskkonna tuleb React Native'i veebilehel oleva [juhendi](https://reactnative.dev/docs/environment-setup) järgi see kõigepealt üles seada. Arenduskeskkonna üles seadmisel tuleb valida React Native CLI, mitte Expo CLI.
  
## Litsents
[MIT litsents](LICENSE)  
  
Rakenduses kasutatud [kettagolfi korvi ikoon](https://thenounproject.com/term/disc-golf-basket/1299/) on kaitstud Creative Commons litsentsiga. Ikooni autor on Steve Cardwell.