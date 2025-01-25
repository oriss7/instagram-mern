const contextsMap = {};

export const registerContext = (contextKey, context) => {
    contextsMap[contextKey] = context;
}

export const getContextsMap = () => {
  return  contextsMap;
}

// import { getContextsMap, registerContext } from './contextRegistration';
// registerContext('auth', AuthContext);
// const postContext = getContextsMap().post;