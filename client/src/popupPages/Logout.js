import React, { Children } from 'react';
import { useHandleClose } from '../cmps/useHandleClose.js';
import {useContext} from 'react';
import { AuthContext } from '../context/authContext.js';
import Popup from '../cmps/Popup.js';

export default function Logout() {
	const {onLogout} = useContext(AuthContext)
  	const handleClose = useHandleClose()

	return(
		<Popup className="small-popup">
	        <h2 className='pnewpost'>Log out of your account?</h2>
           	<button className="confirmLogoutPopupBtn pointer" onClick={onLogout} >Log Out</button>
			<span className="logoutMiddleBorder"/>
           	<button className="cancelLogoutPopupBtn pointer" onClick={handleClose} >Cancel</button>
		</Popup>
	)
}