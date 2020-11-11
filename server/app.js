const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const HttpError = require('./models/http-error');
const studentRoutes = require('./routes/student-routes');
const tpoRoutes = require('./routes/tpo-routes');
const adminRoutes = require('./routes/admin-routes');
const sharedRoutes = require('./routes/shared-routes');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

// Push the routes here
app.use('/api/student', studentRoutes);
app.use('/api/tpo', tpoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', sharedRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

mongoose
  .connect(
    `mongodb+srv://Ethan:090909@firstcluster.1ae0u.mongodb.net/placement-prediction?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected");
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });