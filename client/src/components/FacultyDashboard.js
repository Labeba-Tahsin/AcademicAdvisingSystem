import React from 'react'
import { useHistory } from "react-router-dom";
import { SearchSchema } from '../schemas/schemas';
import { Form, Formik, Field, ErrorMessage, FieldArray } from "formik";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarFaculty from './NavbarFaculty';

export default function FacultyDashboard() {
    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    return (
        <>
            <NavbarFaculty />
            <div className="container-fluid bg-green">
                <div className="row">
                    <div className="col-md-12">
                        <div className="signup-form">
                            <h1 className="text-dark">Search student</h1>
                            <Formik
                                initialValues={{ student_id: '' }}
                                validationSchema={SearchSchema}
                                onSubmit={(values, actions) => {
                                    axios.get(`/api/advising/${values.student_id}`)
                                        .then((x) => {
                                            openInNewTab(`/approve-advising/${values.student_id}`)
                                        })
                                        .catch((err) => {
                                            toast.error(err.response.data, {
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
                                        <Field type="text" className="form-control" name="student_id" placeholder="Student ID" />
                                        <div className="invalid-feedback">
                                            <ErrorMessage
                                                name="student_id"
                                            />
                                        </div>

                                        <button type="submit" className="btn btn-dark text-white">Search</button>
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
