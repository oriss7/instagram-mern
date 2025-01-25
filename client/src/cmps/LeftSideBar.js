import React from 'react';
import { useLocation } from 'react-router-dom';
import {useContext} from 'react';
import { AuthContext } from '../context/authContext.js';
import { ReactComponent as HomeIcon } from '../assets/images/home.svg';
import { ReactComponent as SearchIcon } from '../assets/images/search.svg';
import { ReactComponent as CreateIcon } from '../assets/images/create.svg';
import { ReactComponent as LogoutIcon } from '../assets/images/logout.svg';
import ProfilePic from './ProfilePic';
import { useHandleNavigation } from './useHandleNavigation';

export default function LeftSideBar() {
	const {authState} = useContext(AuthContext)
	const location = useLocation()
  	let basePath
  	if (location.pathname === '/') {
  		basePath = ''
  	} else {
  		basePath = location.pathname
  	}
	const handleNavigation = useHandleNavigation()
	
	return(
		<div className="leftSideBar">
			<h1 className="pointer" onClick={() => handleNavigation(`/`)}>Instagram</h1>

			<p className="sidebar-item pointer" onClick={() => handleNavigation(`/`)}>
				<HomeIcon className="btn-img"/>
				<span>Home</span>
			</p>

			<p className="sidebar-item pointer"
				onClick={() => window.innerWidth < 450 ? handleNavigation('/search') :
				handleNavigation(`${basePath}/search`)}>
				<SearchIcon className="btn-img"/>
				<span>Search</span>
			</p>

			<p className="sidebar-item pointer"
  				onClick={() => window.innerWidth < 450 ? handleNavigation('/create') :
				handleNavigation(`${basePath}/create`)}>
	      		<CreateIcon className="btn-img"/>
				<span>Create</span>
			</p>

			{authState.loggedInUser &&
			<>
				<p className="sidebar-item pointer" onClick={() => handleNavigation(`/profile/${authState.loggedInUser._id}`)}>
					<ProfilePic profilePic={authState.loggedInUser.profilePic} className="profilePicLeft btn-img"/>						
					<span>Profile</span>
				</p>
			</>
			}
			<p className="sidebar-item pointer"
			 	onClick={() => window.innerWidth < 450 ? handleNavigation('/logout') :
				handleNavigation(`${basePath}/logout`)} >
	      		<LogoutIcon className="btn-img"/>
				<span>Logout</span>
			</p>

		</div>
	)
}