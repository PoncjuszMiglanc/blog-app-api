const Post = require('../models/post');
const fs = require('fs');
const path = require('path');

//  GET /posts
//  getting all posts
exports.getPosts = (req, res, next) => {
	Post.find()
		.then((result) => {
			res.status(200).json({
				wiadomosc: 'Cześć to są posty:',
				posty: result,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

//  GET /posts/:id
//  getting single post
exports.getPost = (req, res, next) => {
	const id = req.params.id;
	Post.findById(id)
		.then((result) => {
			res.status(200).json({ message: 'mamy posta', post: result });
		})
		.catch((err) => {
			console.log(err);
		});
};

//  POST /post
//  creating single post
exports.postPost = (req, res, next) => {
	const author = req.user.username;
	const { category, title, lead, content } = req.body;
	const image = req.file.filename;

	const post = new Post({
		category,
		title,
		lead,
		author,
		image,
		content,
	});
	post
		.save()
		.then((result) => {
			console.log(result);
			res.status(201).json({
				wiadomość: 'Utworzono posta',
				post: result,
				user: author,
			});
		})
		.catch((error) => {
			console.log(error);
		});
};

//  DELETE /deletepost
//  deleting single post
exports.deletePost = async (req, res, next) => {
	const postId = req.body.id;

	if (!postId) {
		return res.status(400).json({ error: 'brak id posta w requeście' });
	}

	try {
		const oldPost = await Post.findById(postId);

		if (!oldPost) {
			res.status(404).json({ message: 'nie udało się odnaleźć posta' });
		}

		const deletedPost = await Post.findByIdAndDelete(postId);

		if (!deletedPost) {
			res.status(404).json({ message: 'nie udało się usunąć posta' });
		}

		const oldImagePath = path.join('images', oldPost.image);

		if (fs.existsSync(oldImagePath)) {
			fs.unlinkSync(oldImagePath);
			console.log('udało się usunąc obrazek');
		} else {
			console.log('nie udało się odnaleźć obrazka');
		}

		res.json({ wiadomośc: 'posta usunięto poprawnie' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'nie udało się usunąc posta' });
	}
};

//  PUT /post/update/:id
//  updating single post
exports.updatePost = async (req, res, next) => {
	try {
		const id = req.params.id;
		const { category, title, lead, author, content } = req.body;

		let updatedFields = {
			category,
			title,
			lead,
			author,
			content,
		};

		if (req.file) {
			const oldPost = await Post.findById(id);
			const oldImageName = oldPost.image;

			if (oldImageName) {
				const oldImagePath = path.join('images', oldImageName);

				if (fs.existsSync(oldImagePath)) {
					fs.unlinkSync(oldImagePath);
					console.log(`usunięto stary obrazek ${oldImageName}`);
				} else {
					console.log(`nie znaleziono obrazka ${oldImageName}`);
				}
			}

			updatedFields.image = req.file.filename;
		}

		const updatedPost = await Post.findByIdAndUpdate(id, updatedFields, {
			new: true,
		});

		if (!updatedPost) {
			return res
				.status(404)
				.json({ error: 'Post o podanym id nie istnieje w bazie danych' });
		}

		res.status(200).json({
			wiadomość: 'Post został pomyślnie zaktualizowany',
			post: updatedPost,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ wiadomość: 'Wystąpił błąd podczas aktualizacji' });
	}
};
