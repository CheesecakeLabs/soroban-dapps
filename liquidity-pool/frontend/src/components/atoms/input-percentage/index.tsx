import React from 'react'

import CurrencyFormat from 'react-currency-format'

import { Icon, IconNames, Tooltip } from "components/atoms"
import styles from './styles.module.scss'

interface IInputPercentageProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string
  decimalScale?: number,
  prefix?: string,
  padding?: string,
  helpText?: string
}


const InputPercentage: React.FC<IInputPercentageProps> = (props: IInputPercentageProps) => {
  return (
    <div>

      <div className={styles.label}>
        <label htmlFor={props.name}>
          {props.label}
        </label>
        {props.helpText &&
          <Tooltip title={props.helpText} placement="top">
            <div>
              <Icon name={IconNames.info} />
            </div>
          </Tooltip>
        }
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
