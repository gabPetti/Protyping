import React from "react";
import Typetest from "../../components/typetest/Typetest";
import Dashboard from "../../components/dashboard/Dashboard";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { useState } from "react";
import { TypetestContextProvider } from '../../context/TypetestContext';


export default function TestArea() {
  const [stats, setStats] = useState({
    wpm: 0,
    wpmArray: [],
    accuracy: 0,
    raw: 0,
    consistency: 0,
    burst: 0,
    finished: false,
  });

  const addEndListener = (node, done) => {
    node.addEventListener("transitionend", done, false);
  };

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={stats.finished}
        addEndListener={addEndListener}
        classNames="fade"
      >
        <TypetestContextProvider>
          {stats.finished ? (
            <Dashboard
              wpm={stats.wpm}
              wpmArray={stats.wpmArray}
              accuracy={stats.accuracy}
              raw={stats.raw}
              consistency={stats.consistency}
              burst={stats.burst}
            />
          ) : (
            <Typetest getStats={setStats} />
          )}
        </TypetestContextProvider>
      </CSSTransition>
    </SwitchTransition>
  );
}
