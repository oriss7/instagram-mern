import {useState} from 'react';
import SERVER_URL from '../services/const.service.js';
import ProfilePic from './ProfilePic.js';
import { ReactComponent as CommentEmptyIcon } from '../assets/images/comment_empty.svg';
import { ReactComponent as LikeFullIcon } from '../assets/images/like_full.svg';
import { ReactComponent as LikeEmptyIcon } from '../assets/images/like_empty.svg';
import { useHandleNavigation } from './useHandleNavigation';

export default function SinglePost({post, isUserLiked, onAddLike, handleComment}) {
    const [postComment, setPostComment] = useState('')
    const [isLikeLoading, setIsLikeLoading] = useState(false)
	const [isCommentLoading, setIsCommentLoading] = useState(false)
    const handleNavigation = useHandleNavigation()
    // <img src={`${SERVER_URL}/${post.cover}`} alt="" className="postCover"/>
    return(
        <>
        <div className="postUserDetails">
            <div onClick={() => handleNavigation(`/profile/${post.author._id}`)}>
                <ProfilePic profilePic={post.author.profilePic} className="profilePicPost pointer"/>
            </div>
            <strong className="pointer" onClick={() => handleNavigation(`/profile/${post.author._id}`)}>
                {post.author.username}</strong>
        </div>
        
        
        <img src={post.cover} alt="" className="postCover" />
        
        <div className="postLikeCommentSvgs">	
            <button onClick={async () =>{
                    setIsLikeLoading(true)
                    await onAddLike(post._id)
                    setIsLikeLoading(false)
                    }}disabled={isLikeLoading} className="like-button">
                {!isUserLiked ? (
                    <LikeEmptyIcon className="blackSvg pointer"/>
                ) : (
                    <LikeFullIcon className="redLikeSvg pointer"/>
                )}
            </button>
            <CommentEmptyIcon className="blackSvg pointer" onClick={() => handleNavigation(`/post/${post._id}`)} />
        </div>
        <div className='postLikesConetentViewcomments'>
            {post.likes.length > 0 &&
                <strong className="pointer" onClick={() => handleNavigation(`/likes/${post._id}`)}>
                        {post.likes.length} likes
                </strong>
            }
            <p style={{margin: '0'}}>
                <strong className="pointer" onClick={() => handleNavigation(`/profile/${post.author._id}`)}>{post.author.username}&nbsp;</strong>
                {post.content}
            </p>
            {post.comments.length > 0 &&
                <span className="pointer" style={{color: 'grey'}} 
                        onClick={() => handleNavigation(`/post/${post._id}`)} >
                        View all {post.comments.length} comments</span>
            }
        </div>
        <div className="postComment">
            <input type="text" placeholder="Add a comment..." value={postComment || ''}
                    onChange={ev => setPostComment(ev.target.value)} /> 
            {postComment && 
            <button onClick={async () => {
                setIsCommentLoading(true)
                await handleComment(post._id, postComment, setPostComment)
                setIsCommentLoading(false)
                }}disabled={isCommentLoading} className="pointer">Post</button>}
        </div>   
        </>
    )
}