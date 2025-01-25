import DefaultProfileIcon from '../assets/images/default-profile-icon.jpg';
import SERVER_URL from '../services/const.service';

export default function ProfilePic({profilePic, className}) {
    return(
        <>
            {profilePic ? (
                // <img src={`${SERVER_URL}/${profilePic}`} alt="" className={`roundImg ${className}`}/>
                <img src={profilePic} alt="" className={`roundImg ${className}`}/>
            ):(
                <img src={DefaultProfileIcon} alt="" className={`roundImg ${className}`}/>
            )}
        </>
    )
}