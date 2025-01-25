import React from 'react';
import {useState,useContext,useEffect} from 'react';
import { AuthContext } from '../context/authContext.js';
import {Link,useNavigate} from 'react-router-dom';

export default function RegisterPage() {
	const {authState,onRegister} = useContext(AuthContext)
	const [name, setName] = useState('')
	const [username, setUsername] = useState('')
	const [password , setPassword] = useState('')
	const [isRegisterLoading, setIsRegisterLoading] = useState(false)
	
	const navigate = useNavigate();
	useEffect(() => {
	  if (authState.loggedInUser) {
	    navigate('/')
	  }
	}, []);

	async function handleRegister() {
		if (!name || !username || !password) {
			alert('All fields are required.')
			return
		} else if (name.length < 3 || name.length > 15){
			alert('Name should be in the range of 3 to 15 characters.')
			return
		} else if (username.length < 3 || username.length > 15){
			alert('Username should be in the range of 3 to 15 characters.')
			return
		} else if (password.length < 7 || password.length > 17){
			alert('Password should be in the range of 7 to 17 characters.')
			return
		}
        await onRegister(name,username,password)
	}

	return(
		<div className="register">
			<div className="register-user">
				<h1>Instagram</h1>
				<h2>Register</h2>
				<h4>Sign up to see photos and videos<br/>&nbsp;&nbsp;&nbsp;&nbsp;
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;from your friends.</h4>
				<form onSubmit={async (ev) => {ev.preventDefault();
					setIsRegisterLoading(true)
					await handleRegister()
					setIsRegisterLoading(false)}}>
					
					<input type="text" placeholder="Full name" value={name}
							onChange={ev => setName(ev.target.value)} />
					<input type="text" placeholder="Username" value={username}
							onChange={ev => setUsername(ev.target.value)} />
					<input type="password" placeholder="Password" value={password}
							onChange={ev => setPassword(ev.target.value)} />
					<button className="submitBtn pointer" disabled={isRegisterLoading}>Sign up</button>
				</form>
			</div>
			<div className="HaveAccount">
				<span>Have an account?&nbsp;</span>
				<Link to={`/login`}>Log in</Link>
			</div>
		</div>		
	)
}