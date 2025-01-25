import React from 'react';
import { useNavigate} from 'react-router-dom';
import {createContext,useState,useContext} from 'react';
import { AccountContext } from './accountContext';
// import { PostContext } from './postContext';
import { getLoggedInUser, logout, deleteUser, login, register,
		deleteProfilePic, editProfile, follow } from '../services/auth.service';
import { useHandleClose } from '../cmps/useHandleClose';

export const AuthContext = createContext({})

export function AuthContextProvider({children}) {
	const [authState,setAuthState] = useState({
		loggedInUser: null,
		isLoading: false
	});

	const {accountState,setSelectedAccount,loadAccountWithoutLoading} = useContext(AccountContext)
	// const {loadPostWithoutLoading} = useContext(PostContext)
	const navigate = useNavigate();
	const handleClose = useHandleClose();

	function setLoggedInUser(user) {
	  setAuthState(prevState => ({
	    ...prevState,
	    loggedInUser: user
	  }));
	}

	function setIsLoading(value) {
	  setAuthState(prevState => ({
	    ...prevState,
	    isLoading: value
	  }));
	}
	
	async function loadLoggedInUser() {
		setIsLoading(true)
		const user = await getLoggedInUser()
		setLoggedInUser(user)
		setIsLoading(false);
		return user || null;
	}

	async function onLogout() {
		await logout()
		setLoggedInUser(null)
		navigate('/login')
	}

	async function onDeleteUser() {
		if (window.confirm('Are you sure you want to delete your account?')) {
			await deleteUser(authState.loggedInUser._id)
			setLoggedInUser(null)
			navigate('/login')
		}
	}

	async function onLogin(username, password) {
		const response = await login(username, password)
		if (response.ok) {
			response.json().then(user => {
				setLoggedInUser(user)
				navigate('/')
			})
		} else {
			const errorData = await response.json();
            alert(`${errorData.message || 'An unknown error occurred'}`);
		}
	}

	async function onRegister(name,username,password) {
		const response = await register(name,username,password)
		if (response.status === 200) {
			alert('registration successful')
			onLogin(username,password)
		} else {
			const errorData = await response.json();
            alert(`Registration failed: ${errorData.message || 'An unknown error occurred'}`);
		}
	}

	async function onDeleteProfilePic() {
		if (window.confirm('Are you sure you want to delete your profile picture?')) {
			await deleteProfilePic(authState.loggedInUser._id)
			await loadLoggedInUser()
	        handleClose()
		}
	}

	async function onEditProfile(data) {
		await editProfile(data)
		await loadLoggedInUser()
		handleClose()
	}
	
	async function onFollow(accountId) {
		const { connectedUser, pageUser } = await follow(authState.loggedInUser._id,accountId)
		setLoggedInUser(connectedUser)
		setSelectedAccount(pageUser)
	}

	async function onFollowOnPopup(accountId) {
		const { connectedUser, pageUser } = await follow(authState.loggedInUser._id,accountId)
		setLoggedInUser(connectedUser)
		loadAccountWithoutLoading(accountState.selectedAccount._id)
	}

	return (
		<AuthContext.Provider value = {{authState,setAuthState,setLoggedInUser,setIsLoading,loadLoggedInUser,
										onLogout,onDeleteUser,onLogin,onRegister,onDeleteProfilePic,
										onEditProfile,onFollow,onFollowOnPopup}}>
			{children}
		</AuthContext.Provider>
	)
}