import React from 'react';
import {useEffect,useContext,useState} from 'react';
import {Outlet,useParams} from 'react-router-dom';
import LeftSideBar from '../cmps/LeftSideBar';
import { AuthContext } from '../context/authContext.js';
import { AccountContext } from '../context/accountContext.js';
import { PostContext } from '../context/postContext.js';
import { ReactComponent as CommentFullIcon } from '../assets/images/comment_full.svg';
import { ReactComponent as LikeFullIcon } from '../assets/images/like_full.svg';
import { ReactComponent as LoadingIcon } from '../assets/images/loader.svg';
import ProfilePic from '../cmps/ProfilePic';
import SERVER_URL from '../services/const.service';
import { useHandleNavigation } from '../cmps/useHandleNavigation';

export default function ProfilePage() {
	const { userId } = useParams();
	const {authState,onFollow} = useContext(AuthContext)
	const {accountState,loadAccount} = useContext(AccountContext)
	const {postState,loadPosts} = useContext(PostContext)
	const [isFollowLoading, setIsFollowLoading] = useState(false)
	
	const handleNavigation = useHandleNavigation()

	useEffect(() => {
		async function name() {
			if (userId) {
				await loadAccount(userId)
				await loadPosts(userId)
			}	
		}
		name()
	}, [userId])

	const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 450);

	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth <= 450);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);
	// useMemo
	// const posts = useMemo(() => postState.posts, [postState.posts]);

	let isUserFollow
	if (accountState.selectedAccount){
		isUserFollow = accountState.selectedAccount.followers.some(user => user._id === authState.loggedInUser._id)	
	}

	return(
		<div className="app">
			<LeftSideBar/>
			{accountState.isLoading || postState.isLoading ? (
				<div className='loading-container'>
					<LoadingIcon />
				</div>
			) : (
				<>
				{authState.loggedInUser && accountState.selectedAccount &&(
					<div className="mainContentProfile main-app-content">

						<div className="profileAccountInfoAndPic">
						{isMobileView ? (
							<div className='mobile-view-profile'>
								<span className="profileUsername">{accountState.selectedAccount.username}</span>
								<div className='mobile-view-pic-and-stats'>
									<ProfilePic profilePic={accountState.selectedAccount.profilePic} className="profilePicProfile"/>
									<div className="profileStatsContainer">
										<div className="profileStatItem">
											<strong>{postState.posts.length}</strong><span>Posts</span>
										</div>
										<div className="profileStatItem pointer" onClick={() => handleNavigation(`/profile/${accountState.selectedAccount._id}/followers`)}>
											<strong>{accountState.selectedAccount.followers.length}</strong><span>Followers</span>
										</div>
										<div className="profileStatItem pointer" onClick={() => handleNavigation(`/profile/${accountState.selectedAccount._id}/following`)}>
											<strong>{accountState.selectedAccount.following.length}</strong><span>Following</span>
										</div>
									</div>
								</div>
								<strong>{accountState.selectedAccount.name}</strong>
								{accountState.selectedAccount.bio && (
									<p>{accountState.selectedAccount.bio}</p>
								)}
							
							<div className='profileUsernameAndButton'>
								{userId === authState.loggedInUser._id &&(
									<button onClick={() => handleNavigation(`/profile/${authState.loggedInUser._id}/editProfile`)} 
									className="profileBtn pointer">Edit Profile</button>
								)}
								{userId !== authState.loggedInUser._id &&(
									<button onClick={async (ev) => {
										ev.preventDefault()
										setIsFollowLoading(true)
										await onFollow(accountState.selectedAccount._id)
										setIsFollowLoading(false)
										}}disabled={isFollowLoading} className="profileBtn pointer"style={{ color: 'white', background: '#1E90FF'}}>
										{!isUserFollow ? 'Follow' : 'Unfollow'}
									</button>
								)}
							</div>
							</div>
						) : (
							<>
							<div>
								<ProfilePic profilePic={accountState.selectedAccount.profilePic} className="profilePicProfile"/>
							</div>
							<div className="profileAccountInfo">
								<div className="profileUsernameAndButton">
									<span className="profileUsername">{accountState.selectedAccount.username}</span>
									{userId === authState.loggedInUser._id &&(
										<button onClick={() => handleNavigation(`/profile/${authState.loggedInUser._id}/editProfile`)} 
										className="profileBtn pointer">Edit Profile</button>
									)}
									{userId !== authState.loggedInUser._id &&(
										<button onClick={async (ev) => {
											ev.preventDefault()
											setIsFollowLoading(true)
											await onFollow(accountState.selectedAccount._id)
											setIsFollowLoading(false)
											}}disabled={isFollowLoading} className="profileBtn pointer"style={{ color: 'white', background: '#1E90FF'}}>
											{!isUserFollow ? 'Follow' : 'Unfollow'}
										</button>
									)}
								</div>
								<div className="profileStatsContainer">
									<div className="profileStatItem">
										<strong>{postState.posts.length}</strong><span>Posts</span>
									</div>
									<div className="profileStatItem pointer" onClick={() => handleNavigation(`/profile/${accountState.selectedAccount._id}/followers`)}>
										<strong>{accountState.selectedAccount.followers.length}</strong><span>Followers</span>
									</div>
									<div className="profileStatItem pointer" onClick={() => handleNavigation(`/profile/${accountState.selectedAccount._id}/following`)}>
										<strong>{accountState.selectedAccount.following.length}</strong><span>Following</span>
									</div>
								</div>
								
								<strong>{accountState.selectedAccount.name}</strong>
								{accountState.selectedAccount.bio && (
									<p>{accountState.selectedAccount.bio}</p>
								)}
							</div>
							</>
						)}							
						</div>
						{/* <img src={`${SERVER_URL}/${post.cover}`} alt="" className="ProfilePageCovers"/> */}
						<div className="ProfilePosts">
							{postState.posts.length > 0 && postState.posts.map(post => (
								<div key={post._id} className="postCoverWrapper pointer" onClick={() => handleNavigation(`/profile/${accountState.selectedAccount._id}/post/${post._id}`)}>
									<img src={post.cover} alt="" className="ProfilePageCovers"/>
									<div className="hover-text">
										<div className="profileSvg">
										<LikeFullIcon />
										{post.likes.length}
										</div>
										<div className="profileSvg">
										<CommentFullIcon />
										{post.comments.length}
										</div>
									</div>
								</div>	
							))}
						</div>
					</div>
				)}
				</>
			)}
			<Outlet />
		</div>
	)
}