
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
                            initialValues={{ username: '', password: '' }}
                            validationSchema={LoginSchema}
                            onSubmit={(values, actions) => {
                                axios.post('/api/users/login', values)
                                    .then((x) => {
                                        toast.success(x.data.message, {
                                            position: "top-right",
                                            autoClose: 5000,
                                            hideProgressBar: false
                                        });
                                        actions.resetForm();
                                        localStorage.setItem('login', 'true');
                                        localStorage.setItem('username', values.username);


                                        if (x.data.user.role === 'admin') {
                                            history.push('/user-management');
                                        }

                                        if (x.data.user.role === 'student') {
                                            history.push('/user-management');
                                        }


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
                                    <Field type="text" className="form-control" name="username" placeholder="Username" />
                                    <div className="invalid-feedback">
                                        <ErrorMessage
                                            name="username"
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
                </div>
            </div>
        </div>
    )
}

export default Login;

