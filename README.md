# Todo

Simple todo app

## Run the app with docker
```sh
docker-compose up
```

## API



## Mongo

Show users and tasks collections with mongo

```sh
docker-compose exec mongo mongo
use mongo

# Show all users
db.users.find()

# Show all tasks
db.tasks.find()

# Show all tokens
db.refreshtokens.find()
```


