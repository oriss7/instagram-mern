import React from 'react';
import {useState,useContext,useEffect} from 'react';
import { AuthContext } from '../context/authContext.js';
import {Link,useNavigate} from 'react-router-dom';

export default function LoginPage() {
	const {authState,onLogin} = useContext(AuthContext)
	const [username,setUsername] = useState('')
	const [password,setPassword] = useState('')

	const navigate = useNavigate();
	useEffect(() => {
	  if (authState.loggedInUser) {
	    navigate('/')
	  }
	}, []);

	async function handleLogin() {
		if (!username || !password) {
			alert('All fields are required.')
			return
		}
        await onLogin(username,password)
	}
	
	return(
		<div className="login">
			<div className="login-user">
				<h1>Instagram</h1>
				<h2>Login</h2>				
				<form onSubmit={(ev) => {ev.preventDefault();handleLogin()}}>
					<input type="text" placeholder="Username" value={username}
						onChange={ev => setUsername(ev.target.value)}/>
					<input type="password" placeholder="Password" value={password}
						onChange={ev => setPassword(ev.target.value)}/>
					<button className="submitBtn pointer">Log in</button>
				</form>
			</div>
			<div className="DontHaveAccount">
				<span>Don't have an account?&nbsp;</span>
				<Link to={`/register`}>Sign up</Link>
			</div>
		</div>
	)
}