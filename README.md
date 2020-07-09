# Babyphone

## Links

[How to develop and build angular app with node.js](https://medium.com/bb-tutorials-and-thoughts/how-to-develop-and-build-angular-app-with-nodejs-e24c40444421)

## REST-API Tests

Zum Testen der REST-API und der CRUD Funkionalität der Datenbank 
wurde [HTTPie](https://httpie.org) verwendet mit folgenden Befehlen.

Create:

```sh
http POST https://HOST:PORT/item item=hello
```

Read:

```sh
http GET https://HOST:PORT/items
```

Update:

```sh
http PUT https://HOST:PORT/item id=SOME_ID item=changed
```

Delete:

```sh
http DELETE https://HOST:PORT/item id=SOME_ID
```

## Database

```sh
$ docker exec -it docker_mongo_1 mongo -u root -p test
```

```sh
> show dbs
> use 
> show collections
> db.Clients.find().pretty()
> db.Clients.remove({ _id: ObjectId("5efce21ed274861837018175") }, { justOne: true })
> db.Clients.remove({ })
```

## Präsentation

### Vorbereitung

* Datenbank säubern
* Babystation destroy

### Fenster Arrangement

Erste und zweite Spalte Babyphone Firefox Fenster, dritte Spalte 2 Terminal Fenster (Server Logging, Datenbank).
Weiteres Chrome Fenster zur demonstration des Service Workers.

### Ablauf

* App Demo
    * Parent Station in zweitem Fenster klicken
        * No Connections zeigen
    * Baby Station in erstem Fenster klicken
        * Ungültige Daten eingeben (Zahlen / Sonderzeichen)
        * Front-End Validierung erwähnen
        * Submit Button inaktiv zeigen
        * Valide Daten eingeben 
        * Seite refreshen
        * Audio Eingang demonstrieren
        * Parent Station zeigt Connection
    * Parent Station verbinden
        * Alarm durch Lautstärke erzeugen
        * Audio und visuelles Signal in Parent Station erwähnen
        * Roter Background Alarm mittels Canvas implementiert erwähnen
        * Mobile / Desktop Layout mit Navbar demonstrieren
        * Bootstrap erwähnen
        * Detected Events in Navbar zeigen + neues Event durch Alarm
            * Generierung von dynamischen Inhalten
    * Baby Station Tools/Web Developer/Storage Inspector aufrufen
        * Indexed DB / Babyphone / DetectedEvents zeigen
        * Firefox offline schalten File/Work offline
        * Lokale DetectedEvents erzeugen
            * Dexie Framework erwähnen (Wrapper für IndexedDB)
        * Bei Parent Station zeigen, dass keine neuen DetectedEvents empfangen werden
        * Parent Station zeigt Warnung, dass keine Internetverbindung besteht
        * Firefox online schalten und zeigen, dass die Parent Station die Events empfängt
    * Parent Station - Alarm Sounds zeigen
        * Tools/Web Developer/Storage Inspector aufrufen
        * Cookie alarm-sound zeigen

* Code Demo
    * Backend
        * /app.js
            * Express erwähnen
            * IndexedRouter erwähnen
        * /routes/index_router.js
            * Routes zeigen
            * GET / zur Auslieferung des produktiven Angular Build
            * Restlichen /api/* Routes zur Manipulation der Daten
            * Anwendung der PV (Parameter Validation) zur serverseitigen Validierung zeigemn
            * Notification subscribe / unsubscribe zeigen
            * Empfang von Notification submits
        * /lib/parameter_validation.js
            * zeigen
        * /lib/database_handler.js
            * MongoClient zeigen
            * db() Methode und URL zeigen
            * CRUD Funktionalität erwähnen
        * /lib/notification_handler.js
            * Absenden von einer Notification mittels web-push Package
            * Private und Public Schlüssel zeigen
     * Angular
        * /angular/angular.json
            * Bootstrap, Dexie zeigen
            * Service Worker enabled zeigen
        * /angular/proxy.conf.json
            * Weiterleitung aller /api/* Routes zu Node.js auf Port 8091
        * /angular/dist/angular
            * Production Build mit ngsw und manifest.webmanifest
        * /angular/src/app/app.module.ts
            * Haupt-Components erwähnen (Index, Babystation, Connection, Parentstation)
            * Imports: FormModul, appRouting, HTTPClientModule, ServiceWorker
            * Services: Durchgehen
        * /angular/src/app/app-routing.module.ts
            * Routen erklären
            * Parent Station bekommt ClientId übergeben
        * /angular/src/app/services/microphone.service.ts
            * getMedia() Methode erklären
            * volumeProcess() Methode erklären
            * this.subject Instanz kann observiert werden -> baby-station.component.ts / setupMicrophone()
        * /angular/src/app/services/api.service.ts
            * HTTP Anfragen an den Node.js Server
        * /angular/src/app/services/detected-event.service.ts
            * Offline Funktionalität erklären mit -> online-offline.service.ts    