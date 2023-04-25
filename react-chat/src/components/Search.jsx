import React, { useContext, useState } from 'react';
import { collection, query, where, getDoc, setDoc, updateDoc, doc, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Search = () => {

    const [username, setUsername] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState(false);

    const { currentUser } = useContext(AuthContext);

    const handleSearch = async () => {
        //creates a query against the "users" collection where displayname equals username
        const q = query(collection(db, "users"), where("displayName", "==", username));

        try {
            //after creating a query object, use the get() function to retrieve result
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data())
            });
        } catch (error) {
            setError(true);
        }
    }


    //onKeyDown listens to keyboard actions, upon enter it will search for the user
    const handleKey = e => {
        e.code === 'Enter' && handleSearch();
    }

    const handleSelect = async () => {
        const combinedUID = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;

        try {
            //check whether the group ("chats" collection in firestore) exists, if not create new one
            const response = await getDoc(doc(db, "chats", combinedUID))
            //exists() is a firebase method
            if (!response.exists())
                //create a chat in chats collection
                await setDoc(doc(db, "chats", combinedUID), { messages: [] });
            //create user chats
            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [combinedUID + ".userInfo"]: {
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                },
                [combinedUID + ".date"]: serverTimestamp() //Firebase function that takes into account different timezones
            });

            await updateDoc(doc(db, "userChats", user.uid), {
                [combinedUID + ".userInfo"]: {
                    uid: currentUser.uid,
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL
                },
                [combinedUID + ".date"]: serverTimestamp()
            });
        } catch (error) {
            setError(true);
        }

        setUser(null); //closes searchbar after finding the user
        setUsername(""); //clears input field after finding the user
    }

    return (
        <div className='search'>
            <div className='searchForm'>
                <input type='text' placeholder='Find a user' onKeyDown={handleKey} onChange={e => setUsername(e.target.value)} value={username} />
            </div>
            {error && <span>Oops...user not found!</span>}
            {user && (<div className="userChat" onClick={handleSelect}>
                <img src={user.photoURL} />
                <div className="userChatInfo">
                    <span>{user.displayName}</span>
                </div>
            </div>)}
        </div>
    )
}

export default Search