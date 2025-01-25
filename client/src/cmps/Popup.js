import { useHandleClose } from './useHandleClose';
import useCloseOnOutsideClick from './useCloseOnOutsideClick';

export default function Popup({children, className}) {
    useCloseOnOutsideClick()
  	const handleClose = useHandleClose()
    return(
        <div className="popup-overlay">
            <div className={`popup ${className}`}>
                <button className="close-button pointer" onClick={handleClose}>&times;</button>
                {children}
            </div>
        </div>
    )
}