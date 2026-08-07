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

module.exports.updateMovie = (req, res) => {
	const updates = {}

	if (req.body.title !== undefined) updates.title = req.body.title;
	if (req.body.director !== undefined) updates.director = req.body.director;
	if (req.body.year !== undefined) updates.year = req.body.year;
	if (req.body.description !== undefined) updates.description = req.body.description;
	if (req.body.genre !== undefined) updates.genre = req.body.genre;

	return Movie.findByIdAndUpdate(req.params.id, updates, {
		returnDocument: "after"
	})
	.then(movie => {
		if (!movie){
			return res.status(404).send({
				message: "Movie not found"
			});
		}

		return res.status(200).send({
			message: "Movie updated successfully",
			updatedMovie: movie
		})
	})
	.catch(err => errorHandler(err, req, res));
}

module.exports.deleteMovie = (req, res) => {
	return Movie.findByIdAndDelete(req.params.id)
	.then(movie => {
		if (!movie){
			return res.status(404).send({
				message: "Movie not found"
			});
		}

		return res.status(200).send({
			message: "Movie deleted successfully"
		})
	})
}

