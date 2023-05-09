import { useState, useEffect } from "react";
import wordList from "./words.json";
import "./typetest.sass";

export default function Typetest() {
  var generatedWords;
  
  const [words, setWords] = useState([]);
  const [carret, setCarret] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [activeLetterIndex, setActiveLetterIndex] = useState(0);
  const [activeLetter, setActiveLetter] = useState("");
  const [currentInput, setCurrentInput] = useState("");
  const [currentLetter, setCurrentLetter] = useState(0);

  useEffect(() => {
    generatedWords = [];
    for (let i = 0; i < 200; i++) {
      generatedWords.push(
        wordList.words[Math.floor(Math.random() * 9904)].split("")
      );
      for (let j = 0; j < generatedWords[i].length; j++) {
        generatedWords[i][j] = {
          text: generatedWords[i][j],
          state: " ",
        };
      }
    }

    generatedWords[0][0].state = "active";
    setWords(generatedWords);
  }, []);

  function handleInput(event) {
    // checkValid(event, event.data)
    var key = event.target.value;
    // space bar
    if (key == " ") {
      setActiveWordIndex(activeWordIndex + 1);
      setActiveLetterIndex(0);
    } else {
      setActiveLetterIndex(activeLetterIndex + 1);
      setActiveLetter(key);
      wordChecker(key);
    }
  }

  function handleKeyDown(event) {
    if (event.keyCode === 8) {
      if (activeLetterIndex == 0) {
        console.log("returning 1 word")
        setActiveWordIndex(activeWordIndex - 1);
        console.log(words[activeWordIndex].map(el => el.state).lastIndexOf(""));
        setActiveLetterIndex(words[activeWordIndex].map(el => el.state).lastIndexOf("") + 1);
      } else if (words[activeWordIndex][activeLetterIndex - 1].state == "extra") {
        setActiveLetterIndex(activeLetterIndex - 1);
        let newWords = [...words];
        newWords[activeWordIndex].pop();
        setWords(newWords);
      } else {
        setActiveLetterIndex(activeLetterIndex - 1);
        setActiveLetter(event.key);
        let newWords = [...words];
        newWords[activeWordIndex][activeLetterIndex - 1].state = "";
        setWords(newWords);
      }
    }
  }

  function wordChecker(key) {
    if (activeLetterIndex >= words[activeWordIndex].length) {
      let newWords = [...words];
      newWords[activeWordIndex].push({ text: key, state: "extra" });
      setWords(newWords);
    } else {
      const current = words[activeWordIndex][activeLetterIndex].text;
      if (current == key) {
        let newWords = [...words];
        newWords[activeWordIndex][activeLetterIndex].state = "correct";
        setWords(newWords);
      } else {
        let newWords = [...words];
        newWords[activeWordIndex][activeLetterIndex].state = "incorrect";
        setWords(newWords);
      }
    }
  }

  function checkValid(event, key) {
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
  }

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
        <div className="typetestText" id="wordsList">
          <input
            type="text"
            pattern="[A-Za-z]"
            autoFocus={true}
            onBlur={({ target }) => target.focus()}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            value={currentInput}
            // onChange={(e) => setCurrentInput(e.target.value)}
          />
          {words.map((word, i) => (
            <div key={i} className="word">
              {word.map((letter, j) => (
                <span className={letter.state} key={j}>
                  {letter.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
