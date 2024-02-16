const {Authors, Book, AuthorBooks} = require('../models')

//
module.exports.viewAll = async function(req, res){
    const authors = await Authors.findAll();
    res.render('author/view_all', {authors});
}

// //
module.exports.viewProfile = async function(req, res){
    const author = await Authors.findByPk(req.params.id, {
        include: 'books'
    });
    const books = await Book.findAll();
    let availableBooks = [];
    for (let i=0; i<books.length; i++){
        if (!authorHasBook(author, books[i])){
            availableBooks.push(books[i]);
        }
    }
    res.render('author/profile', {author, availableBooks})
}

// //
module.exports.renderAddForm = function(req, res){
    const author = {
        FirstName: '',
        LastName: '',
        dateOfBirth: '',
    }
    res.render('author/add', {author});
}

// //
module.exports.addAuthor = async function(req, res){
    const author = await Authors.create({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        dateOfBirth: req.body.dateOfBirth,
    });
    res.redirect(`/authors/profile/${author.id}`);
}

// //
module.exports.renderEditForm = async function(req, res){
    const author = await Authors.findByPk(req.params.id);
    res.render('author/edit', {author});
}

// //
module.exports.updateAuthor = async function(req, res){
    const author = await Authors.update({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        dateOfBirth: req.body.dateOfBirth,
    }, {
        where: {
            id: req.params.id
        }
    });
    res.redirect(`/authors/profile/${req.params.id}`);
}

// //
module.exports.deleteAuthor = async function(req, res) {
    await Authors.destroy({
        where: {
            id: req.params.id
        }
    });
    res.redirect('/authors');
}

module.exports.assignAuthor = async function (req, res) {

        await AuthorBooks.create({
            author_id: req.params.authorId,
            book_id: req.body.book
        })
        res.redirect(`/authors/profile/${req.params.authorId}`);
}

function authorHasBook(author, book){
    for (let i=0; i<author.books.length; i++){
        if (book.id === author.books[i].id){
            return true
        }
    }
    return false
}

module.exports.removeBook = async function(req, res){
    await AuthorBooks.destroy({
        where: {
            author_id: req.params.authorId,
            book_id: req.params.bookId
        }
    });
    res.redirect(`/authors/profile/${req.params.authorId}`)

}