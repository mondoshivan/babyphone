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
```


