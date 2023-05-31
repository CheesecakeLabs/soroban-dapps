import React from 'react'

import CurrencyFormat from 'react-currency-format'

import { Icon, IconNames } from "components/atoms"
import styles from './styles.module.scss'

interface IInputPercentageProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string
  decimalScale?: number,
  prefix?: string,
  padding?: string
}

const InputPercentage: React.FC<IInputPercentageProps> = (props: IInputPercentageProps) => {
  return (
    <div>
      <div className={styles.label}>
        <label htmlFor={props.name}>
          {props.label}   <Icon name={IconNames.info} alt="Info" />
        </label>
      </div>
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
        suffix='%'
      />
    </div>
  );
};

export { InputPercentage }
