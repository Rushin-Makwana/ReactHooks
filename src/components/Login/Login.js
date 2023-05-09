import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';
import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input';
const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);
  const authCtx = useContext(AuthContext)
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
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  // If we don't want to pass the entire object as dependency, we can pass only specific props of obj like this
  const { isValid: emailIsValid /**Just an Alias for isValid prop of emailState */ } = emailState;
  const { isValid: passwordIsValid } = passwordState;


  //used useEffect as there might be possiblity of getting an older state in setIsFormValid of emailHandler and passwordHandler; useEffect assures that we will current, updates state only 
  useEffect(() => {
    const timer = setTimeout(() => {
      setFormIsValid(emailIsValid && passwordIsValid)
    }, 500)
    return (() => {
      console.log('CLEANING UP')
      clearTimeout(timer)

    })

  }, [emailIsValid, passwordIsValid]) // also [emailState.emailIsValid, passwordState.passwordIsValid]

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
    if(formIsValid)
    {
    authCtx.onLogin(emailState.value, passwordState.value);
    }
    else if(!emailIsValid)
    {
      emailInputRef.current.focus();
    }
    else
    {
      passwordInputRef.current.focus();
    }
  };


  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input activate={emailInputRef} id="email" label="E-mail" isValid={emailIsValid} value={emailState.value} onChange={emailChangeHandler} onBlur={validateEmailHandler} />
        <Input activate={passwordInputRef} id="password" label="Password" isValid={passwordIsValid} value={passwordState.value} onChange={passwordChangeHandler} onBlur={validatePasswordHandler} />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} >
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
