import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarStudent from './NavbarStudent';

export default function Advising() {
    const [adv, setAdv] = useState(null);
    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {

        getUsers();

    }, []);

    const getUsers = () => {
        axios.get(`/api/advising/${id}`)
            .then((x) => {
                setAdv(x.data);
            })
            .catch((err) => {

            });
    }
    return (
        <div>
            <NavbarStudent />
            <div className="container">

                <div className="row">
                    <div className="col-md-12">
                        <h1 className="text-dark mt-5">Advised Courses</h1>
                        {
                            adv && <>
                                <p className="mb-0"><span className="font-weight-bold">Name: </span>{adv.name}</p>
                                <p className="mb-0"><span className="font-weight-bold">ID: </span>{adv.student_id}</p>
                                <p><span className="font-weight-bold">Status: </span>{adv.status.toUpperCase()}</p></>
                        }

                        <table className="table table-hover mt-4">
                            <thead>
                                <tr>
                                    <th>Course Id</th>
                                    <th>Name</th>
                                    <th>Group</th>
                                    <th>Credit</th>
                                    <th>Corequisite</th>
                                    <th>Prerequisites</th>
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
                                        <td>{x.prequisites.map(y => (
                                            <span>{y + " "}</span>
                                        ))}</td>
                                    </tr>
                                ))}


                            </tbody>
                        </table>
                        <ToastContainer />
                    </div>
                </div>
            </div>
        </div>
    )
}
