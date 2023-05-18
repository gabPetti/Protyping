import { useState, useEffect, useRef } from "react";
import wordList from "./words.json";
import "./typetest.sass";

export default function Typetest() {
  const [words, setWords] = useState([]);
  const [wordsCount, setWordsCount] = useState(30);
  const [started, setStarted] = useState(false);
  const inputElement = useRef();

  // Generate words to the test
  useEffect(() => {
    var generatedWords = [];
    inputElement.current.value = "";
    var wordGenerated;
    for (let i = 0; i < wordsCount; i++) {
      wordGenerated = wordList.words[Math.floor(Math.random() * 9904)].split("");
      for (let j = 0; j < wordGenerated.length; j++) {
        wordGenerated[j] = {
          text: wordGenerated[j],
          status: "",
        };
      }
      generatedWords = generatedWords.concat([wordGenerated]);
    }
    generatedWords[0][0].status = "active";
    setWords([...generatedWords])
  }, [wordsCount]);

  // Compare input text with the words of the test
  const handleInput = () => {
    var userInput = inputElement.current.value;
    userInput = userInput.split(" ");
    userInput = userInput.map((x) => x.split(""));
    var copyWords = words;
    // word input checker
    for (let i = 0; i < userInput.length; i++) {
      for (let j = 0; j < Math.max(userInput[i].length, words[i].length); j++) {
        if (userInput[i][j] == undefined && words[i][j].status == "extra") {
          while(j < words[i].length) {
            copyWords[i].pop();
          }
        } else if (j > userInput[i].length - 1) {
          copyWords[i][j].status = "";
        } else if (words[i][j] == undefined) {
          copyWords[i][j] = {text: userInput[i][j], status: "extra"};
        // right key pressed
        } else if (userInput[i][j] != words[i][j].text && copyWords[i][j].status != "extra") {
          copyWords[i][j].status = "incorrect";
        // right key pressed
        } else if (userInput[i][j] == words[i][j].text && copyWords[i][j].status != "extra") {
          copyWords[i][j].status = "correct";
        }
      }
    }
    setWords([...copyWords]);
  };

  return (
    <div className="typetestContainer">
      <div className="typetestWrapper">
        <div className="typetestInfo">
          <div className="typetestWpm">
            <span id="wpm">0 WPM</span>
            <span>&nbsp;•&nbsp;</span>
            <span id="time">{setWordsCount} s</span>
          </div>
          <div className="typetestWordsCount">
            <button onClick={() => setWordsCount(15)}>15</button>
            <button onClick={() => setWordsCount(30)}>30</button>
            <button onClick={() => setWordsCount(50)}>50</button>
          </div>
        </div>
        <div className="typetestInput">
          <input
            type="text"
            // pattern="[A-Za-z]"
            autoFocus={true}
            onBlur={({ target }) => target.focus()}
            onChange={handleInput}
            ref={inputElement}
          />
        </div>
        <div className="typetestText">
          {words.map((word, i) => (
            <div className="words" key={i}>
              {word.map((letter, j) => (
                <span className={letter.status} key={j}>
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
