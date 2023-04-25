import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext';

const Message = ({ message }) => {

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const ref = useRef();

    //Automatically scrolls to latest message 
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return (
        <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
            <div className="messageInfo">
                <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt='' />
            </div>
            <div className="messageContent">
                <span>{message.date.toDate().toLocaleString('en-GB')}</span>
                {message.text && !message.image ? <p>{message.text}</p> :
                    !message.text && message.image ?
                        <div className='messageContent'>
                            {message.image && <img src={message.image} alt="" />}
                        </div> :
                        <div className='messageContent'>
                            <p>{message.text}</p>
                            {message.image && <img src={message.image} alt="" />}
                        </div>}
            </div>
        </div>
    )
}

export default Message