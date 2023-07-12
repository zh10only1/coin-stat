import styles from './InputField.module.css'

function InputField(props) {
    return (
        <div style={{backgroundColor:`${props.background}`}} className={styles.textInputWrapper}>
            <input {...props} />
            {props.error && (<p className={styles.errorMessage}>{props.errormessage}</p>)}
        </div>
    )
}

export default InputField;