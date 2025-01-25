import React from 'react';
import {useEffect, useContext, useState} from 'react';
import { AuthContext } from '../context/authContext.js';
import Popup from '../cmps/Popup.js';

export default function EditProfile() {
	const {authState, onDeleteUser, onDeleteProfilePic, onEditProfile} = useContext(AuthContext)
	const [name, setName] = useState('')
	const [username, setUsername] = useState('')
	const [bio, setBio] = useState('')
	const [files, setFiles] = useState('')
	
  	
	useEffect(() => {
		if (authState.loggedInUser) {
			setName(authState.loggedInUser.name)
			setUsername(authState.loggedInUser.username)
			setBio(authState.loggedInUser.bio || '')
		}
	}, [authState.loggedInUser])

	async function handleEdit() {
		if (!name || !username) {
			alert('Those fields are required.')
			return
		} else if (name.length < 3 || name.length > 15){
			alert('Name should be in the range of 3 to 15 characters.')
			return
		} else if (username.length < 3 || username.length > 15){
			alert('Username should be in the range of 3 to 15 characters.')
			return
		} else if (bio.length > 150) {
			alert('Your bio cant be longer than 150 characters.')
			return
		}
		const data = new FormData()
		data.set('userId', authState.loggedInUser._id);
		data.set('name',name)
		data.set('username',username)
		if (files) {
            data.set('file', files[0])
        }
        data.set('bio',bio)

        await onEditProfile(data)
	}

	return(
		<Popup>
			<h3 className='pnewpost'>Edit profile</h3>
			{authState.loggedInUser &&(
				<>
				<form className="popup-form" onSubmit={(ev) => {ev.preventDefault();handleEdit()}}>
					<div>
						<p>Name</p>
						<input type="text" value={name}
								onChange={ev => setName(ev.target.value)} />
					</div>
					<div>
						<p>Username</p>
						<input type="text" value={username}
								onChange={ev => setUsername(ev.target.value)} />
					</div>
					<div>
						<input type="file" onChange={ev => setFiles(ev.target.files)} /> 
					</div>
					<div>
						<p>Bio</p>
						<input type="text" value={bio}
								onChange={ev => setBio(ev.target.value)} />
					</div>
					<button className="submitBtn pointer">Submit</button>
				</form>
				{authState.loggedInUser.profilePic &&
					<button className="submitBtn pointer" style={{background: 'grey'}} onClick={(ev) => {ev.preventDefault();onDeleteProfilePic();}}>Remove profile picture</button>
				}
				<button className="submitBtn pointer" style={{background: 'grey'}} onClick={(ev) => {ev.preventDefault();onDeleteUser();}}>Delete user</button>
				</>
			)}
		</Popup>
	)
}