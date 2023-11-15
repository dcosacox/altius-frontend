import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { useContext, useReducer, useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import { Store } from './Store';
import Container from 'react-bootstrap/Container';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { state } = useContext(Store) || false;
  const { userInfo } = state || false;

  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="bottom-center" limit={3} />
        <header></header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All right reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
