import axios from 'axios';
import React, { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


function Register() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("")

    const onFormSubmit = (e) => {
        e.preventDefault();
        axios.post("/api/v1/auth/register", { username, password }).then(
            (res) => {
                toast.success('Succesfully registered', {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                setPassword("");
                setUsername("");
            },
            (error) => {
                toast.error(error.response.data.details.toString(), {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        )
    }



    const onUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const onPasswordChange = (e) => {
        setPassword(e.target.value)
    }

    return (
        <div className='col-md-6'>
            <form onSubmit={onFormSubmit}>
                <div className="form-group">
                    <label className='text-white' htmlFor="registerUsername">Username</label>
                    <input type="text" className="form-control" id="registerUsername" value={username}
                        onChange={onUsernameChange} placeholder="Username" />
                </div>
                <div className="form-group mb-3">
                    <label className='text-white' htmlFor="registerPassword">Password</label>
                    <input type="password" className="form-control"
                        id="registerPassword" value={password} onChange={onPasswordChange} placeholder="Password" />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    )
}

export default Register