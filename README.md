# apusbuy
Apu's Buy project for Lab de desarrollo de aplicaciones web

#USAGE

npm install

node app.js

visit either of the following
- http://localhost:[$PORT]

if no $PORT variable is found, visit
http://localhost:3000/

#TESTING

To run a single test, run
mocha [file name]

To run a the overall test of a section, run the overallTest.js file. For example:

node test/database/overallTest.js

NOTE: Mongod should be running for the tests to work.

#SEEDING THE DATBASE

To add mock values to the database, simply run the file seed.js

./seed.js

#FOLDER STRUCTURE

	apusbuy
		|
		|__models -> Object representations of database collections.
		|		
		|__node_modules -> Node stuff.
		|
		|_public 
		|		|
		|		|_css -> Css files.
		|		|
		|		|_img -> Image files.
		|		|
		|		|_js 	-> Javascript files.
		|
		|_routes
		|		|_api.js 	 -> backend routing.
		|		|
		|		|_index.js -> frontend routing.
		|
		|_seeds
		|		|_[model name]Seed.js -> Seed specific for [model name].
		|		
		|_test
		|		|_database -> tests related to the database.
		|					|
		|					|_[model name]Test.js -> Test specific for [model name].
		|					|
		|					|_overallTest.js -> Runnable script that checks all tests in this directory.
		|
		|_views 	-> frontend view files.
		|
		|_ app.js -> main file. Run this to get server up and running.
		|
		|_seed.js -> seeding file. Adds mock values to the database.


