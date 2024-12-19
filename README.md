# Poc nchan

Ce projet est un exercice et un poc de la solution [nchan]()

L'objectif est de mettre en place un système de notifications push avec: 
- Un server pub/sub
- Un backend API
- Un serveur front

## Set up et installation

Dependances: 
- Docker
- Docker compose
- rust
- nodejs

1. Créer un fichier .env à mettre au niveau de `backend/event-backend/.env`

```shell
MONGO_INITDB_ROOT_USERNAME="admin"
MONGO_INITDB_ROOT_PASSWORD="admin"
MONGO_HOST="mongodb"
BACKEND_SRV_PORT="8080"
```

2. Builder les services backend

```shell
cd backend
docker compose build
```

3. Démarrer les services backend: nginx, api, mongodb

```shell
docker compose up 
```

4. Démarrer le service front

```shell
cd ../frontend
npm start dev 
```

5. Tester 

Aller à l'URL : localhost:5173 et tester
