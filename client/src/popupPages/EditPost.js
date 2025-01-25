import React from 'react';
import {useEffect, useState, useContext} from 'react';
import { PostContext } from '../context/postContext.js';
import Popup from '../cmps/Popup.js';

export default function EditPost() {
	const {postState, onEditPost, onDeletePost} = useContext(PostContext)
    const [content, setContent] = useState('')
	
    useEffect(() => {
		if (postState.selectedPost.content) {
			setContent(postState.selectedPost.content)
		}
	}, [postState.selectedPost.content])

	async function handleEditPost() {
		if (!content) {
			alert('This field is required. anlskdnas;lnd')
			return
		} else if(content.length > 2000) {
			alert('Content should not be longer than 2000 characters.')
			return
		}
		await onEditPost(content)
	}

	return(
		<Popup className="small-popup">
			<h3 className='pnewpost'>Edit post</h3>
			{postState.selectedPost._id &&(
				<>
				<form className="popup-form" onSubmit={(ev) => {
					ev.preventDefault();
					handleEditPost();
				}}>
					<p>Content</p>
					<input type="text" value={content}
							onChange={ev => setContent(ev.target.value)} />
					<button className="submitBtn pointer">Submit</button>
				</form>
				<button className="submitBtn pointer" style={{background: 'grey'}} onClick={onDeletePost}>Delete Post</button>
				</>
			)}
		</Popup>
	)
}