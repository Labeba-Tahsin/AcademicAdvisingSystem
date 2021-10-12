import React from 'react'
import { useHistory } from "react-router-dom";
import { PasswordSchema } from '../schemas/schemas';
import { Form, Formik, Field, ErrorMessage, FieldArray } from "formik";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarAdmin from './Navbar';

const Password = () => {
    return (
        <>
            <NavbarAdmin></NavbarAdmin>
            <div className="container-fluid bg-green">
                <div className="row">
                    <div className="col-md-12">
                        <div className="signup-form">
                            <h1 className="text-dark">Recover Password</h1>
                            <p>Please fill in this form to recover password!</p>
                            <Formik
                                initialValues={{ email: '', password: '', confirmPassword: '' }}
                                validationSchema={PasswordSchema}
                                onSubmit={(values, actions) => {
                                    axios.put('/api/users/password', values)
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
                                        <div className="invalid-feedback">
                                            <ErrorMessage
                                                name="role"
                                            />
                                        </div>
                                        <Field type="password" className="form-control" name="password" placeholder="New Password" />
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

                    </div>
                </div>
            </div>
        </>
    )
}

export default Password;
