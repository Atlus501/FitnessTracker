import React, {useState} from 'react'
import {AuthContext} from './helpers/AuthContext'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import ActivityPage from './pages/ActivityPage.js'
import TemplatePage from './pages/TemplatePage.js'
import GoalsPage from './pages/GoalsPage.js'

function App() {

  const[authState, setAuthState] = useState(() => {
    const token = localStorage.getItem("fitness-user");
  // If token exists, parse it; otherwise, use the default object
    return token ? JSON.parse(token) : { username: "", user_id: 0 };
  });

  return (
    <>
    <div className="app">
    <AuthContext.Provider value = {{authState, setAuthState}}>
      <Router>

        <Routes>
          <Route path="/activity" element={<ActivityPage/>}/>
          <Route path="/goals" element={<GoalsPage/>}/>
          <Route path = "/" element={<TemplatePage/>}/>
        </Routes>
        
    </Router>
    </AuthContext.Provider>
    </div>
    </>
  );
}

export default App;
