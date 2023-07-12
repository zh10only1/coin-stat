import styles from './Button.module.css'

function Button(props) {
    return (
        <button onClick={props.onClick} style={{backgroundColor: props.backgroundColor, marginRight: props.marginRight}} className={styles.btn}>{props.text}</button>
    )
}

export default Button;