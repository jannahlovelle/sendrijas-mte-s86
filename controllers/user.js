const User = require("../models/User");
const bcrypt = require("bcryptjs"); // <<
const auth = require("../auth");
console.log(auth);

module.exports.loginUser = (req, res) => {
    return User.findOne({ email: req.body.email })
    .then((result) => {

        if (!result) {
            return res.status(401).send({
                message: "Invalid email or password"
            });
        }

        if (bcrypt.compareSync(req.body.password, result.password)) {
            return res.status(200).send({
                access: auth.createAccessToken(result)
            });
        }

        return res.status(401).send({
            message: "Invalid email or password"
        });

    })
    .catch(err => {
        return res.status(500).send({
            message: "Internal server error",
            error: err.message
        });
    });
}


module.exports.registerUser = (req, res) => {
    return User.findOne({ email: req.body.email })
    .then((result) => {
        if (result) {
            return res.status(409).send({
                message: "Email already exists"
            });
        }
        let newUser = new User({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            isAdmin: req.body.isAdmin,
        });
        return newUser
            .save()
            .then((user) => {
                return res.status(201).send({
                    message: "Registered Successfully"
                });
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).send({
                    message: "Register user failed"
                });
            });
    })
    .catch((error) => {
        console.log(error);
        return res.status(500).send({
            message: "Internal server error"
        });
    });
};

module.exports.checkEmailExists = (req, res) => {
    return User.findOne({ email: req.body.email })
    .then(result => {
        return res.send(result !== null);
    });
}

module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
    .then(user => {
        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }
        user.password = undefined;

        return res.status(200).send(user);
    })
    .catch(err => {
        return res.status(500).send({
            message: "Internal server error"
        });
    });
};