import { IUserModel } from './../models/user.model';
import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { IAuthor } from '../models/author.model';
import Logging from '../library/logging';

export const ValidateJoi = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);

            next();
        } catch (error) {
            Logging.error(error);

            return res.status(422).json({ error });
        }
    };
};

export const Schemas = {
    author: {
        create: Joi.object<IAuthor>({
            name: Joi.string().required()
        }),
        update: Joi.object<IAuthor>({
            name: Joi.string().required()
        })
    },
    auth: {
        signUp: Joi.object<IUserModel>({
            username: Joi.string().required(),
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            roles: Joi.array().items(Joi.string())
        }),
        signIn: Joi.object<IUserModel>({
            username: Joi.string().required(),
            password: Joi.string().required()
        })
    }
};
