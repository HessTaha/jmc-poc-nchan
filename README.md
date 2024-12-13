# Event backend

Code permettant de démarrer:

1. Une api basique avec 2 endpoints: 
- GET - /ready -> retourne un status Ok
- POST - /command/register_new_event -> écrit un event dans une base mongo

2. Un container mongo 

## Set up et installation


Dependances: 
- Docker
- Docker compose
- rust

1. Créer un fichier .env

```shell
MONGO_INITDB_ROOT_USERNAME="admin"
MONGO_INITDB_ROOT_PASSWORD="admin"
```

2. Builder les services

```shell
docker compose build
```


3. Démarrer les services

```shell
docker compose up
```


4. Tester

Dans le fichier Makefile se trouve les commandes


curl -X POST http://localhost:8080/command/register_new_event \
     -H "Content-Type: application/json" \
     -d '{
           "titre_de_levenement": "Conférence Rust 2024",
           "type_de_levenement": "rencontre",
           "date": "2024-12-09T14:30:00Z",
           "lieu": "Paris, France",
           "organisateur": "Rust France",
           "description": "Une conférence dédiée au langage Rust."
         }'

curl -X GET http://localhost:8080/ready 
