import SERVER_URL from './const.service';

export async function getLoggedInUser() {
	const response = await fetch(`${SERVER_URL}/profile`, {
		credentials: 'include'
	})
	const user = await response.json();
	return user
}

export async function logout() {
	await fetch(`${SERVER_URL}/logout`, {
		credentials: 'include',
  		method: 'POST'
	})
}

export async function deleteUser(userId) {
	await fetch(`${SERVER_URL}/deleteUser/${userId}`, {
		method: 'DELETE'
	})
}

export async function login(username, password) {
	const response = await fetch(`${SERVER_URL}/login`, {
		method: 'POST',
		body: JSON.stringify({username,password}),
		headers: {'Content-Type':'application/json'},
		credentials: 'include'
	})
	return response
}

export async function register(name,username,password) {
	const response = await fetch(`${SERVER_URL}/register`, {
		method: 'POST',
		body: JSON.stringify({name,username,password}),
		headers: {'Content-Type':'application/json'}
	})
	return response
}

export async function deleteProfilePic(userId) {
	await fetch(`${SERVER_URL}/deleteProfilePic/${userId}`, {
		method: 'DELETE'
	})
}

export async function editProfile(data) {
	// const response = 
	await fetch(`${SERVER_URL}/profile`, {
		method: 'PUT',
		body: data,
		credentials: 'include'
	})
	// return response;
}

export async function follow(connectedUserId,pageUserId) {
	const response = await fetch(`${SERVER_URL}/follow`, {
		method: 'POST',
		body: JSON.stringify({connectedUserId,pageUserId}),
		headers: {'Content-Type':'application/json'},
		credentials: 'include'
	})
	const usersInfo = await response.json()
    const { connectedUser, pageUser } = usersInfo
    return { connectedUser, pageUser }
}