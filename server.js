// call the packages needed for the service
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/movie'); // connect to the database
var Movie     = require('./app/models/movie');

// ROUTES FOR THE MOVIE API
// =============================================================================

// create the router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Everything looks right.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to movies database!' });	
});

// on routes that end in /movies
// ----------------------------------------------------
router.route('/movies')

	// create a movie (accessed at POST http://localhost:8080/api/movies)
	.post(function(req, res) {
		
		var movie = new Movie();		// create a new instance of the Model model
		movie.title = req.body.title;
		movie.description = req.body.description;
		movie.producer = req.body.producer;
		movie.actors = req.body.actors;  // set the movies name (comes from the request)
		
		movie.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Movie created!' });
		});

		
	})

	// get all the movies (accessed at GET http://localhost:8080/api/movies)
	.get(function(req, res) {
		Movie.find(function(err, movies) {
			if (err)
				res.send(err);

			res.json(movies);
		});
	});

// on routes that end in /movies/actor/:actor_name
// ----------------------------------------------------
router.route('/movies/actor/:actor_name')

	// get the movie with that actor name
	.get(function(req, res) {
		var actorName = new RegExp(req.params.actor_name, 'i');
		Movie.find({actors: actorName}, function(err, movie) {
			if (err)
				res.send(err);
			res.json(movie);
		});
	})


// on routes that end in /movies/:movie_id
// ----------------------------------------------------
router.route('/movies/:movie_id')

	// get the movie with that id
	.get(function(req, res) {
		Movie.findById(req.params.movie_id, function(err, movie) {
			if (err)
				res.send(err);
			res.json(movie);
		});
	})

	// update the movie with this id
	.put(function(req, res) {
		Movie.findById(req.params.movie_id, function(err, movie) {

			if (err)
				res.send(err);

			movie.title = req.body.title;
			movie.description = req.body.description;
			movie.producer = req.body.producer;
			movie.actors = req.body.actors;
			
			movie.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Movie updated!' });
			});

		});
	})

	// delete the movie with this id
	.delete(function(req, res) {
		Movie.remove({
			_id: req.params.movie_id
		}, function(err, movie) {
			if (err)
				res.send(err);

			res.json({ message: 'Movie successfully deleted' });
		});
	});


// REGISTER THE ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Movie REST API is running on port  ' + port +'/api');
