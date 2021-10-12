import React from 'react'
import { useHistory } from "react-router-dom";
import { SignupSchema } from '../schemas/schemas';
import { Form, Formik, Field, ErrorMessage, FieldArray } from "formik";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    return (
        <div className="container-fluid bg-green">
            <div className="row">
                <div className="col-md-12">
                    <div className="signup-form">
                        <h1 className="text-dark">Sign Up</h1>
                        <p>Please fill in this form to create an account!</p>
                        <Formik
                            initialValues={{ email: '', role: '', password: '', confirmPassword: '' }}
                            validationSchema={SignupSchema}
                            onSubmit={(values, actions) => {
                                axios.post('/api/users', values)
                                    .then((x) => {
                                        toast.success(x.data.message, {
                                            position: "top-right",
                                            autoClose: 5000,
                                            hideProgressBar: false
                                        });
                                        actions.resetForm();


                                    })
                                    .catch((err) => {
                                        toast.error(err.response.data, {
                                            position: "top-right",
                                            autoClose: 5000,
                                            hideProgressBar: false
                                        });

                                    })
                                    .finally(() => {
                                        actions.setSubmitting(false);
                                    });

                            }}
                        >
                            {props => (
                                <Form onSubmit={props.handleSubmit}>
                                    <Field type="email" className="form-control" name="email" placeholder="Email" />
                                    <div className="invalid-feedback">
                                        <ErrorMessage
                                            name="email"
                                        />
                                    </div>
                                    <Field className="form-control" name="role" as="select">
                                        <option value="" disabled>--Select role--</option>
                                        <option value="student">Student</option>
                                        <option value="faculty">Faculty</option>
                                    </Field>
                                    <div className="invalid-feedback">
                                        <ErrorMessage
                                            name="role"
                                        />
                                    </div>
                                    <Field type="password" className="form-control" name="password" placeholder="Password" />
                                    <div className="invalid-feedback">
                                        <ErrorMessage
                                            name="password"
                                        />
                                    </div>
                                    <Field type="password" className="form-control" name="confirmPassword" placeholder="Confirm Password" />
                                    <div className="invalid-feedback">
                                        <ErrorMessage
                                            name="confirmPassword"
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-dark text-white">Submit</button>
                                </Form>
                            )}
                        </Formik>
                        <ToastContainer />
                    </div>
                    <p className="text-white center-text"><span>Already have an account? </span><a href="/login" className="text-dark font-weight-bold">Login</a></p>
                </div>
            </div>
        </div>
    )
}

export default Signup;
