var mongodb = require('mongodb');
var q = require('q');
var assert = require('assert');
var MongoClient = mongodb.MongoClient;
var express = require('express');
var app = express();

var config = require('./config.json');
var artists = require('./artists.json');
var albums = require('./albums.json');

var uri = 'mongodb://';
if(config.username && config.password) {
  uri += config.username + ":" + config.password + "@";
}
uri += config.db.url + ':' + config.db.port + '/' + config.db.db;

app.use('/', express.static(__dirname + '/static'));

app.get('/populate', function (req, res) {
	MongoClient.connect(uri, function (err, db){
		assert.equal(null, err);
		var done = [q.defer(), q.defer()];
		var artistCollection = db.collection('artists').insert(artists, function(err, result){
			assert.equal(null, err);
			done[0].resolve(result.length);
		});
		var albumCollection = db.collection('albums').insert(albums, function(err, result){
			assert.equal(null, err);
			done[1].resolve(result.length);
		});
		q.all(done).then(function() {
			res.status(200).end("database populated successfully");
			db.close();
		});
	});
});

app.get('/modifyPanayot', function (req, res) {
	MongoClient.connect(uri, function (err, db){
		assert.equal(null, err);

		db.collection('albums').update({
			name: /Panayot Panayotov/i
		}, {
			$set: {favorite: true},
			$push: {genres: "pop"}
		}, {
			multi: true
		}, function (err, result) {
			assert.equal(null, err);
			res.status(200).end("Panayots updated successfully.");
			db.close();
		});
	});
});

app.get('/findAll/:from/:to', function (req, res) {
	MongoClient.connect(uri, function (err, db) {
		if (err) {res.status(500).end(err);}
		else {
			db.collection('artists')
				.find({
					founded: {
						$gte: Number(req.params.from),
						$lte: Number(req.params.to)
					}
				})
				.sort({
					name: -1
				})
				.toArray(function (err, docs){
					if (err) {res.status(500).end(err);}
					else {
						res.status(200).json(docs);
					}
					db.close();
				});
		}
	});
});


app.get('/deleteAllHits', function (req, res) {
	MongoClient.connect(uri, function (err, db) {
		if (err) {res.status(500).end(err);}
		else {
			db.collection('albums').remove({
				name: /hits/i
			}, function(err, count){
				if (err) {res.status(500).end(err);}
				else {
					res.status(200).end(count + " albums deleted.");
				}
				db.close();
			});
		}
	});
});

app.get('/rock/:artist', function (req, res) {
	MongoClient.connect(uri, function (err, db) {
		if (err) {res.status(500).end(err);}
		else {
			db.collection('albums')
				.find({
					artist: new RegExp(req.params.artist, 'i'),
					genres: "rock"
				})
				.toArray(function (err, docs) {
					if (err) {res.status(500).end(err);}
					else {
						res.status(200).json(docs);
					}
					db.close();
				});
		}
	});
});

app.listen(config.port);
console.log("App listening to: " + config.url + ":" + config.port);