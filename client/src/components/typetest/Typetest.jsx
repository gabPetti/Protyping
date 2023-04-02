import { useState, useEffect } from "react";
import wordList from './words.json';
import "./typetest.sass";

export default function Typetest() {
  var generatedWords = [];
  for (let i = 0; i < 200; i++) {
    generatedWords.push(wordList.words[Math.floor(Math.random() * 9904)])
    generatedWords[i] = generatedWords[i].split("")
  }
  const [words, setWords] = useState(generatedWords);
  const [carret, setCarret] = useState(0)
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [activeLetterIndex, setActiveLetterIndex] = useState(0)
  const [activeLetter, setActiveLetter] = useState("")
  const [currentInput, setCurrentInput] = useState("")
  const [currentLetter, setCurrentLetter] = useState(0)
  
  function wordChecker(key) {
    const current = words[activeWordIndex][activeLetterIndex]
    console.log(`you had to type ${current} and you typed ${key}`)
    if (current == undefined) {
      words[activeWordIndex].push(key)
    }
    const match = (current == key)
    if (match) {
      
    }
    console.log({match})
  }

  function checkValid(event,key) {
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault(); return false;
    }
  }
  function handleKeyDown(event) {
    // space bar 
    var key = event.key
    var keyCode = event.code
    checkValid(event,key)
    if (keyCode === 32) {
      setCurrInput("")
      setActiveWordIndex(activeWordIndex + 1)
      setActiveLetterIndex(0)
    // backspace
    } else if (keyCode === 8) {
      setActiveLetterIndex(activeLetterIndex - 1)
      // setCurrChar("")
      console.log("backspacezin")
    } else {
      setActiveLetterIndex(activeLetterIndex + 1)
      setActiveLetter(key)
      wordChecker(key);
    }
  }

  // useEffect(() => {
    
  // });

  // function handleKeyDown(event) {
  //   var name = event.key;
  //   var code = event.code;
  //   wordChecker(name);
  //   setCurrentLetter(currentLetter + 1)
  //   // Alert the key name and key code on keydown
  //   // alert(`Key pressed ${name} \r\n Key code value: ${code}`);
  // };

  return (
    <div className="typetestContainer">
      <div className="typetestWrapper">
        <div className="typetestInfo">
          <span id="wpm">73</span>
          <span>&nbsp;WPM</span>
          <span>&nbsp;/&nbsp;</span>
          <span id="time">63</span>
          <span>&nbsp;sec</span>
        </div>
        <div className="typetestText" id='wordsList'>
          <input type="text" pattern="[A-Za-z]" onKeyDown={handleKeyDown} value={currentInput} onChange={(e) => setCurrentInput(e.target.value)}/>
          {/* <input type="text" value={currentInput} onChange={(e) => setCurrentInput(e.target.value)}/> */}
          {words.map( (word, i) => 
          // [[c, u], [b, o, s, e, t, a]]
            <div key={i} className="word">
              {word.map( (letter, j) => (
                <span key={j}>{letter}</span>
              ))}
            </div>
        )}
        </div>
      </div>
    </div>
  )
}

