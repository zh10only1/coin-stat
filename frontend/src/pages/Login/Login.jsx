import styles from "./Login.module.css";
import InputField from "../../components/InputField/InputField";
import loginSchema from "../../schemas/loginSchema";
import WideButton from "../../components/WideButton/WideButton";
import loginImage from "../../login_svg.svg";
import { login } from '../../api/internal';
import { setUser } from '../../store/userSlice'

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useFormik } from "formik";

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const handleLogin = async () => {
    if (errors.username || errors.password) {
      return;
    }

    const data = {
      username: values.username,
      password: values.password
    }

    const response = await login(data);

    if (response.status === 200) {
      console.log(response)
      const user = {
        _id: response.data.user._id,
        email: response.data.user.email,
        username: response.data.user.username,
        auth: response.data.auth
      }

      dispatch(setUser(user));
      navigate('/');
    }
    else if(response.code === "ERR_BAD_REQUEST") {
      console.log(response);
      setError(response.response.data.message);
    }

  }

  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
  });

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginWrapper}>
        <div className={styles.loginHeader}>Login to your account</div>
        <InputField
          type="text"
          value={values.username}
          name="username"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="username"
          error={errors.username && touched.username ? 1 : undefined}
          errormessage={errors.username}
          background='white'
        />
        <InputField
          type="password"
          name="password"
          value={values.password}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="password"
          error={errors.password && touched.password ? 1 : undefined}
          errormessage={errors.password}
          background='white'
        />
        <WideButton onClick={handleLogin} style={{backgroundColor: "white"}} text="Login" />
        <span>
          Don't have an account?{" "}
          <NavLink style={{ textDecoration: "none", backgroundColor: "white" }} to="/signup">
            Register
          </NavLink>
        </span>
        { error != '' ? <p className={styles.errorMessage}> {error} </p> : ''}
      </div>
      <div className={styles.imageContainer}>
        <img alt="login-img" src={loginImage} />
      </div>
    </div>
  );
}

export default Login;
