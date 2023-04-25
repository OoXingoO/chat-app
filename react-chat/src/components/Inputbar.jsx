import React, { useContext, useState } from 'react';
import Img from '../images/img.png';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Timestamp, doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from '../firebase';
import { v4 as uuid } from "uuid";

const Inputbar = () => {

    const [error, setError] = useState(false);
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const handleSend = async (e) => {
        e.preventDefault();
        if (image) {

            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, image);

            uploadTask.on(
                (error) => {
                    // Handle unsuccessful uploads
                    setError(true);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(db, "chats", data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                image: downloadURL
                            })
                        })
                    });
                }
            );

        } else {
            //updating elements in an array
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now()
                })
            })
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatId + ".lastMessage"]: {
                text
            },
            [data.chatId + ".date"]: serverTimestamp()
        });

        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                text
            },
            [data.chatId + ".date"]: serverTimestamp()
        })

        setText("");
        setImage(null);
    }

    return (
        <form onSubmit={handleSend}>
            <div className='inputBar'>
                <input type='text' placeholder='Type here...' onChange={e => setText(e.target.value)} value={text} />
                <div className='send'>
                    <input type='file' id='file' onChange={(e) => setImage(e.target.files[0])} />
                    <label htmlFor='file'>
                        <img src={Img} alt='Img-Upload' />
                    </label>
                    <button type='submit' onClick={handleSend} >Send</button>
                </div>
            </div>
        </form>
    )
}

export default Inputbar