import React from 'react'
import Typetest from "../../components/typetest/Typetest"
import Dashboard from "../../components/dashboard/Dashboard"
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { useState } from "react";

export default function TestArea() {
  const [stats, setStats] = useState({wpm: 0, finished: false});
  
  const addEndListener = (node, done) => {
    node.addEventListener("transitionend", done, false);
  }

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={stats.finished}
        addEndListener={addEndListener}
        classNames="fade">
          {stats.finished ? <Dashboard /> : <Typetest onQuery={setStats} />}
      </CSSTransition>
    </SwitchTransition>
  )
}

