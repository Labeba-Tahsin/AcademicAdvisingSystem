import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarStudent from './NavbarStudent';
import { Form, Formik, Field, ErrorMessage, FieldArray } from "formik";
import NavbarFaculty from './NavbarFaculty';

export default function Approve() {
    const [adv, setAdv] = useState(null);
    const { id } = useParams();
    const [advCrs, setAdvCrs] = useState([]);
    const [student, setStudent] = useState(null);
    const [disable, setDisable] = useState(false);
    const [intendCredit, setIntendCredit] = useState(0);
    const history = useHistory();
    const [courses, setCourses] = useState([]);
    const [action, setAction] = useState(null);

    useEffect(() => {

        getStudent();
        axios.get(`/api/eligible-courses/${id}`)
            .then((x) => {
                setCourses(x.data);
            })
            .catch((err) => {

            });

    }, []);

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    const getStudent = () => {
        axios.get(`/api/advising/${id}`)
            .then((x) => {
                setAdv(x.data);
            })
            .catch((err) => {

            });
    }

    const approve = () => {
        axios.post(`/api/advising/approve/${id}`)
            .then((x) => {
                toast.success("Advising approved successfully", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false
                });
                getStudent();

            })
            .catch((err) => {

                toast.error(err.response.data, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false
                });
            });
    }

    return (
        <div>
            <NavbarFaculty />
            <div className="container">
                <div className="row">
                    <div className="col-md-9">
                        <h1 className="text-dark mt-5">Advised Courses</h1>
                        {
                            <>

                                <p className="mb-0">{adv && <span className="font-weight-bold">Name: </span>}{adv?.name}</p>
                                <p className="mb-0"><span className="font-weight-bold">ID: </span>{id}</p>
                                <p><span className="font-weight-bold">Status: </span>{adv ? adv.status.toUpperCase() : 'Not done'}</p>
                            </>
                        }
                    </div>
                    <div className="col-md-3">
                        <button type="button" onClick={() => openInNewTab(`/view/result/${id}`)} className="btn btn-success text-white  mt-5">See Result</button>
                    </div>
                    <div className="col-md-12">
                        <table className="table mt-4 table-striped">
                            <thead>
                                <tr>
                                    {adv && adv.courses && adv.courses.length > 0 &&
                                        <>
                                            <th>Course Id</th>
                                            <th>Name</th>
                                            <th>Group</th>
                                            <th>Credit</th>
                                            <th>Corequisite</th>
                                            <th>Prerequisites</th>
                                        </>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {adv && adv.courses.map(x => (
                                    <tr key={x.id}>
                                        <td>{x.id}</td>
                                        <td>{x.name}</td>
                                        <td>{x.group}</td>
                                        <td>{x.credit}</td>
                                        <td>{x.corequisite}</td>
                                        <td>{x?.prequisites?.map(y => (
                                            <span>{y + " "}</span>
                                        ))}</td>
                                    </tr>
                                ))}


                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-9">
                        <h1 className="text-dark">Advising Panel</h1>
                        <p className="">Please add or drop course for advising!</p>
                        {courses && courses.length && courses.length > 0 &&
                            <Formik
                                initialValues={{ course: '' }}
                                // validationSchema={LoginSchema}
                                onSubmit={(values, actions) => {
                                    const crs = courses.find(x => x.id === values.course);
                                    if (values.course !== '') {
                                        if (action === 'add') {
                                            const alreadyAdded = adv?.courses.find(x => x.id === values.course);
                                            if (alreadyAdded) {
                                                toast.error("Already added", {
                                                    position: "top-right",
                                                    autoClose: 5000,
                                                    hideProgressBar: false
                                                });
                                            } else {

                                                axios.post(`/api/advising/${id}`, { course: crs })
                                                    .then((x) => {
                                                        toast.success("Course added successfully", {
                                                            position: "top-right",
                                                            autoClose: 5000,
                                                            hideProgressBar: false
                                                        });
                                                        getStudent();

                                                    })
                                                    .catch((err) => {

                                                        toast.error("Course was not added", {
                                                            position: "top-right",
                                                            autoClose: 5000,
                                                            hideProgressBar: false
                                                        });
                                                    });

                                            }
                                        } else if (action === 'delete') {

                                            axios.delete(`/api/advising/${id}/${encodeURI(values.course)}`)
                                                .then((x) => {
                                                    toast.success("Course deleted successfully", {
                                                        position: "top-right",
                                                        autoClose: 5000,
                                                        hideProgressBar: false
                                                    });
                                                    getStudent();

                                                })
                                                .catch((err) => {

                                                    toast.error(err.response.data, {
                                                        position: "top-right",
                                                        autoClose: 5000,
                                                        hideProgressBar: false
                                                    });
                                                });

                                        }

                                    }


                                    actions.resetForm();
                                    actions.setSubmitting(false);
                                }}
                            >
                                {props => (
                                    <Form className="w-50" onSubmit={props.handleSubmit}>
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

                                        <button type="submit" onClick={() => setAction('add')} className="btn btn-success text-white mr-3">Add</button>
                                        <button type="submit" onClick={() => setAction('delete')} className="btn btn-danger text-white">Delete</button><br />


                                    </Form>
                                )}
                            </Formik>
                        }
                    </div>
                    <div className="col-md-3 mt-3">
                        <button type="button" onClick={() => approve()} className="btn btn-primary text-white mt-5">Approve</button><br />
                    </div>
                    <ToastContainer />

                </div>
            </div>
        </div>
    )
}
