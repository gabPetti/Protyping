import Navbar from "../../components/navbar/Navbar"
import Typetest from "../../components/typetest/Typetest"
import Dashboard from "../../components/dashboard/Dashboard"
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { useState } from "react";
import "./casual.sass";

export default function Casual() {
  const [timeEnd, setTimeEnd] = useState(false);
  
  const addEndListener = (node, done) => {
    node.addEventListener("transitionend", done, false);
  }
  
  return (
    <>
    <Navbar />
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={timeEnd}
        addEndListener={addEndListener}
        classNames="fade">
          {timeEnd ? <Dashboard /> : <Typetest/>}
      </CSSTransition>
    </SwitchTransition>
    <button onClick={() => setTimeEnd(!timeEnd)}>me aperta carai</button>
    </>
  );
}
