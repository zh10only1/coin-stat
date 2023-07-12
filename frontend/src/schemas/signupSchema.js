import * as yup from 'yup';

const signupSchema = yup.object().shape({
    username: yup.string().min(5).max(30).required('Username is required'),
    name: yup.string().max(30).required('Name is required'),
    email: yup.string().email('Invalid Email').required('Email is required'),
    password: yup.string().required('Password is required').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,50}$/,"Password must have atleast 8 characters\none uppercase, one number and one special character"),
    confirmPassword: yup.string().oneOf([yup.ref('password')], "Passwords don't match").required('Confirm your password')
});

export default signupSchema;