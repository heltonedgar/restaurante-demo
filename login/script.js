const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/payment-form', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a schema for the payment form data
const paymentFormSchema = new mongoose.Schema({
  nome: String,
  apelido: String,
  email: String,
  telefone: String,
  renovacaoInscricao: String,
  matricula: String,
  curso: String,
  modoPagamento: String,
  numeroMpesa: String
});

const PaymentForm = mongoose.model('PaymentForm', paymentFormSchema);

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false, // or 'STARTTLS'
  auth: {
    user: 'your-email@example.com',
    pass: 'your-email-password'
  }
});

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Handle form submission
app.post('/submit', (req, res) => {
  const paymentFormData = new PaymentForm(req.body);
  paymentFormData.save((err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error submitting form');
    } else {
      // Send confirmation email
      const mailOptions = {
        from: 'your-email@example.com',
        to: req.body.email,
        subject: 'Payment Form Submission',
        text: `Thank you for submitting the payment form, ${req.body.nome}!`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.send('Form submitted successfully!');
    }
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});