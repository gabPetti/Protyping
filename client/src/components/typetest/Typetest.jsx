import { useState } from "react";
import wordList from './words.json';
import "./typetest.sass";

export default function Typetest() {
  var generatedWords = [];
  for (let i = 0; i < 200; i++) {
    generatedWords.push(wordList.words[Math.floor(Math.random() * 9904)])
    generatedWords[i] = generatedWords[i].split("")
  }
  const [words, setWords] = useState(generatedWords);

  function wordChecker() {
    console.log("typed: ")
  }
  
  return (
    <div className="typetestContainer">
      <div className="typetestWrapper">
        <div className="typetestInfo">
          <span id="wpm">73</span>
          <span>&nbsp;WMP</span>
          <span>&nbsp;/&nbsp;</span>
          <span id="time">63</span>
          <span>&nbsp;sec</span>
        </div>
        <div className="typetestText" id='wordsList'>
          <input type="text" className="" onInput={wordChecker()}/>
          {words.map((word) => (
            <div className="word">
              {word.map((letter) => (
                <span>{letter}</span>
              ))}
              <span>&nbsp;</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


