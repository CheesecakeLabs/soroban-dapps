import styles from './styles.module.scss'

export interface IErrorTextProps {
  text: string
}

const ErrorText = ({
  text,
}: IErrorTextProps): JSX.Element => {
  return (
    <span
      className={styles.errorText}
    >
      {text}
    </span>
  )
}

export { ErrorText }
