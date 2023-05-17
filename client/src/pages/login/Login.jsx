import { useRef } from 'react'
import "./login.sass"
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const email = useRef()
  const password = useRef()

  function handleClick() {
    navigate("/register");
  }

  return (
    <div id='login'>
      <div className='loginContainer'>
        <div className='loginHeader'>
          <h1>Login</h1>
        </div>
        <form className="loginForm">
          <input
            placeholder="Email"
            type="email"
            className="loginInput"
            ref={email}
            required
          />
          <input
            placeholder="Password"
            type="password"
            className="loginInput"
            minLength={6}
            maxLength="20"
            ref={password}
            required
          />
          <div className='loginButtons'>
            <button type="button" onClick={handleClick} className='registerButton'>Register</button>
            <button className="loginButton">Sign In</button>
          </div>
        </form>
      </div>
    </div>
  )
}
