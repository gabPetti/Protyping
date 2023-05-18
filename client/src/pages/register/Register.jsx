import { useRef } from 'react'
import "./register.sass"
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const username = useRef()
  const email = useRef()
  const password = useRef()
  const passwordConfirm = useRef()

  function handleClick() {
    navigate("/login");
  }

  return (
    <div id='register'>
      <div className='registerContainer'>
        <div className='registerHeader'>
          <h1>Register</h1>
        </div>
        <form className="registerForm">
          <input
            placeholder="Username"
            type="text"
            minLength={3}
            maxLength={16}
            className="registerInput"
            ref={username}
            required
          />
          <input
            placeholder="Email"
            type="email"
            className="registerInput"
            ref={email}
            required
          />
          <input
            placeholder="Password"
            type="password"
            className="registerInput"
            minLength={6}
            maxLength="20"
            ref={password}
            required
          />
          <input
            placeholder="Repeat password"
            type="password"
            className="registerInput"
            minLength={6}
            maxLength="20"
            ref={passwordConfirm}
            required
          />
          <div className='registerButtons'>
            <button type="button" onClick={handleClick} className='registerButton'>Login</button>
            <button className="registerButton">Sign up</button>
          </div>
        </form>
      </div>
    </div>
  )
}
