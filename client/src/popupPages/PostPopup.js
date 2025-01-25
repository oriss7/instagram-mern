import React from 'react';
import {useEffect,useContext,useState} from 'react';
import {useLocation,Outlet,useParams} from 'react-router-dom';
import { AuthContext } from '../context/authContext.js';
import { PostContext } from '../context/postContext.js';
import { ReactComponent as TrashIcon } from '../assets/images/trash.svg';
import { ReactComponent as LikeFullIcon } from '../assets/images/like_full.svg';
import { ReactComponent as LikeEmptyIcon } from '../assets/images/like_empty.svg';
import { ReactComponent as EditIcon } from '../assets/images/edit.svg';
import SERVER_URL from '../services/const.service.js';
import ProfilePic from '../cmps/ProfilePic.js';
import { useHandleClose } from '../cmps/useHandleClose.js';
import useCloseOnOutsideClick from '../cmps/useCloseOnOutsideClick.js';
import { useHandleNavigation } from '../cmps/useHandleNavigation';

export default function PostPopup() {
  const {authState} = useContext(AuthContext)
  const {postState,loadPost,onAddComment,onAddLike,onAddLikeComment,onDeleteComment} = useContext(PostContext)
  const [postComment, setPostComment] = useState('')
  const location = useLocation()
  const basePath = location.pathname
  const { postId } = useParams()

  const [isLikeLoading, setIsLikeLoading] = useState(false)
  const [isCommentLoading, setIsCommentLoading] = useState(false)
  const [isLikeCommentLoading, setIsLikeCommentLoading] = useState(false)
  
  useEffect(() => {
    async function name() {
      if (postId && (!postState.selectedPost || postState.selectedPost._id !== postId)){
        await loadPost(postId)
      } 
    }
    name()
  },[postId])

  useCloseOnOutsideClick()
  const handleClose = useHandleClose();
  const handleNavigation = useHandleNavigation()

  async function handleComment() {
		if (postComment.length > 2000) {
			alert('Comment should not be longer than 2000 characters.')
			return
		}
		await onAddComment(postState.selectedPost._id, postComment)
    setPostComment('')
	}

  if (postState.isLoading) {
    return
  }
  let isUserLiked
  if (postState.selectedPost && authState.loggedInUser) {
    isUserLiked = postState.selectedPost.likes.some(like => like._id === authState.loggedInUser._id)
  } else {
    return
  }
  
  return (
    <div className="popup-overlay">
      <div className="popup-post">
        <button className="close-button pointer" onClick={handleClose}>&times;</button>
        <img src={postState.selectedPost.cover} alt="" className="popupImg"/>
        <div className="popup-post-details">
          <ul>

            <div className="userInfo-popup">
              <div className='postPopupUserDetails'>
                <div className='pointer' onClick={() => handleNavigation(`/profile/${postState.selectedPost.author._id}`)}>
                  <ProfilePic profilePic={postState.selectedPost.author.profilePic} className="profilePicLeft"/>
                </div>
                <strong className='pointer' onClick={() => handleNavigation(`/profile/${postState.selectedPost.author._id}`)}>
                  {postState.selectedPost.author.username}</strong>
              </div>

              {authState.loggedInUser._id === postState.selectedPost.author._id && postState.selectedPost.content &&( 
                <EditIcon style={{width: '1.5em'}} onClick={() => handleNavigation(`${basePath}/editPost`)} className="blackSvg pointer"/>
              )}
            </div>   

            <div className="popup-comments">
              <div className="post-popup-text">
                <div className='pointer' onClick={() => handleNavigation(`/profile/${postState.selectedPost.author._id}`)}>
                  <ProfilePic profilePic={postState.selectedPost.author.profilePic} className="profilePicLeft"/>
                </div>
                <div className="usernameCommentText">
                  <strong className='pointer' onClick={() => handleNavigation(`/profile/${postState.selectedPost.author._id}`)}>
                    {postState.selectedPost.author.username}</strong>
                  <p className="commentText">{postState.selectedPost.content}</p>
                </div>
              </div>
              {postState.selectedPost.comments && postState.selectedPost.comments.map((comment, index) => (
                <li key={index}>
                  <div className='pointer' onClick={() => handleNavigation(`/profile/${comment.user._id}`)}>
                    <ProfilePic profilePic={comment.user.profilePic} className="profilePicLeft"/>
                  </div>
                  <div className="usernameCommentText">
                    <strong className='pointer' onClick={() => handleNavigation(`/profile/${comment.user._id}`)}>
                      {comment.user.username}</strong>
                    <p className="commentText">{comment.text}</p>
                  </div>
                  <div className="comments-svgs">
                    
                    <div className="like-comments-popup">
                      <button onClick={async () =>{
                          setIsLikeCommentLoading(true)
                          await onAddLikeComment(comment._id)
                          setIsLikeCommentLoading(false)
                        }}disabled={isLikeCommentLoading} className="like-button">
                        {comment.likes.some(like => like._id === authState.loggedInUser._id) ? (
                          <LikeFullIcon className="redLikeSvg pointer"/>
                        ) : (
                          <LikeEmptyIcon className="blackSvg pointer"/>
                        )}
                      </button>

                      {comment.likes.length > 0 &&
                        <p>{comment.likes.length}</p>              
                      }
                    </div>
                    <div>
                      {comment.user.username === authState.loggedInUser.username && (
                        <TrashIcon className="blackSvg pointer" onClick={() => onDeleteComment(comment._id)}/>                
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </div>

            <div className="popup-post-bottom">
              <div className="like-post-popup">
                <button onClick={async () =>{
										setIsLikeLoading(true)
										await onAddLike(postState.selectedPost._id)
										setIsLikeLoading(false)
									}}disabled={isLikeLoading} className="like-button">
                  {!isUserLiked ? (
                      <LikeEmptyIcon className="blackSvg pointer"/>
                  ) : (
                    <LikeFullIcon className="redLikeSvg pointer"/>
                  )}
                </button>                 
                {postState.selectedPost.likes.length > 0 &&
                    <strong>{postState.selectedPost.likes.length} likes</strong>
                }
              </div>

              <div className="postcommentPopup">
                <ProfilePic profilePic={authState.loggedInUser.profilePic} className="profilePicLeft"/>
                <input type="text" placeholder="Add a comment..." value={postComment || ''}
                    onChange={ev => setPostComment(ev.target.value)} />
                {postComment && 
                <button onClick={async () => {
									setIsCommentLoading(true)
                  await handleComment()
									setIsCommentLoading(false)
									}}disabled={isCommentLoading} className="like-button pointer">Post</button>}                
              </div>
            </div>
          </ul>
        </div>
      <Outlet />
      </div>
    </div>
  );
}