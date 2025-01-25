import React from 'react';
import {useContext,useState,useEffect} from 'react';
import {useParams} from 'react-router-dom';
import { AuthContext } from '../context/authContext.js';
import { AccountContext } from '../context/accountContext.js';
import AccountLink from '../cmps/AccountLink.js';
import Popup from '../cmps/Popup.js';

export default function FollowingPopup() {
  const {authState,onFollowOnPopup} = useContext(AuthContext)
  const {accountState,loadAccount} = useContext(AccountContext)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  
  const { userId } = useParams();
  useEffect(() => {
		async function name() {
			if (userId && !accountState.selectedAccount) {
        await loadAccount(userId)
			}	
		}
		name()
	}, [userId])
  if (!accountState.selectedAccount){
    return
  }

  return (
    <Popup>
      <h3 className='pnewpost'>Following</h3>

      <div className="usersListItem">
      {accountState.selectedAccount.following.map((user, index) => {
        const isUserFollow = user._id !== authState.loggedInUser._id && user.followers.some(follower => follower === authState.loggedInUser._id);
        return (
          <div key={index} className="usersListPopups">
            
            <AccountLink account={user} />

            {user._id !== authState.loggedInUser._id &&(
              <button onClick={async (ev) => {
                ev.preventDefault()
                setIsFollowLoading(true)
                await onFollowOnPopup(user._id)
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