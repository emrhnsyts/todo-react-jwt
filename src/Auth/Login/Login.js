import axios from 'axios';
import React, { useEffect, useState } from 'react'
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")


    const navigate = useNavigate()

    const onFormSubmit = (e) => {
        e.preventDefault();
        axios.post("/api/v1/auth/login", { username, password }).then(
            (res) => {
                localStorage.setItem("jwt", res.data)
                setUser(jwt_decode(res.data))
                toast.success("Login sucessful.", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                navigate(`/todos/${jwt_decode(res.data).userId}`)

            },
            (error) => {
                toast.error("Login failed.", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        );
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
                    <label className='text-white' htmlFor="loginUsername">Username</label>
                    <input type="text" className="form-control" id="loginUsername"
                        value={username} onChange={onUsernameChange} placeholder="Username" />
                </div>
                <div className="form-group mb-3">
                    <label className='text-white' htmlFor="loginPassword">Password</label>
                    <input type="password" className="form-control" id="loginPassword"
                        value={password} onChange={onPasswordChange} placeholder="Password" />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
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

export default Login