import { BiLoaderAlt } from 'react-icons/bi';
import styles from './button.module.css';

export default function Button({
                                   children,
                                   dark,
                                   disabled,
                                   loading,
                                   loadingText,
                                   ...props
                               }) {
    if (loading) {
        return (
            <button
                type="button"
                className={dark ? styles.btnLoadingDark : styles.btnLoading}
                disabled>
                <div className="text-center flex justify-center align-middle">
                    <BiLoaderAlt className={`${styles.loading} text-2xl mr-2`} />
                    {loadingText}
                </div>
            </button>
        );
    }

    return disabled ? (
        <button {...props} className={styles.btnDisabled} disabled>
            {children.toUpperCase()}
        </button>
    ) : (
        <button {...props} className={dark ? styles.btnDark : styles.btn}>
            {children.toUpperCase()}
        </button>
    );
}
