import React, { useState } from 'react'

import Slider from 'react-input-slider';

import styles from './styles.module.scss'

interface IInputSliderProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ISliderChangeEvent {
  target: {
    name: string;
    value: string;
  }
}

const InputSlider: React.FC<IInputSliderProps> = (props: IInputSliderProps) => {
  const [state, setState] = useState({ x: 0.0 });

  const handleSliderChange = ({ x }: { x: number }): void => {
    setState({ x: parseFloat(x.toFixed(2)) });
    const event: ISliderChangeEvent = {
      target: {
        name: props.name,
        value: x.toString(),
      }
    };

    props.onChange(event as React.ChangeEvent<HTMLInputElement>);

  };

  return (
    <div className={styles.cardInput}>
      <div className={styles.label}>{props.label}</div>
      <div className={styles.value}>{props.value}%</div>
      <div className={styles.slider}>
        <Slider
          axis="x"
          xstep={5}
          xmin={0}
          xmax={100}
          x={parseInt(props.value)}
          onChange={handleSliderChange}
          styles={{
            track: {
              width: '100%',
              backgroundColor: "#dee0e4"
            },
            active: {
              backgroundColor: "#EC407A"
            },
          }}
        />
      </div>

    </div>
  );
};

export { InputSlider }
