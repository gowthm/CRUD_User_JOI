const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const adminValidation = require('../auth/token.validation');
const randomstring = require('randomstring');
const userSchema = require('../model/user.model');
const userValidation = require('../auth/req.validation');

// User Login By UserEmail and Password

router.post('/login', async function (req, res) {
    const reqValidation = userValidation(req.body, 'login')
    if (reqValidation.error) {
        const errorRes = {
            status: 0,
            message: reqValidation.error.details[0]['message']
        }
        return res.status(400).send(errorRes)
    }
    let userName = req.body.email;
    let password = req.body.password;
    const adminUser = await userSchema.findOne({ 'email': userName, 'password': password }).exec();
    if (!adminUser) {
        res.send('Cannot found the user');
    }
    if (adminUser) {
        const token = await jwt.sign({ email: userName, role: adminUser.userRole }, '!!@#$%SWQ', { expiresIn: '24h' });
        if (token) {
            const successRes = {
                message: 'Successfully get token',
                tokenData: token,
            }
            return res.status(200).send(successRes);
        }
    }
});

// Add User Details 

router.post('/add', adminValidation, async function (req, res) {
    if (req.userData.role == "admin") {

        const reqValidation = userValidation(req.body, 'add')
        if (reqValidation.error) {
            const errorRes = {
                status: 0,
                message: reqValidation.error.details[0]['message']
            }
            return res.status(400).send(errorRes)
        }
        const UserSchema = new userSchema
        UserSchema.name = req.body.name;
        UserSchema.email = req.body.email;
        UserSchema.userId = randomstring.generate(5);
        UserSchema.phoneNo = req.body.phoneNo;
        UserSchema.address = req.body.address;
        UserSchema.userRole = req.body.userRole;
        UserSchema.password = req.body.password;
        UserSchema.save(function (err, data) {
            if (err) {
                const errRes = {
                    status: 0,
                    message: err._message,
                }
                return res.status(400).send(errRes);
            } else {
                const successRes = {
                    status: 1,
                    message: 'successfully added user.',
                }
                return res.status(200).send(successRes);
            }
        });
    } else {
        const errRes = {
            status: 1,
            message: 'Admin user only allow to save',
        }
        return res.status(200).send(errRes);
    }

})

// Update User Details

router.put('/update/:id', adminValidation, async function (req, res) {
    if (req.userData.role == "admin") {
        const find = await userSchema.findOne({ 'userId': req.params.id }).exec();
        if (find) {
            const reqValidation = userValidation(req.body, 'update')
            if (reqValidation.error) {
                const errorRes = {
                    status: 0,
                    message: reqValidation.error.details[0]['message']
                }
                return res.status(400).send(errorRes)
            }
            let temp = {};
            for (let [key, value] of Object.entries(req.body)) {
                temp[key] = value
            }
            const updateRes = await userSchema.updateOne({ userId: req.params.id },temp).exec();
            if (updateRes) {
                const successRes = {
                    status: 1,
                    message: 'successfully updated',
                }
                return res.status(200).send(successRes);
            }
        } else {
            const errRes = {
                status: 0,
                message: 'Cannot find User ID',
            }
            return res.status(400).send(errRes);
        }
    } else {
        const errRes = {
            status: 1,
            message: 'Admin user only allow to update',
        }
        return res.status(200).send(errRes);
    }


})

// Get User Details By Id

router.get('/getUserById/:id', adminValidation, async function (req, res) {
    if (req.userData.role == "admin") {
        const userId = req.params.id;
        if (userId) {
            const findDetail = await userSchema.findOne({ 'userId': req.params.id }).exec();
            if (findDetail) {
                const successRes = {
                    status: 1,
                    message: 'successfully get user details',
                    data: findDetail,
                }
                return res.status(200).send(successRes);
            } else {
                const errRes = {
                    status: 0,
                    message: 'Cannot find user ID',
                }
                return res.status(400).send(errRes);
            }
        }

    } else {
        const errRes = {
            status: 1,
            message: 'Admin user only allow to get user',
        }
        return res.status(200).send(errRes);
    }
})

// Get All User Details OR Pagination With LIMIT AND OFFSET

router.get('/getAllUser', adminValidation, async function (req, res) {
    if (req.userData.role == "admin") {
        let limitData = req.body.limit;
        let offsetData = req.body.offset;
        const reqValidation = userValidation(req.body, 'getall')
        if (reqValidation.error) {
            const errorRes = {
                status: 0,
                message: reqValidation.error.details[0]['message']
            }
            return res.status(400).send(errorRes)
        }
        const findDetail = await userSchema.find().limit(limitData).skip(offsetData).exec();
        if (findDetail) {
            const successRes = {
                status: 1,
                message: 'successfully get user details',
                data: findDetail,
            }
            return res.status(200).send(successRes);
        } else {
            const errRes = {
                status: 0,
                message: 'Cannot find user ID',
            }
            return res.status(400).send(errRes);
        }
    } else {
        const errRes = {
            status: 1,
            message: 'Admin user only allow to get user',
        }
        return res.status(200).send(errRes);
    }
})


// Delete User By ID

router.delete('/deleteUser/:id', adminValidation, async function (req, res) {
    if (req.userData.role == "admin") {
        const findUser = await userSchema.findOne({ 'userId': req.params.id }).exec();
        if (findUser) {
            const deleteUser = await userSchema.deleteOne({ 'userId': req.params.id }).exec();
            if (deleteUser) {
                const successRes = {
                    status: 1,
                    message: 'successfully deleted user',
                }
                return res.status(200).send(successRes);
            }
        } else {
            const errRes = {
                status: 0,
                message: "Cannot find user ID"
            }
            return res.status(400).send(errRes)
        }
    } else {
        const errRes = {
            status: 1,
            message: 'Admin user only allow to delete user',
        }
        return res.status(200).send(errRes);
    }

})

// Search User By Search Data

router.get('/search', adminValidation, async function (req, res) {
    if (req.userData.role == "admin") {
        const searchData = req.body.searchData;
        const userDetail = await userSchema.findOne({
            $or: [{ 'name': { $regex: '.*' + searchData + '.*' } },
            typeof searchData == 'number' ? { 'phoneNo': searchData } : { 'userId': { $regex: '.*' + searchData + '.*' } }]
        }).exec();
        if (userDetail) {
            const successRes = {
                status: 1,
                message: 'successfully get User',
                data: userDetail,
            }
            return res.status(200).send(successRes);
        }
        else {
            const errRes = {
                status: 1,
                message: 'successfully get user',
                data: [],
            }
            return res.status(200).send(errRes);
        }
    } else {
        const errRes = {
            status: 1,
            message: 'Admin user only allow to get details',
        }
        return res.status(200).send(errRes);
    }

})

module.exports = router;





