const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// CONNECTION STRING: 'mongo-db' is the service name we will define in Docker Compose later
const MONGO_URI = "mongodb://mongo-db:27017/contacts";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Database Schema
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});
const Contact = mongoose.model("Contact", ContactSchema);

// API Routes
app.get("/contacts", async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

app.post("/contacts", async (req, res) => {
  const newContact = new Contact(req.body);
  await newContact.save();
  res.json(newContact);
});

app.delete("/contacts/:id", async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(5000, () => console.log("Server running on port 5000"));
