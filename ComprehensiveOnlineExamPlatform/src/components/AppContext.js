import React, { createContext, useState,useEffect } from 'react';
import axios from 'axios';
import HomePage from './HomePage';

export const AppContext = createContext();
export const AppProvider = ({ children }) => {

    const [username, setUsername] = useState('');                        // log in current user
    const [currentUserInfor, setCurrentUserInfor] = useState({});       // user informations

    const [practiceBank, setPracticeBank] = useState([]);              // practice bank
    const [examRuningState, setExamRuningState] = useState(false);    // for exam jump out

    const [functs, setfuncts] = useState(<HomePage/>);               // for changing display page
    const [isloading, setIsloading] = useState(true);               // for changing display page

    // for mode mode
    const [demoMode, setDemoMode] = useState(false)                // set for Demo mode display
    const [userAccountDemo, setUserAccountDemo] = useState([])    // set for  user account demo
    const [examBankDemo, setExamBankDemo] = useState([])        // set for  exam bank demo
    const [examModesDemo, setExamModesDemo] = useState([])     // set for  exam modes demo

    
    //load the practice question from back end service
    useEffect( () => {
      if(demoMode){
         initializeDemoData();
         setIsloading(false);
      }
      else{
        axios.get('https://comprehensiveonlineexamplatformbackend.onrender.com/getPracticeBank')
          .then(response => {
            setPracticeBank(response.data);
            setIsloading(false)
            })
          .catch(error => {
            console.error('Error fetching practice bank data:', error);
          });
      }
    }, [demoMode]);

    //load the current user information from back end service
    useEffect(() => {
      if (demoMode && userAccountDemo.length > 0 && username) {
        const currentUser = userAccountDemo.find(user => user.name === username);
        if (currentUser) {
          setCurrentUserInfor(currentUser);
        }
      }
      else{
        axios.post('https://comprehensiveonlineexamplatformbackend.onrender.com/matchUserInfo',{username:username})
         .then(response => {
          if(response.data.matchUser){
              setCurrentUserInfor(response.data.matchUser);
            }})
          .catch(error => {
              console.error('Error fetching current user data:', error);
              setCurrentUserInfor({})
            });
      }
    }, [userAccountDemo, username, demoMode, setCurrentUserInfor]);


    // initialize demo data
    const initializeDemoData = async () => {
        try {
            await axios.get('https://comprehensiveonlineexamplatformbackend.onrender.com/getDemoData')
            .then(response => {
                const { userAccountDemo, practiceBankDemo, examBankDemo, examModesDemo } = response.data;
                setUserAccountDemo(userAccountDemo);  
                setPracticeBank(practiceBankDemo);
                setExamBankDemo(examBankDemo);
                setExamModesDemo(examModesDemo);
            })
        } catch (error) {
            console.error('initialize Demo Data failed:', error);
        }
    };

    return (
        <AppContext.Provider value={{ username, setUsername, functs, setfuncts, practiceBank, setPracticeBank, examRuningState, setExamRuningState, currentUserInfor, setCurrentUserInfor,isloading,demoMode,setDemoMode,userAccountDemo,setUserAccountDemo,examBankDemo,setExamBankDemo,examModesDemo,setExamModesDemo }}>
            {children}
        </AppContext.Provider>
    );
};
