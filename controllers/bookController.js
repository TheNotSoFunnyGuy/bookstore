const {Book, Authors, AuthorBooks} = require('../models')
const genres = ['Autobiography', 'Fiction', 'Novel'].sort()

//
module.exports.viewAll = async function(req, res){
    const books = await Book.findAll();
    res.render('books/view_all', {books});
}

//
module.exports.viewProfile = async function(req, res){
    const book = await Book.findByPk(req.params.id, {
        include: 'authors'
    });
    const authors = await Authors.findAll();
    let availableAuthors = [];
    for (let i=0; i<authors.length; i++){
        if (!bookHasAuthor(book, authors[i])){
            availableAuthors.push(authors[i])
        }
    }
    res.render('books/profile', {book, availableAuthors})
}

//
module.exports.renderAddForm = function(req, res){
    const book = {
        title: '',
        author1: '',
        publisher: '',
        genre: genres[0],
        numberOfPages: '',
        coverImage: '',
        description: ''
    }
    res.render('books/add', {book, genres});
}

//
module.exports.addBook = async function(req, res){
    const book = await Book.create({
        title: req.body.title,
        author1: req.body.author1,
        publisher: req.body.publisher,
        genre: req.body.genre,
        numberOfPages: req.body.numberOfPages,
        coverImage: req.body.coverImage,
        description: req.body.description
    });
    res.redirect(`/books/profile/${book.id}`);
}

//
module.exports.renderEditForm = async function(req, res){
    const book = await Book.findByPk(req.params.id);
    res.render('books/edit', {book, genres});
}

//
module.exports.updateBook = async function(req, res){
    const book = await Book.update({
        title: req.body.title,
        author1: req.body.author1,
        publisher: req.body.publisher,
        genre: req.body.genre,
        numberOfPages: req.body.numberOfPages,
        coverImage: req.body.coverImage,
        description: req.body.description
        }, {
        where: {
            id: req.params.id
        }
        });
    res.redirect(`/books/profile/${req.params.id}`);
}

//
module.exports.deleteBook = async function(req, res){
    await Book.destroy({
        where: {
            id:req.params.id
        }
        });
    res.redirect('/books');
}

module.exports.assignAuthor = async function(req, res){
    await AuthorBooks.create({
        author_id: req.body.author,
        book_id: req.params.bookId
    });
    res.redirect(`/books/profile/${req.params.bookId}`)
}

function bookHasAuthor( book, author){
    for (let i=0; i<book.authors.length; i++){
        if (author.id === book.authors[i].id){
            return true
        }
    }
    return false
}

module.exports.removeAuthor = async function(req, res){
    await AuthorBooks.destroy({
        where: {
            book_id: req.params.bookId,
            author_id: req.params.authorId
        }
    });
    res.redirect(`/books/profile/${req.params.bookId}`);
}