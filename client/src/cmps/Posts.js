import React from 'react';
import { AuthContext } from '../context/authContext.js';
import { PostContext } from '../context/postContext.js';
import {useContext,useEffect} from 'react';
import SinglePost from './SinglePost.js';
import { ReactComponent as LoadingIcon } from '../assets/images/loader.svg';

export default function Posts() {
	const {authState} = useContext(AuthContext)
	const {postState,loadFollowingPosts,onAddComment,onAddLike} = useContext(PostContext)

	useEffect(() => {
		if (authState.loggedInUser && authState.loggedInUser._id) {
			loadFollowingPosts(authState.loggedInUser._id)
		}
    }, [authState.loggedInUser])

	async function handleComment(postId, postComment, setPostComment) {
		if (postComment.length > 2000) {
			alert('Comment should not be longer than 2000 characters. asdasdasdsd')
			return
		}
		await onAddComment(postId, postComment)
		setPostComment('')
	}

	if (postState.isLoading || !authState.loggedInUser) {
		return (
			<div className="post-list">
				<div className='loading-container'>
					<LoadingIcon />
				</div>
			</div>
		  )
	}
	
	return (
		<div className='post-list'>
		{postState.posts.length > 0 ? (
			postState.posts.map((post, index) => {
				const isUserLiked = post.likes.some(like => like._id === authState.loggedInUser._id);
				return(					
					<div className="post" key={index}>
						<SinglePost post={post} isUserLiked={isUserLiked} onAddLike={onAddLike} handleComment={handleComment} />
					</div>
				)				
			})
		):(
			<h1>Start following your friends on Instagram and see them sharing their journeys!</h1>
		)}
      	</div>
	);
}