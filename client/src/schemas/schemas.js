import { string, object, ref } from 'yup';
import XRegExp from 'xregexp';

export const SignupSchema = object().shape({
    email: string()
        .email('This field should be a valid email address.'),
    // .matches(/^.{1,64}@/, 'The part before @ of the email can be maximum 64 characters.')
    // .matches(/^.*[a-z]+.*@/, 'This field should be a valid email address.'),
    role: string()
        .required('This field must not be empty'),
    password: string()
        .min(8, 'This field must be at least 8 characters long')
        .max(50, 'This field must be at most 50 characters long')
        .required('This field must not be empty'),
    confirmPassword: string()
        .required('This field must not be empty')
        .oneOf([ref('password'), null], 'Passwords must match'),
});

export const LoginSchema = object().shape({
    email: string()
        .email('This field should be a valid email address.'),
    // .matches(/^.{1,64}@/, 'The part before @ of the email can be maximum 64 characters.')
    // .matches(/^.*[a-z]+.*@/, 'This field should be a valid email address.'),
    password: string()
        .required('This field must not be empty')
});