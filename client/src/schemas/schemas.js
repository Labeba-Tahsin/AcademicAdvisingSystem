import { string, object, ref } from 'yup';
import XRegExp from 'xregexp';

export const SignupSchema = object().shape({
    email: string()
        .email('This field should be a valid email address.')
        .required('This field must not be empty'),
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

export const PasswordSchema = object().shape({
    email: string()
        .email('This field should be a valid email address.')
        .required('This field must not be empty'),
    password: string()
        .min(8, 'This field must be at least 8 characters long')
        .max(50, 'This field must be at most 50 characters long')
        .required('This field must not be empty'),
    confirmPassword: string()
        .required('This field must not be empty')
        .oneOf([ref('password'), null], 'Passwords must match'),
});

export const ProfileSchema = object().shape({
    id: string()
        .required('This field must not be empty'),
    name: string()
        .required('This field must not be empty'),
    role: string()
        .required('This field must not be empty')
});

export const LoginSchema = object().shape({
    email: string()
        .required('This field must not be empty'),
    password: string()
        .required('This field must not be empty')
});

export const SearchSchema = object().shape({
    student_id: string()
        .required('This field must not be empty')
        .matches(/^[0-9\+]*$/, 'This field only contains digits')
});