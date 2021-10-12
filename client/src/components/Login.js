
import React from 'react'
import { useHistory } from "react-router-dom";
import { LoginSchema } from '../schemas/schemas';
import { Form, Formik, Field, ErrorMessage, FieldArray } from "formik";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
    const history = useHistory();
    return (
        <div className="container-fluid bg-green">
            <div className="row">
                <div className="col-md-12">
                    <div className="signup-form">
                        <h1 className="text-dark">Log In</h1>
                        <p>Please fill in this form to login!</p>
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={LoginSchema}
                            onSubmit={(values, actions) => {
                                axios.post('/api/users/login', values)
                                    .then((x) => {
                                        toast.success(x.data.message, {
                                            position: "top-right",
                                            autoClose: 5000,
                                            hideProgressBar: false
                                        });
                                        localStorage.setItem('login', 'true');
                                        localStorage.setItem('email', values.email);




                                        if (x.data.user.role === 'admin') {
                                            history.push('/user-management');
                                        }


                                        if (x.data.user.role === 'student') {
                                            axios.post(`/api/studentfind`, { email: values.email })
                                                .then((y) => {
                                                    history.push(`/result/${y.data.id}`);
                                                    localStorage.setItem('id', y.data.id);
                                                })
                                                .catch((err) => {
                                                    history.push('/set-profile');
                                                });
                                        };

                                        if (x.data.user.role === 'faculty') {
                                            axios.post(`/api/facultyfind`, { email: values.email })
                                                .then((y) => {
                                                    history.push(`/faculty-dashboard`);
                                                    localStorage.setItem('id', y.data.id);
                                                })
                                                .catch((err) => {
                                                    history.push('/set-profile');
                                                });
                                        };


                                    })
                                    .catch((err) => {
                                        toast.error("Can't login", {
                                            position: "top-right",
                                            autoClose: 5000,
                                            hideProgressBar: false
                                        });

                                    })
                                    .finally(() => {
                                        actions.resetForm();
                                        actions.setSubmitting(false);
                                    });
                            }}
                        >
                            {props => (
                                <Form onSubmit={props.handleSubmit}>
                                    <Field type="text" className="form-control" name="email" placeholder="Email" />
                                    <div className="invalid-feedback">
                                        <ErrorMessage
                                            name="email"
                                        />
                                    </div>
                                    <Field type="password" className="form-control" name="password" placeholder="Password" />
                                    <div className="invalid-feedback">
                                        <ErrorMessage
                                            name="password"
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-dark text-white">Submit</button>
                                </Form>
                            )}
                        </Formik>
                        <ToastContainer />
                    </div>
                    <p className="text-white center-text"><span>Don't have an account? </span><a href="/signup" className="text-dark font-weight-bold">Sign up</a></p>
                </div>
            </div>
        </div>
    )
}

export default Login;

