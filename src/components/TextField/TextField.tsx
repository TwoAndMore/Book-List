import classNames from 'classnames';
import React, { useState } from 'react';

type Props = {
  value: string,
  label: string,
  required: boolean,
  type: string,
  onChange: (newValue: string) => void,
};

const getRandomDigits = () => Math.random().toString().slice(2);

export const TextField: React.FC<Props> = (props) => {
  const {
    value,
    label,
    type,
    required = false,
    onChange = () => {},
  } = props;

  const [id] = useState(() => `${label}${getRandomDigits()}`);

  const [touched, setTouched] = useState(false);
  const hasError = touched && required && !value;

  return (
    <div className="addBook__field">
      <label className="addBook__label" htmlFor={id}>
        {label}
      </label>

      <input
        id={id}
        className={classNames('addBook__input', {
          'addBook__input--empty': hasError,
        })}
        type={type}
        placeholder={`Enter ${label}`}
        value={value}
        onChange={event => onChange(event.target.value)}
        onBlur={() => setTouched(true)}
      />

      {hasError && (
        <p className="addBook__error">{`${label} is required`}</p>
      )}
    </div>
  );
};
