import React from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import HomeRoutes from './Routers/HomeRoutes.js';

const App = (props) => {
  return(
     <BrowserRouter>
          <HomeRoutes/>
     </BrowserRouter>
  )
}
export default App;
