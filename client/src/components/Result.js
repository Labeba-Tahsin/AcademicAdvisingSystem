import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { LoginSchema } from '../schemas/schemas';
import { Form, Formik, Field, ErrorMessage, FieldArray } from "formik";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Result() {
    const [courses, setCourses] = useState([]);
    const [student, setStudent] = useState(null);
    const { id } = useParams();

    const getStudentInfo = () => {
        axios.get(`/api/students/${id}`)
            .then((x) => {
                setStudent(x.data);
            })
            .catch((err) => {
                // toast.error(err.response.data, {
                //     position: "top-right",
                //     autoClose: 5000,
                //     hideProgressBar: false
                // });

            })
    }

    useEffect(() => {

        console.log(id);
        axios.get('/api/courses')
            .then((x) => {
                setCourses(x.data);
            })
            .catch((err) => {
                // toast.error(err.response.data, {
                //     position: "top-right",
                //     autoClose: 5000,
                //     hideProgressBar: false
                // });

            });
        if (id) getStudentInfo(id);

    }, []);
    return (
        <div className="container">
            {student &&
                <div className="row">
                    <div className="col-md-6">
                        <h1 className="text-dark">Result</h1>
                        <p>Please fill in this form to set your result!</p>
                        {courses && courses.length && courses.length > 0 &&
                            <Formik
                                initialValues={{ course: '', action: '', gpa: '' }}
                                // validationSchema={LoginSchema}
                                onSubmit={(values, actions) => {
                                    if (values.action === 'add') {
                                        const crs = courses.find(x => x.id === values.course);
                                        if (student.result.find(x => x.id === values.course)) {
                                            toast.error("Already added", {
                                                position: "top-right",
                                                autoClose: 5000,
                                                hideProgressBar: false
                                            });
                                            actions.resetForm();
                                        }
                                        else {
                                            const result = student.result;
                                            result.push({
                                                id: crs.id,
                                                name: crs.name,
                                                group: crs.group,
                                                gpa: values.gpa
                                            });
                                            const newInfo = { ...student, result: result };

                                            axios.put(`/api/students/${id}`, newInfo)
                                                .then((x) => {
                                                    toast.success("Course added successfully", {
                                                        position: "top-right",
                                                        autoClose: 5000,
                                                        hideProgressBar: false
                                                    });

                                                })
                                                .catch((err) => {
                                                    toast.error("Course add failed", {
                                                        position: "top-right",
                                                        autoClose: 5000,
                                                        hideProgressBar: false
                                                    });

                                                })
                                                .finally(() => {
                                                    if (id) getStudentInfo(id);
                                                    actions.resetForm();
                                                });
                                        }
                                    }
                                    else if (values.action === 'update') {
                                        if (!student.result.find(x => x.id === values.course)) {
                                            toast.error("No course found for update", {
                                                position: "top-right",
                                                autoClose: 5000,
                                                hideProgressBar: false
                                            });
                                            actions.resetForm();
                                        }
                                        else {
                                            const rst = student.result;
                                            const ind = student.result.findIndex(x => x.id === values.course);
                                            rst[ind] = {
                                                ...rst[ind],
                                                gpa: values.gpa
                                            }
                                            const newInfo = { ...student, result: rst };

                                            axios.put(`/api/students/${id}`, newInfo)
                                                .then((x) => {
                                                    toast.success("Course updated successfully", {
                                                        position: "top-right",
                                                        autoClose: 5000,
                                                        hideProgressBar: false
                                                    });

                                                })
                                                .catch((err) => {
                                                    toast.error("Course update failed", {
                                                        position: "top-right",
                                                        autoClose: 5000,
                                                        hideProgressBar: false
                                                    });

                                                })
                                                .finally(() => {
                                                    if (id) getStudentInfo(id);
                                                    actions.resetForm();
                                                });
                                        }
                                    }

                                    else {
                                        if (!student.result.find(x => x.id === values.course)) {
                                            toast.error("No course found for delete", {
                                                position: "top-right",
                                                autoClose: 5000,
                                                hideProgressBar: false
                                            });
                                            actions.resetForm();
                                        }
                                        else {
                                            const rst = student.result;
                                            const ind = student.result.findIndex(x => x.id === values.course);
                                            rst.splice(ind, 1);
                                            const newInfo = { ...student, result: rst };

                                            axios.put(`/api/students/${id}`, newInfo)
                                                .then((x) => {
                                                    toast.success("Course deleted successfully", {
                                                        position: "top-right",
                                                        autoClose: 5000,
                                                        hideProgressBar: false
                                                    });

                                                })
                                                .catch((err) => {
                                                    toast.error("Course delete failed", {
                                                        position: "top-right",
                                                        autoClose: 5000,
                                                        hideProgressBar: false
                                                    });

                                                })
                                                .finally(() => {
                                                    if (id) getStudentInfo(id);
                                                    actions.resetForm();
                                                });
                                        }
                                    }


                                    actions.setSubmitting(false);
                                }}
                            >
                                {props => (
                                    <Form onSubmit={props.handleSubmit}>
                                        <Field className="form-control" name="course" as="select">
                                            <option value="" disabled>--Select Course--</option>
                                            {courses && courses.map(x => (
                                                <option value={x.id} key={x.id}>{x.id}</option>
                                            ))}
                                        </Field>
                                        {
                                            props.values.course !== '' &&
                                            <div className="border border-light p-2 mb-2 rounded bg-card">
                                                <h6>Course Info</h6>
                                                <p className="m-0"><span className="font-weight-bold">ID:  </span>{props.values.course}</p>
                                                <p className="m-0"><span className="font-weight-bold">Name:  </span>{courses.find(x => x.id === props.values.course).name}</p>
                                                <p className="m-0"><span className="font-weight-bold">Group:  </span>{courses.find(x => x.id === props.values.course).group}</p>
                                                <p className="m-0"><span className="font-weight-bold">Credit:  </span>{courses.find(x => x.id === props.values.course).credit}</p>
                                                <p className="m-0"><span className="font-weight-bold">Corequisite:  </span>{courses.find(x => x.id === props.values.course).corequisite || 'None'}</p>
                                                <p className="m-0"><span className="font-weight-bold">Prerequisite:  </span>
                                                    {courses.find(x => x.id === props.values.course).prequisites.length > 0 ?
                                                        ((courses.find(x => x.id === props.values.course).prequisites).map((y, ind) => (

                                                            <span key={ind}>{y}{ind !== courses.find(x => x.id === props.values.course).prequisites.length - 1 ? ',' : ''}</span>
                                                        ))) : <span>None</span>}</p>
                                            </div>

                                        }
                                        <Field className="form-control" name="action" as="select">
                                            <option value="" disabled>--Select Action--</option>
                                            <option value="add">Add</option>
                                            <option value="update">Update</option>
                                            <option value="delete">Delete</option>
                                        </Field>
                                        <Field type="text" className="form-control" name="gpa" placeholder="GPA" />
                                        <div className="invalid-feedback">
                                            <ErrorMessage
                                                name="gpa"
                                            />
                                        </div>

                                        <button type="submit" className="btn btn-dark text-white">Submit</button>
                                    </Form>
                                )}
                            </Formik>
                        }
                    </div>
                    <div className="col-md-6">
                        <p className="mb-0"><span className="font-weight-bold">Name: </span>{student.name}</p>
                        <p><span className="font-weight-bold">ID: </span>{student.id}</p>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th >Course ID</th>
                                    <th >Course Name</th>
                                    <th >Group</th>
                                    <th>GPA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {student.result.map((x, ind) => (
                                    <tr>
                                        <th>{x.id}</th>
                                        <td> {x.name}</td>
                                        <td>{x.group}</td>
                                        <td>{x.gpa}</td>
                                    </tr>
                                ))

                                }
                                {student.result.length === 0 &&
                                    <tr><td>No Course Found</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            }
            {
                student === null &&
                <div className="row">
                    <div className="col-md-12">No student found!</div>
                </div>
            }
            <ToastContainer />
        </div >
    )
}
