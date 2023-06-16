const Joi = require('joi');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const UserDTO = require('../dto/user');
const JWTService = require('../services/JWTService');
const RefreshToken = require('../models/token');

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,50}$/;
const authController = {
    async register(req, res, next) {
        // 1. validate user inputs
        const userRegisterSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            name: Joi.string().max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.ref('password')
        });

        const {error} = userRegisterSchema.validate(req.body);

        // 2. if error in validation -> return error via middleware
        if (error) {
            return next(error);
        }

        // 3. if email or username is already registered -> return error 
        const {username, name, email, password} = req.body;

        try {
            const emailInUse = await User.exists({email});
            const usernameInUse = await User.exists({username});

            if (emailInUse) {
                const error = {
                    status : 409, // conflict status
                    message: 'Email already exists'
                }

                return next(error);
            }

            if (usernameInUse) {
                const error = {
                    status : 409, // conflict status
                    message: 'Username already exists'
                }

                return next(error);
            }

        } catch(error) {
            return next(error);
        }

        let user;
        // 4. password hash
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // 5. store user data in db
            const userToRegister = new User({
                username: username,
                email: email,
                password: hashedPassword,
                name: name
            });

            user = await userToRegister.save();
  
        } catch (error) {
            return next(error);
        }

        const accessToken = JWTService.signAccessToken({_id: user._id},'30m');
        const refreshToken = JWTService.signRefreshToken({_id: user._id},'60m');

        //store refresh token in database
        await JWTService.storeRefreshToken(refreshToken, user._id);

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true // decreases XSS Attacks vulnerability, increases security
        });

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });

        const userDto = new UserDTO(user);
        
        // 6. response send
        return res.status(201).json({user:userDto, auth: true});

    },
    async login(req, res, next) {
        // 1. validate user input
        // 2. if validation error, return error
        // 3. match username and password
        // 4. return response

        const userLoginSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            password: Joi.string().pattern(passwordPattern).required(),
        });

        const {error} = userLoginSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const {username, password} = req.body;

        let user;
        try {
            user = await User.findOne({username: username});

            const error = {
                status: 401, // unauthorized access or invalid credentials status
                message: 'Invalid username or password'
            }

            if(!user) {
                return next(error);
            }

            const match = await bcrypt.compare(password, user.password);

            if(!match) {
                return next(error);
            }

        

        } catch (error) {
            return next(error);
        }

        const accessToken = JWTService.signAccessToken({_id:user._id}, '30m');
        const refreshToken = JWTService.signRefreshToken({_id: user._id}, '60m');

        try {
            await JWTService.updateRefreshToken(refreshToken, user._id);
        } catch (error) {
            return next(error);
        }
        
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });

        const userDto = new UserDTO(user);
 
        return res.status(200).json({user: userDto, auth: true});
    },
    async logout(req, res, next) {
        // 1. delete refresh token from db
        const {refreshToken} = req.cookies;

        try {
            await RefreshToken.deleteOne({
                token: refreshToken
            });
        } catch (error) {
            return next(error);
        }

        // delete cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        //2. response
        res.status(200).json({user: null, auth: false});
    },
    async refresh(req, res, next) {

        const originalRefreshToken = req.cookies.refreshToken;
        
        let id;
        try {
            id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
        } catch (err) {
            const error = {
                status: 401,
                message: 'Unauthorized'
            }
            return next(error);
        }


        try {
            const exist = await RefreshToken.findOne({userId: id, token: originalRefreshToken});

            if(!exist) {
                const error = {
                    status: 401,
                    message: 'Unauthorized'
                }
                return next(error);
            }

        } catch (error) {
            return next(error);
        }

        try {
            const accessToken = JWTService.signAccessToken({_id: id},'30m');
            const refreshToken = JWTService.signRefreshToken({_id: id},'60m');
            
            await RefreshToken.updateOne({userId: id}, {token: refreshToken});

            res.cookie('accessToken', accessToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true // decreases XSS Attacks vulnerability, increases security
            });
    
            res.cookie('refreshToken', refreshToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true
            });
        } catch (error) {
            return next(error);
        }

        const user = await User.findOne({_id : id});
        const userDto = new UserDTO(user);

        return res.status(200).json({user: userDto, auth: true});



    }
};


module.exports = authController;