const express = require('express');
const movieController = require('../controllers/movie');
const router = express.Router();

const {verify, verifyAdmin} = require("../auth");

router.post('/addMovie', verify,verifyAdmin, movieController.addMovie);
router.get('/getMovies', verify, movieController.getMovies)
router.get('/getMovie/:id', verify, movieController.getMovie)

module.exports = router;