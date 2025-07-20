import { Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './components/Home.jsx';
import Layout from './Layout.jsx';
import Login from './components/Login.jsx';
import PublicRoute from './components/PublicRoute.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Register from './components/Register.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ForgotPasswordSet from './components/ForgotPasswordSet.jsx';
import NewWord from './components/NewWord.jsx';
import Words from './components/Words.jsx';
import EditWord from './components/EditWord.jsx';
import Gyakorlas from './components/Gyakorlas.jsx';
import Jatek from './components/Jatek.jsx';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} /> 
        <Route path='/bejelentkezes' element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />  
        <Route path='/reset-password/:token' element={
          <PublicRoute>
            <ForgotPasswordSet />
          </PublicRoute>
        } /> 
        <Route path='/regisztracio' element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path='/elfelejtett-jelszo' element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />
        <Route path='/uj-szo' element={
          <PrivateRoute>
            <NewWord />
          </PrivateRoute>
        } />
        <Route path='/szerkesztes/:id' element={
          <PrivateRoute>
            <EditWord />
          </PrivateRoute>
        } />
        <Route path='/gyakorlas' element={
          <PrivateRoute>
            <Gyakorlas />
          </PrivateRoute>
        } />
        <Route path='/osszes-szo' element={
          <PrivateRoute>
            <Words />
          </PrivateRoute>
        } />
        <Route path='/jatek' element={
          <PrivateRoute>
            <Jatek />
          </PrivateRoute>
        } />
        <Route path='*' element={<Home />} />
      </Route>
    </Routes>
  );

}

export default App
