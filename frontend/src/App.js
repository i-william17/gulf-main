import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/FrontOffice/Signup.jsx';
import Login from './pages/FrontOffice/Login.jsx';
import FrontOffice from './pages/FrontOffice/FrontOffice.jsx'
import Accounts from './pages/Accounts/Accounts.jsx'
import Home from "../src/pages/Home/Home.jsx";
import Phlebotomy from './pages/Phlebotomy/Phlebotomy.jsx';
import Lab from './pages/Lab/Lab.jsx'
import AccountsLogin from './pages/Accounts/AccountsLogin.jsx'
import { PatientProvider } from './context/patientContext.jsx';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  return (
    <PatientProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/front-office" element={<FrontOffice />} />
        <Route path="/accounts" element={<Accounts/>}/>
        <Route path='/accounts-login' element={<AccountsLogin/>}/>
        <Route path='/phlebotomy' element={<Phlebotomy/>}/>
        <Route path='/lab' element={<Lab/>}/>

        {/* Add more routes as needed */}
      </Routes>
    </Router>
    <ToastContainer 
     position="top-right" 
     autoClose={5000} 
     hideProgressBar={false} 
     newestOnTop={false} 
     closeOnClick 
     rtl={false} 
     pauseOnFocusLoss 
     draggable 
     pauseOnHover 
/>
</PatientProvider>
  );
};

export default App;
