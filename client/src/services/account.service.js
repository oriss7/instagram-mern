import SERVER_URL from './const.service';

export async function getAccount(accountId) {
	const response = await fetch(`${SERVER_URL}/profile/${accountId}`)
    const account = await response.json()
    return account
}