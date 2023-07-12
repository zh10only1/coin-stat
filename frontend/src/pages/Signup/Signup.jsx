import styles from "./Signup.module.css";
import InputField from "../../components/InputField/InputField";
import WideButton from "../../components/WideButton/WideButton";
import signupSchema from "../../schemas/signupSchema";
import signupImage from "../../signup_svg.svg";
import { signup } from "../../api/internal";

import { useFormik } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

function Signup() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const handleSignup = async () => {

        if (errors.username || errors.password || errors.name || errors.confirmPassword || errors.email) {
            return;
        }

        const data = {
            name: values.name,
            username: values.username,
            password: values.password, 
            confirmPassword: values.confirmPassword,
            email: values.email,
        };

        const response = await signup(data);

        if (response.status === 201) {
            navigate("/login");
        } else if (response.code === "ERR_BAD_REQUEST") {
            setError(response.response.data.message);
        }
    };

    const { values, touched, handleBlur, handleChange, errors } = useFormik({
        initialValues: {
            username: "",
            name: "",
            password: "",
            email: "",
            confirmPassword: "",
        },
        validationSchema: signupSchema,
    });

    return (
        <div className={styles.signupContainer}>
            <div className={styles.signupWrapper}>
                <div className={styles.signupHeader}>Create your account</div>
                <InputField
                    type="text"
                    name="name"
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="name"
                    error={errors.name && touched.name ? 1 : undefined}
                    errormessage={errors.name}
                    background="white"
                />
                <InputField
                    type="text"
                    value={values.username}
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="username"
                    error={errors.username && touched.username ? 1 : undefined}
                    errormessage={errors.username}
                    background="white"
                />
                <InputField
                    type="email"
                    name="email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="email"
                    error={errors.email && touched.email ? 1 : undefined}
                    errormessage={errors.email}
                    background="white"
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
                    background="white"
                />
                <InputField
                    type="password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="confirm password"
                    error={errors.confirmPassword && touched.confirmPassword ? 1 : undefined}
                    errormessage={errors.confirmPassword}
                    background="white"
                />

                <WideButton
                    onClick={handleSignup}
                    style={{ backgroundColor: "white" }}
                    text="Signup"
                />
                <span>
                    Already have an account?{" "}
                    <NavLink
                        style={{ textDecoration: "none", backgroundColor: "white" }}
                        to="/login"
                    >
                        Login
                    </NavLink>
                </span>
                {error != "" ? <p className={styles.errorMessage}> {error} </p> : ""}
            </div>
            <div className={styles.imageContainer}>
                <img alt="signup-img" src={signupImage} />
            </div>
        </div>
    );
}

export default Signup;
