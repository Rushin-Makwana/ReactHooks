import React, { useState, useEffect, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const emailReducer = (state, action) => {
    if (action.type === 'USER_INPUT')
      return { value: action.val, isValid: action.val.includes('@') }
    if (action.type === 'INPUT_BLUR')
      return { value: state.value, isValid: state.value.includes('@') };
    return { value: '', isValid: false };
  };
  const passwordReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return { value: action.value, isValid: action.value.trim().length > 6 }
    }
    if (action.type === 'INPUT_BLUR') {
      return { value: state.value, isValid: state.value.trim().length > 6 }
    }
    return { value: '', isValid: false }
  }
  const [emailState, emailDispatch] = useReducer(emailReducer, ({ value: '', isValid: null }))
  const [passwordState, passwordDispatch] = useReducer(passwordReducer, ({ value: '', isValid: null }))

  
  const {isValid : emailIsValid} = emailState;
  const {isValid: passwordIsValid} =  passwordState;
  useEffect(() => {
    const timer = setTimeout(() => {
      setFormIsValid(emailState.isValid&& passwordState.isValid)
    }, 500)
    return (() => {
      console.log('CLEANING UP')
      clearTimeout(timer)

    })

  }, [emailIsValid, passwordIsValid])

  useEffect(() => {
    const timer = setTimeout(() => {

      setFormIsValid(
        emailState.value.includes('@') && passwordState.value.trim().length > 6
      );
    }, 500)
    return () => {
      clearTimeout(timer)
    }

  }, [emailState, passwordState])


  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);
    emailDispatch(({ type: 'USER_INPUT', val: event.target.value }))

    setFormIsValid(emailState.value.includes('@') && passwordState.isValid)
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    // setFormIsValid(emailState.value.includes('@') && enteredPassword.trim().length>6)
    passwordDispatch({ type: 'USER_INPUT', value: event.target.value })
    setFormIsValid(emailState.value.includes('@') && passwordState.isValid)
    console.log(passwordState.value)

  };

  const validateEmailHandler = () => {
    // setEmailIsValid(enteredEmail.includes('@'));
    emailDispatch({ type: 'INPUT_BLUR' })
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);
    passwordDispatch({ type: 'INPUT_BLUR' })
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${emailState.isValid === false ? classes.invalid : ''
            }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${passwordState.isValid === false ? classes.invalid : ''
            }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
