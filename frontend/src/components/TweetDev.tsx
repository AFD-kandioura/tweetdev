import React from 'react';

import "../styles/TweetDev.css"
function TweetDev() {
    return (
        <div className="tweetDev-container">
            <div className='up'>
                <div className='author'>Author:</div>
                <div className='title'>Title:</div>
            </div>
            <div className='code'>
                <p> # Get all characters relying on default offsets letters[::] letters[:] # Get every other character from 0 to the end letters[::2] # Get every other character from 1 to the end letters[1::2]'abcd'</p>
            </div>
            <div className='details'>
                <div className='engagement'>

                    <div className='likes'>Likes:</div>
                    <div className='comments'>Comments:</div>
                </div>
                <div className='langages'>
                    <div className='Python'>Python</div>
                    <div className='Python'>Python</div>
                    <div className='Python'>Python</div>
                </div>
                <div className='down'>
                    <div className='input'>input</div>
                    <div className='result'>result</div>
                    <div className='run'>run</div>
                </div>
            </div>
        </div>
    );
}

export default TweetDev;