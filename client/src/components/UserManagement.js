import React from 'react'

export default function UserManagement() {
    return (
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
                            <tr>
                                <td width="35%">bla bla</td>
                                <td width="15%">Student</td>
                                <td width="15%">Pending</td>
                                <td width="35%">
                                    <button className="btn btn-primary mr-2">Approve</button>
                                    <button className="btn btn-danger">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
