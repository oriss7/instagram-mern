import React from 'react';
import {useState,useEffect} from 'react';
import SERVER_URL from '../services/const.service';
import AccountLink from '../cmps/AccountLink';
import Popup from '../cmps/Popup';

export default function Search() {
	const [searchTerm, setSearchTerm] = useState('')
  	const [searchResults, setSearchResults] = useState([])
  	const [users, setUsers] = useState([])

  	useEffect(() => {
		fetch(`${SERVER_URL}/users`, {
			credentials: 'include'
		}).then(response => {
	    if (response.ok) {
	      response.json().then(users => {
	        const formattedUsers = users.map(user => {
	          return {
	            _id: user._id,
	            name: user.name,
	            username: user.username,
	            profilePic: user.profilePic,
	            // followers: user.followers
	          }
	        })
	        setUsers(formattedUsers)
	      })
	    } else {
	      setUsers([])
	    }
	  })
	}, [])

	const handleSearch = (event) => {
	    const { value } = event.target
	    setSearchTerm(value)
	    if (value) {
	      const usernameResults = users.filter(user => user.username.toLowerCase().includes(value.toLowerCase()))
		  const nameResults = users.filter(user => user.name.toLowerCase().includes(value.toLowerCase()))
		  const combinedResults = [...usernameResults, ...nameResults]
		  const uniqueResults = combinedResults.filter((user, index, self) => 
			  index === self.findIndex((u) => u._id === user._id)
		  )
	      setSearchResults(uniqueResults)
	    } else {
	      setSearchResults([])
	    }
	}

	return(
		<Popup>
		<div className="searchPopup">
			<div style= {{borderBottom: '1.8px solid lightgrey'}}>
				<h2>Search</h2>
		        <input className="search-input"
		          type="text"
		          placeholder="Search"
		          value={searchTerm}
		          onChange={handleSearch}/>
			</div>
	        {searchTerm && (
			<div className="searchResults">
				{searchResults.slice(0,20).map(user => (
					<div key={user._id}>
						<AccountLink account={user} />
					</div>
				))}
			</div>
	        )}
      	</div>
      	</Popup>
	)
}