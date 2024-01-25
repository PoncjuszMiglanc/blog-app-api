const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// @desc    Register user, chcę potem to przepisać na async/await i z metodą create()
// @route   POST /register
// @access  Public
exports.register = async (req, res, next) => {
	try {
		const { userName, email, password } = req.body;

		const existingUser = await User.find({ $or: [{ userName }, { email }] });

		if (existingUser.length > 0) {
			return res.status(409).json({
				message: 'użytkownik o podanym loginie lub mailu już istnieje',
				user: existingUser,
			});
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const user = new User({
			username: userName,
			email: email,
			password: hashedPassword,
		});

		const result = await user.save();

		res.status(201).json({
			wiadomość: 'zarejestrowano użytkownika',
			user: result,
		});
	} catch (error) {
		console.lor(err);
		res.status(500).json({ wiadomość: 'Wystąpił błąd podczas rejestracji' });
	}
};

// @desc    Login user
// @route   POST /login
// @access  Public
exports.login = async (req, res, next) => {
	try {
		const { email, pass } = req.body;
		const user = await User.findOne({ email: email });

		if (!user) {
			return res
				.status(404)
				.json({ wiadomość: 'nie ma takiego użytkownika w bazie danych' });
		}

		const passwordIsOk = await bcrypt.compare(pass, user.password);

		if (!passwordIsOk) {
			return res.status(401).json({ wiadomość: 'Podane hasło jest błędne' });
		}

		const token = jwt.sign({ id: user._id }, 'dfgfgdfhfghfghfgh', {
			expiresIn: '2h',
		});

		res
			.cookie('jwt', token, { maxAge: 3 * 60 * 60 * 1000 })
			.status(200)
			.json({ wiadomość: 'Zalogowano poprawnie', userId: user._id });
	} catch (error) {
		console.log(error);
		res.status(500).json({ wiadomość: 'błąd podczas logowania' });
	}
};

// @desc    Login user
// @route   POST /logout
// @access  Public
exports.logout = (req, res, next) => {
	res.cookie('jwt', '', {
		httpOnly: true,
		expires: new Date(0),
	});
	res.status(200).json({ message: 'Wylogowano' });
};

exports.getUserData = async (req, res) => {
	const { id } = req.params;
	try {
		const userData = await User.findById(id);
		//potem jeszcze z drugiego modelu weźmiemy posty.

		if (!userData) {
			return res
				.status(404)
				.json({ message: 'nie znaleziono takiego użytkownika' });
		}

		res.status(200).json({ message: 'oto dane użytkownika :', userData });
	} catch (err) {
		res.status(500).json({ message: 'wystąpił błąd' });
		console.log(err);
	}
};

exports.updateUserData = async (req, res) => {
	const { id } = req.params;
	const { username, email, password, about } = req.body;

	try {
		let updatedFields = {
			username,
			email,
			about,
		};

		if (password) {
			const oldUser = await User.findById(id);
			checkPassword = await bcrypt.compare(password, oldUser.password);

			if (!checkPassword) {
				const hashedPass = await bcrypt.hash(password, 12);
				updatedFields.password = hashedPass;
			}
		}

		if (req.file) {
			const oldUser = await User.findById(id);

			if (oldUser.avatar) {
				const oldUserImagePath = path.join('images', oldUser.avatar);

				if (fs.existsSync(oldUserImagePath)) {
					fs.unlinkSync(oldUserImagePath);
				} else {
					console.log('nie ma takiego obrazka', oldUser.avatar);
				}
			}

			updatedFields.avatar = req.file.filename;
		}

		const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
			new: true,
		});

		if (!updatedUser) {
			return res
				.status(404)
				.json({ message: 'nie znaleziono użytkownika w bazie danych ' });
		}

		res.status(200).json({
			message: 'udało się zaktualizować dane użytkownika',
			dane: updatedUser,
			imageInfo: req.file,
		});
	} catch (err) {
		res
			.status(500)
			.json({ message: 'błąd podczas aktualizacji danych', error: err });
	}
};

exports.validateUserData = async (req, res) => {
	const { login, password } = req.body;
	const { id } = req.params;

	try {
		const user = await User.findById(id);

		if (!user) {
			return res
				.status(404)
				.json({ message: 'nie znaleziono takiego użytkownika w bazie' });
		}

		const isValidPassword = await bcrypt.compare(password, user.password);

		if (isValidPassword && login === user.username) {
			res.status(200).json({
				message: 'użytkownik jest prawidłowy',
				authorized: true,
			});
		} else {
			return res.status(401).json({ message: 'brak autoryzacji' });
		}
	} catch (err) {
		res
			.status(500)
			.json({ message: 'błąd podczas autoryzacji użytkownika', error: err });
	}
};

exports.deleteUserData = async (req, res) => {
	const { id } = req.params;

	try {
		//jeszcze usuwanie obrazka
		const deletedUser = await User.findByIdAndDelete(id);
		if (!deletedUser) {
			return res
				.status(404)
				.json({ message: 'nie znaleziono podanego użytkownika' });
		} else {
			res.status(200).json({ message: 'usunięto użytkownika', deletedUser });
		}
	} catch (err) {
		res.status(500).json({
			message: 'wystąpił błąd podczas usuwania użytkownika',
			error: err,
		});
	}
};
