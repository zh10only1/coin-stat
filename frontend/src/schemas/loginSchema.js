import * as yup from 'yup';

const loginSchema = yup.object().shape({
    username: yup.string().min(5).max(30).required('Username is required'),
    password: yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,50}$/,"Password must have atleast 8 characters\none uppercase, one number and one special character").required('Password is required')
});

export default loginSchema;