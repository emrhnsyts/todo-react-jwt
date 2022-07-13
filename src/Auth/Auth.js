import React from 'react'
import Register from './Register/Register'
import Login from './Login/Login'

function Auth({ setUser }) {
    return (
        <div className='container '>
            <div className='row'>
                <Login setUser={setUser} />
                <Register />
            </div>

        </div>
    )
}

export default Auth