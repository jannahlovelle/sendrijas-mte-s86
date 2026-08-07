const Movie = require('../models/Movie');
const auth = require('../auth');
console.log(auth);

const {errorHandler} = auth;

module.exports.addMovie = (req, res) => {
	if (!req.user.isAdmin){
		return res.status(403).send({
			message: "User is not authorized to execute this action"
		})
	}

	let newMovie = new Movie({
		title: req.body.title,
		director: req.body.director,
		year: req.body.year,
		description: req.body.description,
		genre: req.body.genre
	})

	return newMovie.save()
	.then(movie => {
		return res.status(201).send(movie);
	})
	.catch(error => errorHandler(error, req, res));
}

module.exports.getMovies = (req, res) => {
	return Movie.find()
	.then (movies => {
		if (movies.length > 0){
			return res.status(200).send({movies});
		}
		return res.status(404).send({
			message: 'Movies is empty or not found'
		})
	})
	.catch(error => errorHandler(error, req, res));
}

module.exports.getMovie = (req, res) => {
	return Movie.findById(req.params.id)
	.then(movie => {
		if (!movie){
			return res.status(404).send({
                message: "Movie not found"
            });
		}

		return res.status(200).send(movie);
	})
	.catch(err => {
        return res.status(500).send({
            message: "Internal server error"
        });
    });
}