import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SimpleDateTime from 'react-simple-timestamp-to-date';
import { useParams, useNavigate } from 'react-router';
import jwt_decode from "jwt-decode";

function Todos({ user, setUser }) {
    const [todoList, setTodoList] = useState([])
    const [loading, setLoading] = useState(true)
    const [todoText, setTodoText] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [todoDoBeUpdated, setTodoToBeUpdated] = useState({})

    const navigate = useNavigate();


    useEffect(() => {
        if (checkJwt(localStorage.getItem("jwt"))) {
            fetchData()
        }
    }, [])

    const { userId } = useParams();

    const checkJwt = (jwt) => {
        if (!jwt) {
            navigate("/")
            return false;
        }
        else {
            jwt = jwt_decode(jwt);
            const date = new Date()
            if (jwt.userId != userId || jwt.exp < date.getTime() / 1000 || !user) {
                localStorage.clear();
                navigate("/")
                return false;
            }
        }
        return true;
    }

    const onTodoTextChange = (e) => {
        setTodoText(e.target.value)
    }

    const fetchData = () => {
        axios(`/api/v1/todos/users/${userId}`,
            {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                }
            })
            .then((res) => setTodoList(res.data));
        if (loading) {
            setLoading(false)
        }
    }

    const onDelete = (todoId) => {
        if (checkJwt(localStorage.getItem("jwt"))) {
            axios.delete(`/api/v1/todos/${todoId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                    }
                })
                .then((res) => fetchData()).then(() => {
                    toast.error("To-do deleted", {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                })
        }
    }


    const onSubmit = (e) => {
        e.preventDefault();
        if (checkJwt(localStorage.getItem("jwt"))) {
            if (!isEdit) {
                axios.post("/api/v1/todos", {
                    text: todoText, appUserId: userId
                },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("jwt")}`
                        }
                    })
                    .then((res) => {
                        setTodoText("");
                    })
                    .then(() => fetchData())
                    .catch((err) => toast.warn(err.response.data.details[0], {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    }))
                    .then(() => {
                        toast.success("To-do added", {
                            position: "bottom-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        })
                    });
            }
            else {
                axios.put(`/api/v1/todos/${todoDoBeUpdated.id}`, {
                    text: todoText,
                    appUserId: userId
                }
                    , {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("jwt")}`
                        }

                    })
                    .then((res) => {
                        setTodoText("");
                        setTodoToBeUpdated({});
                        setIsEdit(false);
                    })
                    .then(() => fetchData())
                    .catch((err) => toast.warn(err.response.data.details[0], {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    }))
                    .then(() => {
                        toast.warn("To-do updated", {
                            position: "bottom-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        })
                    });
            }
        }
    }

    const onChecked = (todo) => {
        if (checkJwt(localStorage.getItem("jwt"))) {
            axios.put(`/api/v1/todos/${todo.id}`, {
                text: todo.text,
                isCrossed: !todo.isCrossed,
                appUserId: userId
            }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                }
            }).then(() => {
                fetchData();
            })
        }
    }

    const onTodoUpdate = (todo) => {
        setIsEdit(true);
        setTodoToBeUpdated(todo);
        setTodoText(todo.text)
    }

    const onLogout = () => {
        localStorage.clear();
        checkJwt(localStorage.getItem("jwt"));
    }

    return (
        <div>
            <button className="btn btn-info fixed-top" type="button" onClick={onLogout} >
                Logout
            </button>
            <div className="container mt-5">
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="To-do" aria-label="To-do" value={todoText}
                        onChange={onTodoTextChange} aria-describedby="button-addon2" />
                    <button className="btn btn-success" type="button" onClick={onSubmit} id="button-addon2">
                        {isEdit ? "Güncelle" : "Ekle"}
                    </button>
                </div>
                {loading ? <h1>'loading'</h1> : <div className='row'>
                    {todoList.map((todo) => {
                        return <React.Fragment key={todo.id}>
                            <div className="col-md-6 mb-2">
                                <div className="card">
                                    <div className='card-body'>
                                        <h5 className='card-title'>{todo.isCrossed ? <strike>{todo.text}</strike> : todo.text}</h5>
                                        <p className='card-text'>
                                            Created at: <SimpleDateTime
                                                dateSeparator="-"
                                                timeSeparator="."
                                            >
                                                {todo.createdAt}
                                            </SimpleDateTime>
                                        </p>
                                        <div className='align-items-center d-flex justify-content-center'>
                                            <button onClick={() => onDelete(todo.id)} className="btn btn-danger me-2"
                                                type="button" id="button-addon3">Sil</button>
                                            <button className="btn btn-primary"
                                                onClick={() => onTodoUpdate(todo)} type="button">Güncelle</button>


                                            <div className="form-check ms-2">
                                                <input className="form-check-input" type="checkbox" id={todo.id}
                                                    onChange={() => { onChecked(todo) }} />
                                                <label className="form-check-label" htmlFor={todo.id}>
                                                    Done
                                                </label>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </div>

                        </React.Fragment>
                    })}
                </div>
                }
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
        </div >
    )
}

export default Todos;