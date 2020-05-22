# Babyphone

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
