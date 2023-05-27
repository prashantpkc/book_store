const connection = require("../db/connection")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.createCustomer = async (req, res) => {
    try {
        let { customer_name, customer_email, customer_password } = req.body

        let createdCustomer = {
            customer_name: customer_name,
            customer_email: customer_email,
            customer_password: customer_password
        }

        const query = "insert into customers(customer_name,customer_email,customer_password)values(?,?,?)";
        await connection.promise().query(query, [customer_name, customer_email, customer_password])

        return res.status(201).json({
            status: true,
            data: createdCustomer,
            message: "customer created successfully",
        });
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message });
    }

}

exports.login = async (req, res) => {
    try {
        const { customer_email, customer_password } = req.body;

        if (!customer_email) return res.status(400).json({ status: false, message: "Plz provide email" });

        if (!customer_password) return res.status(400).json({ status: false, message: "Plz provide password" });

        const query = "select * from customers where customer_email = ?";

        const [rows] = await connection.promise().query(query, [customer_email]);

        if (rows.length == 0) return res.status(404).json({ status: false, message: "user not found" });

        const user = rows[0];
        const passwordMatch = bcrypt.compare(customer_password, user.customer_password);

        if (!passwordMatch) return res.status(401).json({ status: false, message: "Password is incorrect" });
        let token = jwt.sign({ customer_email: customer_email }, "secret_key");

        return res.status(200).send({ status: true, data: token, message: "user successfully logeed in" });
    } catch (error) {
        return res.status(500).json({ status: true, error: error.message });
    }
};


