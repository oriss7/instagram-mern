import React from 'react';
import {createContext,useState} from 'react';
import { getAccount } from '../services/account.service';

export const AccountContext = createContext({})

export function AccountContextProvider({children}) {
	// accounts: [],
	const [accountState,setAccountState] = useState({
		selectedAccount: null,
		isLoading: false
	});

	function setSelectedAccount(account) {
	    setAccountState(prevState => ({
	        ...prevState,
	        selectedAccount: account
	    }));
	}

	function setIsLoading(value) {
	    setAccountState(prevState => ({
	        ...prevState,
	        isLoading: value
	    }));
	}

	async function loadAccount(accountId) {
		setIsLoading(true)
		const account = await getAccount(accountId)
		setSelectedAccount(account)
		setIsLoading(false)
	}
	async function loadAccountWithoutLoading(accountId) {
		const account = await getAccount(accountId)
		setSelectedAccount(account)
	}

	function removeSelectedAccount() {
		setIsLoading(true)
		setSelectedAccount(null)
		setIsLoading(false)
	}
	
	return (
		<AccountContext.Provider value = {{accountState,setAccountState,loadAccount,loadAccountWithoutLoading,setSelectedAccount,setIsLoading,removeSelectedAccount}}>
			{children}
		</AccountContext.Provider>
	)
}