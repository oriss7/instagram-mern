import SERVER_URL from './const.service';

export async function getPost(postId) {
	const response = await fetch(`${SERVER_URL}/post/${postId}`)
	const post = await response.json()
	return post
}

export async function getUserPosts(userId) {
	const response = await fetch(`${SERVER_URL}/posts/${userId}`)
	const posts = await response.json()
	return posts
}

export async function getFollowingPosts(userId) {
	const response = await fetch(`${SERVER_URL}/followingPosts/${userId}`, {
		credentials: 'include'
	})
	if (response.ok) {
		const posts = await response.json();
		return posts
	} else {
		return []
	}
}

export async function addCommet(postId, userId, text) {
	await fetch(`${SERVER_URL}/commentpost/${postId}`, {
		method: 'POST',
  		headers: { 'Content-Type': 'application/json' },
  		body: JSON.stringify({ userId, text})
	})
}

export async function addLike(postId, userId) {
	await fetch(`${SERVER_URL}/likepost/${postId}`, {
		method: 'POST',
  		headers: { 'Content-Type': 'application/json' },
  		body: JSON.stringify({ userId })
	})
}

export async function addLikeComment(postId, commentId, userId) {
	await fetch(`${SERVER_URL}/likecomment/${postId}/${commentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
}

export async function deleteComment(postId, commentId) {
	await fetch(`${SERVER_URL}/deleteComment/${postId}/${commentId}`, {
		method: 'DELETE',
    })
}

export async function editPost(postId, content) {
	const response = await fetch(`${SERVER_URL}/post`, {
		method: 'PUT',
		body: JSON.stringify({postId, content}),
		headers: {'Content-Type':'application/json'},
		credentials: 'include'
	})
	return response
}

export async function deletePost(postId) {
	await fetch(`${SERVER_URL}/deletePost/${postId}`, {
		method: 'DELETE'
	})
}

export async function createPost(data) {
	const response = await fetch(`${SERVER_URL}/post`, {
		method: 'POST',
		body: data,
		credentials: 'include'
	})
	const postId = await response.json()
	return postId
}