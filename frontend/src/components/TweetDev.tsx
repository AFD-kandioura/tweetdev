import React, { useEffect, useState } from 'react';

import "../styles/TweetDev.css"
import Post from '../interfaces/Post';
function TweetDev({key, postInfo}) {
        const [input, setInput] = useState('');
        
        const [output, setOutput] = useState('');
        
        const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
            setInput(event.target.value);
        };
        useEffect(() => {
            console.log(postInfo)
            console.log(postInfo.authorName)

          }, []);
        const run = () => {
            setOutput("run");
        }
    return (
        <div className="tweetDev-container">
            <div className='up'>
                <div className='author'>{postInfo.authorName}</div>
                <div className='title'>{postInfo.title}</div>
            </div>
            <div className='code'>
                <pre> {postInfo.description}</pre>
            </div>
            <div className='details'>
                <div className='engagement'>

                    <div className='likes'>{postInfo.like.length} Likes</div>
                    <div className='comments'>{postInfo.comments.length} Comments</div>
                </div>
                <div className='specs'>
                    <div className='format'>{postInfo.format}</div>
                    <div className='language'>{postInfo.language}</div>
                </div>
             
            </div>
            <div className='down'>
                    <div className='input'>
                    <textarea 
                        value={input}
                        onChange={handleChange} id="input" name="input" rows={5} cols={50} placeholder='Enter input here'>

</textarea>
                    </div>
                    <div className='run'><button onClick={()=>run()} className='run-button'>RUN</button></div>
                    <div className='result'>
                    
                    <textarea 
                        value={output} readOnly id="result" name="result" rows={5} cols={50} placeholder='Result'>
</textarea></div>
                </div>
        </div>
    );
}

export default TweetDev;