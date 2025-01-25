import { AccountContextProvider } from './accountContext';
import { AuthContextProvider } from './authContext';
import { PostContextProvider } from './postContext';

const AppProvider = ({ children }) => {
  return (
    <AccountContextProvider>
      <AuthContextProvider>
        <PostContextProvider>
          {children}
        </PostContextProvider>
      </AuthContextProvider>
    </AccountContextProvider>
  );
};

export {AppProvider};

/////////////////////////////////////////////////////

// import React, { createContext, useContext } from 'react';
// import { AuthContext } from './authContext';
// import { PostContext } from './postContext';
// import { AccountContext } from './accountContext';

// // Create the CombinedContext
// const CombinedContext = createContext();

// // Create a provider component
// export const CombinedProvider = ({ children }) => {
//   // Access the individual contexts
//   const authContext = useContext(AuthContext);
//   const postContext = useContext(PostContext);
//   const accountContext = useContext(AccountContext);

//   return (
//     <CombinedContext.Provider value={{ authContext, postContext, accountContext }}>
//       {children}
//     </CombinedContext.Provider>
//   );
// };

// // Custom hook for using the CombinedContext
// export const useCombinedContext = () => useContext(CombinedContext);