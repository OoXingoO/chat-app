import React, { useState } from 'react'
import addAvater from '../images/addAvatar.png';

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {
            //Create new user
            const response = await createUserWithEmailAndPassword(auth, email, password);

            const storageRef = ref(storage, displayName);

            await uploadBytesResumable(storageRef, file).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {

                    try {
                        //Update profile
                        await updateProfile(response.user, {
                            displayName,
                            photoURL: downloadURL
                        });

                        //Add a new document in collection "users" with its unique Id
                        await setDoc(doc(db, "users", response.user.uid), {
                            //What will be stored inside the document:
                            uid: response.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL
                        });

                        //Add a new "userChats" collection with its UID in Firestore database
                        await setDoc(doc(db, "userChats", response.user.uid), {})

                        navigate('/'); //After successful operation, automatically navigate to home page
                    } catch (error) {
                        setError(true);
                        setLoading(false);
                    }
                });
            });

        } catch (error) {
            window.alert(error.message);
            setError(true);
            setLoading(false);
        }
    };

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>meChat</span>
                <span className='title'> Register</span>
                <form onSubmit={handleSubmit}>
                    <input type='text' placeholder='Display name' />
                    <input type='email' placeholder='Email' />
                    <input type='password' placeholder='Password' />
                    <input type='file' id='file-upload' />
                    <label htmlFor='file-upload'>
                        <img src={addAvater} alt='add-avater' />
                        <span>Add an avatar</span>
                    </label>
                    <button>Sign Up</button>
                    {loading && "Uploading and compressing the image please wait..."}
                    {error && <span>Something went wrong</span>}
                </form>
                <p>Already have an account? <Link to='/login'>Login here!</Link></p>
            </div>
        </div>
    )
}

export default Register 