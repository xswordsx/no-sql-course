# Short solution

## Prefix

```
mongo jokes
```

1. Populate
	```
	  db.users.insert({
	      "name" : "Господин Бъзик",
	      "email": "joke_master@abv.bg",
	      "likes": [ "Бил Гейтс", "Чък Норис", "Чапай", "Петка" ]
		})
	
	  db.jokes.insert({
	      "text": "huhue",
	      "author": "Госпоцижа Майтап",
	      "rating": 1,
	      "characters": ["Чък Норис"]
	  })
	```

2. Add black humor
	```
	    db.jokes.update(
	      { author: db.users.findOne().name },
	      { $set: { black_humor: true } },
	      { multi: true }
	    )
	```

3. Find add jokes with Chuck Norris or Ivancho
	```
	  db.jokes.find({characters: { $in: ['Чък Норис', 'Иванчо'] } }).sort({ rating: 1 })
	```

4. Remove all jokes with rating less than 4
	```
	  db.jokes.remove({ rating: { $lte: 3 } })
	```

5. Count user's jokes
	```
	  db.jokes.count({ author: db.users.findOne().name })
	```
