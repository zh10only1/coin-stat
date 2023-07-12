import styles from './WideButton.module.css';


function WideButton(props) {
    return (
        <div className={styles.btnContainer}>
            <button onClick={props.onClick} className={styles.btn}>{props.text}</button>
        </div>
    )
}

export default WideButton;