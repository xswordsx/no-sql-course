'use strict';
/*
	Направете следните неща чрез заявки в конзолата:
	1. Въведете поне 4 албума и 3 изпълнителя.
	2. Променете всички албуми на Panayot Panayotov като им добавите поле "favorite" със стойност true и “pop” в списъка със жанрове.
	3. Намерете всички изпълнители, създадени между 2001 и 2011, сортирани в обратен (Z->A) ред по име.
	4. Изберете си един изпълнител. Намерете броя на албумите с жанр “rock”, които той има.
	5. Изтрийте всички албуми, които съдържат “hits” в името си, независимо дали е с малки или големи букви.
 */

var artists = require('./artists.json');

if(artists.length < 3) {
	console.error('artists.json must have at least 3 artists');
	process.exit(-1);
}

var albums = require('./albums.json');

if(albums.length < 4) {
	console.error('albums.json must have at least 4 albums');
	process.exit(-2);
}
var config = require('./config.json');
var url = config.url;

function initializeDatabase(name) {
	var mongo = new Mongo(url);
	var db = mongo.getDB(name);

	db.createCollection('artists');

	db.createCollection('albums');
};

function populateDatabase(name) {
	var mongo = new Mongo(url);
	var db = mongo.getDB(name);
	db.artists.insert(artists);
	db.albums.insert(albums);
};

function modifyPanayot(collectionName) {
	var mongo = new Mongo(url);
	var db = mongo.getDB(collectionName);
	db.albums.update(
		{"name": /Panayot Panayotov/i},
		{
			$set: {
				"favorite": true
			},
			$push: {
				"genres": "pop"
			}
		},
		{multi: true});
};

function findAll2001_2011(collectionName) {
	var mongo = new Mongo(url);
	var db = mongo.getDB(collectionName);
	db.artists
		.find({
			"founded": {
				$gte: 2001,
				$lte: 2011
			}
		})
		.sort({
			"name": -1
		});
};

function deleteAllHits(collectionName) {
	var mongo = new Mongo(url);
	var db = mongo.getDB(collectionName);
	db.albums.remove({"name": /hits/i});
};

