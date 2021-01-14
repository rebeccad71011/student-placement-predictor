const express = require('express');

const adminController = require('../controllers/admin-controller');
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.use((req, res, next) => {
    res.locals.accessRole = "admin";
    checkAuth(req, res, next);
});

router.get('/users', adminController.getUsers);

router.post('/users/new', adminController.addUsers);

router.post('/users/update/:uid', adminController.updateUser);

router.delete('/users/delete/:uid', adminController.deleteUser);

router.get('/studentdetails', adminController.getStudentDetails);

router.post('/studentdetails/update/:did', adminController.updateStudentDetails);

router.delete('/studentdetails/delete/:did', adminController.deleteStudentDetails);

module.exports = router;
