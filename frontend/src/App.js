import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import styles from './App.module.css';
import Protected from './components/Protected/Protected';
import Error from './pages/Error/Error';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Crypto from './pages/Crypto/Crypto';
import Blogs from './pages/Blogs/Blogs';
import CreateBlog from './pages/CreateBlog/CreateBlog';
import BlogDetails from './pages/BlogDetails/BlogDetails';
import UpdateBlog from './pages/UpdateBlog/UpdateBlog';

import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const isAuth = useSelector((state) => state.user.auth);

  return (
    <div className={styles.container}>
      <BrowserRouter>
        <div className={styles.layout}>
          <Navbar />
          <Routes>
            <Route
              path='/'
              exact
              element={
                <div className={styles.main} style={{ backgroundColor: '#141B41' }}>
                  <Home />
                </div>
              }
            />

            <Route
              path='crypto'
              exact
              element={
                <div className={styles.main} style={{ backgroundColor: '#141B41' }}> <Crypto /> </div>
              }
            />

            <Route
              path='blogs'
              exact
              element={
                <Protected isAuth={isAuth}>
                  <div className={styles.main} style={{ backgroundColor: '#141B41' }} > <Blogs /> </div>
                </Protected>
              }
            />

            <Route
              path='blog/:id'
              exact
              element={
                <Protected isAuth={isAuth}>
                  <div className={styles.main} style={{ backgroundColor: '#141B41' }} > <BlogDetails /> </div>
                </Protected>
              }
            />

            <Route
              path='blog-update/:id'
              exact
              element={
                <Protected isAuth={isAuth}>
                  <div className={styles.main} style={{ backgroundColor: '#141B41' }} > <UpdateBlog /> </div>
                </Protected>
              }
            />

            <Route
              path='create-blog'
              exact
              element={
                <Protected isAuth={isAuth}>
                  <div className={styles.main} style={{ backgroundColor: '#141B41' }}> <CreateBlog />  </div>
                </Protected>
              }
            />

            <Route
              path='signup'
              exact
              element={
                <div className={styles.main}> <Signup /> </div>
              }
            />

            <Route
              path='login'
              exact
              element={
                <div className={styles.main}> <Login /> </div>
              }
            />

            <Route
              path='*'
              element={
                <div className={`${styles.main} ${styles.center}`}> <Error /> </div>
              }

            />


          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
