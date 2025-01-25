import React from 'react';
import {Outlet} from 'react-router-dom';
import {useContext,useEffect} from 'react';
import { AccountContext } from '../context/accountContext.js';
import LeftSideBar from '../cmps/LeftSideBar';
import Posts from '../cmps/Posts';
import RightSideBar from '../cmps/RightSideBar';

export default function HomePage() {
	const {accountState,removeSelectedAccount} = useContext(AccountContext)
	useEffect(() => {
	  if (accountState.selectedAccount) {
	    removeSelectedAccount()
	  }
	}, []);

	return(
		<div className="appHome">
			<LeftSideBar/>
			<div className="mainContentHome main-app-content">
				<Posts />
				<RightSideBar />
				<Outlet />
			</div>
		</div>
	)
}