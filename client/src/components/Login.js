// import React from 'react'
// import { useHistory } from "react-router-dom";
// const Login = () => {
//     const history = useHistory();

//     const handleLogin = () => {
//         localStorage.setItem('login', 'true');
//         console.log(localStorage.getItem('login'))
//         history.push('/profile');
//     }
//     return (
//         <div>
//             login here
//             <button onClick={() => handleLogin()}>
//                 Login
//             </button>
//         </div>
//     )
// }

// export default Login;
import React from 'react'
import { useHistory } from "react-router-dom";
import { LoginSchema } from '../schemas/schemas';
import { Form, Formik, Field, ErrorMessage, FieldArray } from "formik";

const Login = () => {
    return (
        <div className="container bg-green">
            <div className="row">
                <div className="col-md-12">
                    <div className="signup-form">
                        <h1 className="text-dark">Log In</h1>
                        <p>Please fill in this form to login!</p>
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={LoginSchema}
                            onSubmit={(values, actions) => {
                                console.log('hi');
                                actions.setSubmitting(false);
                            }}
                        >
                            {props => (
                                <Form onSubmit={props.handleSubmit}>
                                    <Field type="email" className="form-control" name="email" placeholder="Email" />
                                    <div className="invalid-feedback">
                                        <ErrorMessage
                                            name="email"
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;

