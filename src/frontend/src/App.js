import "./App.css";
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './pages/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import Properties from './pages/Properties';
import MyProperties from './pages/MyProperties';
import UpdateProperty from './pages/UpdateProperty';
import PropertyDetails from "./pages/PropertyDetails";
import AddProperty from './pages/AddProperty';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/my-properties" element={<MyProperties />} />
            <Route path="/update-property/:id" element={<UpdateProperty />} />
            <Route path="/add-property" element={<AddProperty />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
