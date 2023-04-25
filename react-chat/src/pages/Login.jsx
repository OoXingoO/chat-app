import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');

        } catch (error) {
            window.alert(error.message)
            setError(true);
        }
    };

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>meChat</span>
                <span className='title'> Login</span>
                <form onSubmit={handleSubmit}>
                    <input type='email' placeholder='Enter email' />
                    <input type='password' placeholder='Enter password' />
                    <button>Login</button>
                    {error && <span>Something went wrong</span>}
                </form>
                <p>Don't have an account? <Link to='/register'>Register here!</Link></p>
            </div>
        </div>
    )
}

export default Login