import React from 'react';
import {createContext,useState,useContext} from 'react';
import { AuthContext } from './authContext';
import { AccountContext } from './accountContext';
import { getPost, getUserPosts, getFollowingPosts, addCommet,addLike, addLikeComment,
	deleteComment, editPost, deletePost, createPost } from '../services/post.service';
import { follow } from '../services/auth.service';
import {useNavigate} from 'react-router-dom';
import { useHandleClose } from '../cmps/useHandleClose';

export const PostContext = createContext({})

export function PostContextProvider({children}) {
	const [postState,setPostState] = useState({
		posts: [],
		selectedPost: null,
		isLoading: false
	});
	const {authState, setLoggedInUser} = useContext(AuthContext)
	const {accountState} = useContext(AccountContext)
	const navigate = useNavigate();
	const handleClose = useHandleClose();

	function setIsLoading(value) {
	    setPostState(prevState => ({
	        ...prevState,
	        isLoading: value
	    }));
	}
	function setPosts(posts) {
	    setPostState(prevState => ({
	        ...prevState,
	        posts: posts
	    }));
	}
	function setPost(post) {
	    const postIdx = postState.posts.findIndex(c => c._id === post._id);
	    let updatedPosts = [...postState.posts];

	    if (postIdx !== -1) {
	        updatedPosts.splice(postIdx, 1, post);
	    }

	    setPostState(prevState => ({
	        ...prevState,
	        selectedPost: post,
	        posts: updatedPosts
	    }));
	}
	function removePost(postId) {
	    setPostState(prevState => ({
	        ...prevState,
	        selectedPost: null,
	        posts: prevState.posts.filter(post => post._id !== postId)
	    }));
	}	
	async function loadPosts(userId) {
		setIsLoading(true);
		const posts = await getUserPosts(userId)
		setPosts(posts)
		setIsLoading(false);
	}
	async function loadFollowingPosts(userId) {
		setIsLoading(true)
		const posts = await getFollowingPosts(userId)
		setPosts(posts)
		setIsLoading(false)
	}	
	async function loadPost(postId) {
		setIsLoading(true);
		const post = await getPost(postId)
		setPost(post)
		setIsLoading(false);
	}
	async function loadPostWithoutLoading(postId) {
		const post = await getPost(postId)
		setPost(post)
	}
	async function addNewPostToPosts(postId) {
		const post = await getPost(postId)
		setPostState(prevState => ({
			...prevState,
			posts: [post, ...prevState.posts]
		}));
	}

	async function onAddComment(postId, text) {
		await addCommet(postId, authState.loggedInUser._id, text)
		loadPostWithoutLoading(postId)
	}

	async function onAddLike(postId) {
		await addLike(postId, authState.loggedInUser._id)
		loadPostWithoutLoading(postId)
	}

	async function onAddLikeComment(commentId) {
		await addLikeComment(postState.selectedPost._id, commentId, authState.loggedInUser._id)
	    loadPostWithoutLoading(postState.selectedPost._id)
	}

	async function onDeleteComment(commentId) {
		if (window.confirm('Are you sure you want to delete this comment?')) {
			await deleteComment(postState.selectedPost._id, commentId)
			loadPostWithoutLoading(postState.selectedPost._id)
		}
	}
	async function onEditPost(content) {
		await editPost(postState.selectedPost._id, content)
		await loadPost(postState.selectedPost._id)
		handleClose()
	}

	async function onDeletePost() {
		if (window.confirm('Are you sure you want to delete your post?')) {
			await deletePost(postState.selectedPost._id)
			await removePost(postState.selectedPost._id)
			navigate(`/profile/${postState.selectedPost.author._id}`)
		}
	}

	async function onCreatePost(data) {
		const response = await createPost(data)
		if (accountState.selectedAccount) {
			if (authState.loggedInUser._id === accountState.selectedAccount._id) {
				await addNewPostToPosts(response)
			}
		}
		handleClose()
	}

	async function onFollowOnLikes(accountId,postId) {
		const { connectedUser, pageUser } = await follow(authState.loggedInUser._id,accountId)
		setLoggedInUser(connectedUser)
		loadPostWithoutLoading(postId)
	}

	return (
		<PostContext.Provider value = {{postState,setPostState,setPost,setPosts,setIsLoading,loadPosts,
							loadPost,loadFollowingPosts,loadPostWithoutLoading,removePost,
							addNewPostToPosts,onAddComment,onAddLike,onAddLikeComment,onDeleteComment,
							onEditPost,onDeletePost,onCreatePost,onFollowOnLikes}}>
			{children}
		</PostContext.Provider>
	)
}