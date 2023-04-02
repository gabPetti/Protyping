import { useState, useEffect } from "react";
import wordList from './words.json';
import "./typetest.sass";

export default function Typetest() {
  var generatedWords;
  const [words, setWords] = useState([]);
  const [carret, setCarret] = useState(0)
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [activeLetterIndex, setActiveLetterIndex] = useState(0)
  const [activeLetter, setActiveLetter] = useState("")
  const [currentInput, setCurrentInput] = useState("")
  const [currentLetter, setCurrentLetter] = useState(0)
  
  useEffect(() => {
    generatedWords = [];
    for (let i = 0; i < 200; i++) {
      generatedWords.push(wordList.words[Math.floor(Math.random() * 9904)].split(""))
      for (let j = 0; j < generatedWords[i].length; j++) {
        generatedWords[i][j] = {
          text: generatedWords[i][j],
          state: ""
        }
      }
    }
    setWords(generatedWords)
  }, [])
  
  function handleKeyDown(event) {
    // space bar 
    var key = event.key
    var keyCode = event.code
    // checkValid(event,key)
    if (keyCode === 32) {
      setCurrInput("")
      setActiveWordIndex(activeWordIndex + 1)
      setActiveLetterIndex(0)
    // backspace
    } else if (event.key === "Backspace") {
      setActiveLetterIndex(activeLetterIndex - 1)
      setActiveLetter(key)
      let newWords = [...words]
      newWords[activeWordIndex][activeLetterIndex - 1].state = "";
      setWords(newWords)
      console.log("backspacezin")
    } else {
      setActiveLetterIndex(activeLetterIndex + 1)
      setActiveLetter(key)
      wordChecker(key);
    }
  }

  function wordChecker(key) {
    const current = words[activeWordIndex][activeLetterIndex].text
    console.log(`you had to type ${current} and you typed ${key}`)
    if (current == undefined) {
      words[activeWordIndex].push(key)
    }
    const match = (current == key)
    if (current == key) {
      let newWords = [...words]
      newWords[activeWordIndex][activeLetterIndex].state = "correct"
      setWords(newWords)
    } else {
      let newWords = [...words]
      newWords[activeWordIndex][activeLetterIndex].state = "incorrect"
      setWords(newWords)
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
          <span>&nbsp;s</span>
        </div>
        <div className="typetestText" id='wordsList'>
          <input type="text" pattern="[A-Za-z]" onKeyDown={handleKeyDown} value={currentInput} onChange={(e) => setCurrentInput(e.target.value)}/>
          {/* <input type="text" value={currentInput} onChange={(e) => setCurrentInput(e.target.value)}/> */}
          {words.map( (word, i) => 
            <div key={i} className="word">
              {word.map( (letter, j) => (
                <span className={letter.state} key={j}>{letter.text}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

