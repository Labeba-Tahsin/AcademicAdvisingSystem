import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarFaculty from "./NavbarFaculty";

export default function ViewResult() {
    const [courses, setCourses] = useState([]);
    const [student, setStudent] = useState(null);
    const [cg, setCg] = useState(0);
    const { id } = useParams();

    const cgpa = (result) => {
        let totalCredit = 0;
        let sum = 0;
        result.forEach(element => {
            totalCredit = totalCredit + parseInt(element.credit);
            sum = sum + (parseInt(element.credit) * parseInt(element.gpa));
        });
        setCg(sum / totalCredit);
    }

    const getStudentInfo = () => {
        axios.get(`/api/students/${id}`)
            .then((x) => {
                setStudent(x.data);
                if (x.data) {
                    cgpa(x.data.result);
                }

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
        <>
            <NavbarFaculty />
            <div className="container">

                {student &&
                    <div className="row">
                        <div className="col-md-12">
                            <p className="mb-0"><span className="font-weight-bold">Name: </span>{student.name}</p>
                            <p className="mb-0"><span className="font-weight-bold">ID: </span>{student.id}</p>
                            <p><span className="font-weight-bold">CGPA: </span>{cg}</p>
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
        </>
    )
}
