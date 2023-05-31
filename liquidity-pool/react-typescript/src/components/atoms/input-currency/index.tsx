import React from 'react'

import CurrencyFormat from 'react-currency-format'

import styles from './styles.module.scss'

interface IInputCurrencyProps {
  label: string;
  name: string;
  value: string;
  text?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string
  decimalScale?: number,
  prefix?: string,
  padding?: string
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const InputCurrency: React.FC<IInputCurrencyProps> = (props: IInputCurrencyProps) => {
  const Icon = props.icon;

  return (
    <div className={styles.cardInput}>
      <div className={styles.inputContainer}>
        <CurrencyFormat
          name={props.name}
          onChange={props.onChange}
          decimalScale={props.decimalScale || 2}
          decimalSeparator={'.'}
          autoComplete="off"
          value={props.value}
          prefix={props.prefix}
          placeholder={props.placeholder}
          style={props.padding ? { padding: props.padding } : undefined}
          className={styles.input}
        />
      </div>
      <div className={styles.rightContent}>
        <label htmlFor={props.name} className={styles.label}>
          {Icon && <Icon />}
          {props.label}
        </label>
        {props.text &&
          <div className={styles.text}>{props.text}</div>
        }
      </div>
    </div>
  );
};

export { InputCurrency }
