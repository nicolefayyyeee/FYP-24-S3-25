import React from 'react'
import './Contact.css'

const Contact = () => {
    return (
        <div id='contact' className='contact'>
            <div className="container">
                <div className="top">
                    <h1>Contact Us</h1>
                    <p>Have more queries?</p>
                    <p>Drop us a message and we'll get back to you!</p>
                </div>

                <form>
                    <div>
                        <label>Name</label>
                        <input type="text" placeholder='Enter your name' />
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="email" placeholder='Enter your email' />
                    </div>
                    <div>
                        <label>Message</label>
                        <textarea cols="30" rows="15" placeholder='Enter your message'></textarea>
                    </div>
                    <div className="bottom">
                        <button className="btn btn-dark">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Contact