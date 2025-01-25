import React from 'react';
import {useContext,useEffect,useState} from 'react';
import { AuthContext } from '../context/authContext.js';
import { PostContext } from '../context/postContext.js';
import {useParams} from 'react-router-dom';
import AccountLink from '../cmps/AccountLink.js';
import Popup from '../cmps/Popup.js';

export default function LikesPopup() {
  const {authState} = useContext(AuthContext)
  const {postState,loadPost,onFollowOnLikes} = useContext(PostContext)
  const { postId } = useParams()
  const [isFollowLoading, setIsFollowLoading] = useState(false)

  useEffect(() => {
    async function name() {
      if (postId && (!postState.selectedPost || postState.selectedPost._id !== postId)){
        await loadPost(postId)
      }
    }
    name()
  },[postId])
  
  if (postState.isLoading || !postState.selectedPost) {
    return 
  }
  
  return (
    <Popup>
      <h3 className='pnewpost'>Likes</h3>
      <div className="usersListItem">
      {postState.selectedPost.likes.map((user, index) => {
        const isUserFollow = user._id !== authState.loggedInUser._id && user.followers.some(follower => follower === authState.loggedInUser._id);
        return (
          <div key={index} className="usersListPopups">
            <AccountLink account={user} />
            {user._id !== authState.loggedInUser._id &&(
              <button onClick={async (ev) => {
                ev.preventDefault()
                setIsFollowLoading(true)
                await onFollowOnLikes(user._id,postId)
                setIsFollowLoading(false)
                }}disabled={isFollowLoading} className="followBtn pointer">
                {!isUserFollow ? 'Follow' : 'Unfollow'}
              </button>
            )}
          </div>
        )
      })}
      </div>
    </Popup>
  );
}