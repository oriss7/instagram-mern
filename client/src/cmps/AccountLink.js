import ProfilePic from './ProfilePic';
import { useHandleNavigation } from './useHandleNavigation';

export default function AccountLink({account}) {
    const handleNavigation = useHandleNavigation()
    
    return(
        <div className="accountLink pointer" onClick={() => handleNavigation(`/profile/${account._id}`)}>
            <ProfilePic profilePic={account.profilePic} />
            <div className="accountInfo">
                <span>{account.username}</span>
                <span className="accountName ">{account.name}</span>
            </div>
        </div>
    )
}