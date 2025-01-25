import React from 'react';
import {useContext,useState} from 'react';
import { PostContext } from '../context/postContext.js';
import Popup from '../cmps/Popup.js';

export default function CreatePost() {
	const {onCreatePost} = useContext(PostContext)
	const [content, setContent] = useState('')
	const [files, setFiles] = useState('')
	const [isCreateLoading, setIsCreateLoading] = useState(false)

	async function createNewPost(ev) {
		ev.preventDefault()
		setIsCreateLoading(true)
		if (!content || !files[0]) {
			alert('All fields are required.')
			setIsCreateLoading(false)
			return
		} else if(content.length > 2000) {
			alert('Content should not be longer than 2000 characters.')
			setIsCreateLoading(false)
			return
		}
		const data = new FormData()
		data.set('content',content)
		data.set('file',files[0])
		
		onCreatePost(data)
	}

	return(
		<Popup className="small-popup">
	        <h3 className="pnewpost">Create new post</h3>
	        <form className="popup-form" onSubmit={createNewPost}>
				<p>Content</p>
				<input type="content" value={content}
					onChange={ev => setContent(ev.target.value)}/>
				<input type="file" onChange={ev => setFiles(ev.target.files)} style={{marginBottom: '5px'}}/>
				<button className="submitBtn pointer" style={{ marginTop: '5px' }}disabled={isCreateLoading}>Submit</button>
	        </form>
		</Popup>
	)
}