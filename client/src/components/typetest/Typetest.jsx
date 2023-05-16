import { useState, useEffect } from "react";
import wordList from "./words.json";
import "./typetest.sass";

export default function Typetest() {
  const [words, setWords] = useState([]);
  const [time, setTime] = useState(30);
  const [started, setStarted] = useState(false);

  // Generate words to the test
  useEffect(() => {
    var generatedWords = [];
    var wordGenerated;
    for (let i = 0; i < 50; i++) {
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
  }, []);
  // Compare input text with the words of the test
  const handleInput = (event) => {
    var userInput = event.target.value;
    userInput = userInput.split(" ");
    userInput = userInput.map((x) => x.split(""));
    var copyWords = words;
    // word input checker
    for (let i = 0; i < userInput.length; i++) {
      for (let j = 0; j < Math.max(userInput[i].length, words[i].length); j++) {
        if (userInput[i][j] == undefined && words[i][j].status == "extra") {
          copyWords[i].pop();
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
  
  // const handleTime = () => {
  //   setStarted(true);
  //   if (started == false) {
  //     setTimeout(() => {
  //       setTime((value) => value - amount)
  //     }, 1000);
  //   }
  // }

  return (
    <div className="typetestContainer">
      <div className="typetestWrapper">
        <div className="typetestInfo">
          <span id="wpm">74</span>
          <span>&nbsp;WPM</span>
          <span>&nbsp;/&nbsp;</span>
          <span id="time">{time}</span>
          <span>&nbsp;s</span>
        </div>
        <div className="typetestInput">
          <input
            type="text"
            // pattern="[A-Za-z]"
            autoFocus={true}
            onBlur={({ target }) => target.focus()}
            onChange={handleInput}
            // onKeyDown={handleTime}
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
