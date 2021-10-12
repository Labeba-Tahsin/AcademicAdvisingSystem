
import React from 'react'
import { useHistory } from "react-router-dom";
import { ProfileSchema } from '../schemas/schemas';
import { Form, Formik, Field, ErrorMessage, FieldArray } from "formik";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SetProfile = () => {
    const history = useHistory();
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="profile-form">
                        <h1 className="text-dark">Set Profile</h1>
                        <p>Please fill in this form to set your profile!</p>
                        <Formik
                            initialValues={{ id: '', name: '', role: '', cgpa: '', dept: '', credit: '' }}
                            validationSchema={ProfileSchema}
                            onSubmit={(values, actions) => {
                                if (values.role === 'student') {
                                    values.email = localStorage.getItem('email');
                                    axios.post('/api/students', values)
                                        .then((x) => {

                                            toast.success(x.data.message, {
                                                position: "top-right",
                                                autoClose: 5000,
                                                hideProgressBar: false
                                            });

                                            setInterval(() => {
                                                history.push(`/result/${values.id}`);
                                            }, 3000);

                                        })
                                        .catch((err) => {
                                            toast.error(err.response.data, {
                                                position: "top-right",
                                                autoClose: 5000,
                                                hideProgressBar: false
                                            });

                                        })


                                }

                                console.log(values)

                                if (values.role === 'faculty') {
                                    values.email = localStorage.getItem('email');
                                    axios.post('/api/faculty', values)
                                        .then((x) => {

                                            toast.success(x.data.message, {
                                                position: "top-right",
                                                autoClose: 5000,
                                                hideProgressBar: false
                                            });

                                            setInterval(() => {
                                                history.push(`/faculty-dashboard`);
                                            }, 3000);




                                        })
                                        .catch((err) => {
                                            toast.error(err.response.data, {
                                                position: "top-right",
                                                autoClose: 5000,
                                                hideProgressBar: false
                                            });

                                        })


                                }
                                actions.resetForm();
                                actions.setSubmitting(false);
                            }}
                        >
                            {props => (
                                <Form onSubmit={props.handleSubmit}>
                                    <Field type="text" className="form-control" name="id" placeholder="ID" />
                                    <div className="invalid-feedback">
                                        <ErrorMessage
                                            name="id"
                                        />
                                    </div>
                                    <Field type="text" className="form-control" name="name" placeholder="Full Name" />
                                    <div className="invalid-feedback">
                                        <ErrorMessage
                                            name="name"
                                        />
                                    </div>
                                    <Field className="form-control" name="role" as="select">
                                        <option value="" disabled>--Select role--</option>
                                        <option value="student" onClick={() => { props.setFieldValue('cgpa', 'null'); props.setFieldValue('credit', 'null') }}>Student</option>
                                        <option value="faculty" onClick={() => { props.setFieldValue('cgpa', ''); props.setFieldValue('credit', '') }}>Faculty</option>
                                    </Field>
                                    {props.values.role === 'student' &&
                                        <>
                                            <Field type="text" className="form-control" name="cgpa" placeholder="CGPA" />
                                            <div className="invalid-feedback">
                                                <ErrorMessage
                                                    name="cgpa"
                                                />
                                            </div>
                                            <Field type="text" className="form-control" name="credit" placeholder="Completed Credit" />
                                            <div className="invalid-feedback">
                                                <ErrorMessage
                                                    name="credit"
                                                />
                                            </div>
                                        </>
                                    }
                                    <Field type="text" className="form-control" name="dept" placeholder="Department" />
                                    <div className="invalid-feedback">
                                        <ErrorMessage
                                            name="dept"
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-dark text-white">Submit</button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div >
    )
}

export default SetProfile;

