import React from 'react';
import {useContext} from 'react';
import { AuthContext } from '../context/authContext.js';
import AccountLink from './AccountLink';
import { ReactComponent as LoadingIcon } from '../assets/images/loader.svg';
import { useHandleNavigation } from './useHandleNavigation';

export default function RightSideBar() {
	const {authState} = useContext(AuthContext)
	const handleNavigation = useHandleNavigation()

	if (!authState.loggedInUser) {
		return (
			<div className='loading-container'>
			  <LoadingIcon />
			</div>
		  )
	}	

	return(
		<div>
		{authState.loggedInUser.username && (
			<div className="rightSideBar">
				<div>
					<AccountLink account={authState.loggedInUser} />	
				</div>
				<div>
					<span className="rightSideBarLogout pointer" onClick={() => handleNavigation(`/logout`)} >Logout</span>
				</div>
			</div>
		)}
		</div>
	)
}