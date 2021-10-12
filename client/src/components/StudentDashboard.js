import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { LoginSchema } from '../schemas/schemas';
import { Form, Formik, Field, ErrorMessage, FieldArray } from "formik";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarStudent from './NavbarStudent';

export default function StudentDashboard() {
    const [courses, setCourses] = useState([]);
    const [advCrs, setAdvCrs] = useState([]);
    const [student, setStudent] = useState(null);
    const [disable, setDisable] = useState(false);
    const [intendCredit, setIntendCredit] = useState(0);
    const { id } = useParams();
    const history = useHistory();

    const getStudentInfo = () => {
        axios.get(`/api/students/${id}`)
            .then((x) => {
                setStudent(x.data);
            })
            .catch((err) => {

            })
    }

    useEffect(() => {

        axios.get(`/api/advising/${id}`)
            .then((x) => {

                history.push(`/advised-courses/${id}`);
            })
            .catch((err) => {
                axios.get(`/api/eligible-courses/${id}`)
                    .then((x) => {
                        setCourses(x.data);
                    })
                    .catch((err) => {

                    });
                if (id) getStudentInfo(id);


            });

    }, []);

    useEffect(() => {

        const arr = advCrs.map(x => parseInt(x.credit));
        let creditCount = 0;
        arr.forEach(element => {
            creditCount = creditCount + element;
        });
        if ((creditCount + parseInt(intendCredit)) > 15) {
            setDisable(true);
        } else {
            setDisable(false);
        }

    }, [advCrs]);

    const doAdvising = () => {
        const advising = {
            student_id: student.id,
            name: student.name,
            courses: advCrs
        }
        axios.post(`/api/advising`, advising)
            .then((x) => {
                toast.success('Advising done successfully', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false
                });
                history.push(`/advised-courses/${id}`);
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
        <div className="container">
            <NavbarStudent />
            {student &&
                <div className="row">
                    <div className="col-md-6">
                        <h1 className="text-dark">Advising Panel</h1>
                        <p className="mb-0">Please add course for advising!</p>
                        <p className="text-danger">You can not take more than 15 credits</p>
                        {courses && courses.length && courses.length > 0 &&
                            <Formik
                                initialValues={{ course: '' }}
                                // validationSchema={LoginSchema}
                                onSubmit={(values, actions) => {


                                    const crs = courses.find(x => x.id === values.course);
                                    setIntendCredit(crs.credit);
                                    if (advCrs.find(x => x.id === values.course)) {
                                        toast.error("Already Added", {
                                            position: "top-right",
                                            autoClose: 5000,
                                            hideProgressBar: false
                                        });
                                    }
                                    else {
                                        setAdvCrs(advCrs => [...advCrs, crs]);
                                    }

                                    actions.resetForm();


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

                                        <button disabled={disable} type="submit" className="btn btn-dark text-white">Add</button>
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
                                    <th>Seat</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {advCrs.map((x, ind) => (

                                    <tr key={ind}>
                                        <th>{x.id}</th>
                                        <td> {x.name}</td>
                                        <td>{x.group}</td>
                                        <td>{x.seat}</td>
                                        <td>
                                            <button type="button" onClick={() => setAdvCrs(advCrs.filter(y => y.id !== x.id))} className="btn btn-danger text-white">Remove</button>
                                        </td>
                                    </tr>
                                ))

                                }
                                {advCrs.length === 0 &&
                                    <tr><td>No Course Found</td></tr>}
                            </tbody>
                        </table>
                        <button type="button" onClick={() => doAdvising()} className="btn btn-success text-white">Finish</button>


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

