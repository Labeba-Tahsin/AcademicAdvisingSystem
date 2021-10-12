import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { LoginSchema } from '../schemas/schemas';
import { Form, Formik, Field, ErrorMessage, FieldArray } from "formik";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarAdmin from "./Navbar";



export default function UserManagement() {

    const [users, setUsers] = useState(null);
    useEffect(() => {

        getUsers();

    }, []);

    const getUsers = () => {
        axios.get(`/api/users`)
            .then((x) => {
                setUsers(x.data);
            })
            .catch((err) => {

            });
    }

    const approve = (x) => {
        axios.put(`/api/users/approve/${x.email}`)
            .then((x) => {
                toast.success("User Approved", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false
                });
                getUsers();
            })
            .catch((err) => {

            });
    }

    const deleteUser = (x) => {
        axios.delete(`/api/users/delete/${x.email}`)
            .then((x) => {
                toast.error("User Delete", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false
                });
                getUsers();
            })
            .catch((err) => {

            });
    }

    return (
        <>
            <NavbarAdmin />
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="text-dark mt-5">User Management</h1>
                        <table className="table table-hover mt-4">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.map(x => (
                                    <tr>
                                        <td width="35%">{x.email}</td>
                                        <td width="15%">{x.role}</td>
                                        <td width="15%">{x.approved ? 'Approved' : 'Pending'}</td>
                                        <td width="35%">
                                            {x.approved === false &&
                                                <button className="btn btn-primary mr-2" onClick={() => approve(x)}>Approve</button>
                                            }

                                            <button className="btn btn-danger" onClick={() => deleteUser(x)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}


                            </tbody>
                        </table>
                        <ToastContainer />
                    </div>
                </div>
            </div>
        </>
    )
}
