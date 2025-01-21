"use client"
import React, { useState } from 'react'

const Form = ({ onSendMessage }: { onSendMessage: (message: string) => void }) => {
    const [message, setMessage] = useState("");

    const handelSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() !== "") {
            onSendMessage(message);
            setMessage("");
        }
    }

    return (
        <div>
            <form onSubmit={handelSubmit} >
                <div className='w-full'>
                    <input
                        type="text"
                        onChange={(e) => setMessage(e.target.value)}
                        className='px-3 py-2 w-[90%] rounded outline-1 focus:outline-red-400 outline' placeholder='Enter your message here' />
                    <button className='px-4 w-auto py-2 ml-2 bg-[#1a1a1a] text-white rounded' type='submit'>Send</button>
                </div>
            </form>
        </div >
    )
}

export default Form