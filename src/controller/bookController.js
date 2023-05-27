const connection = require("../db/connection");

exports.createBook = async (req, res) => {
    try {
        let { book_title, book_author, book_genre, book_price } = req.body;

        let createdBook = {
            book_title: book_title,
            book_author: book_author,
            book_genre: book_genre,
            book_price: book_price
        };

        const query = "INSERT INTO books (book_title,book_author, book_genre, book_price) VALUES (?, ?, ?, ?)";
        await connection.promise().query(query, [book_title, book_author, book_genre, book_price]);
        return res.status(201).json({
            status: true,
            data: createdBook,
            message: "Book created successfully",
        });
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message });
    }
};


exports.getBooks = async (req, res) => {
    try {
        const rows = await connection.promise().query("SELECT * FROM books");
        res.status(200).json({ status: true, data: rows });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false, error: "Internal server error", message: error.message,
        });
    }
};

