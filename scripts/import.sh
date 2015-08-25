#!/bin/sh

echo "\nImporting jokes.json\n"
mongoimport -d jokes -c jokes --jsonArray jokes.json --verbose

echo "\nImporting user.json\n"
mongoimport -d jokes -c users --jsonArray users.json --verbose
