import React, { useContext } from 'react'

import Messages from './Messages';
import Inputbar from './Inputbar';
import { ChatContext } from '../context/ChatContext';

const Chat = () => {

    const { data } = useContext(ChatContext);

    return (
        <div className='chat'>
            <div className="chatInfo">
                <span>{data.user.displayName}</span>
            </div>
            <Messages />
            <Inputbar />
        </div>
    )
}

export default Chat