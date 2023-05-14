import { useState, useEffect } from "react";
import wordList from "./words.json";
import "./typetest.sass";

export default function Typetest() {
  const [words, setWords] = useState([]);
  var generatedWords;
  var wordGenerated;

  // Generate words to the test
  useEffect(() => {
    generatedWords = [];
    for (let i = 0; i < 200; i++) {
      wordGenerated = wordList.words[Math.floor(Math.random() * 9904)].split("");
      for (let j = 0; j < wordGenerated.length; j++) {
        wordGenerated[j] = {
          text: wordGenerated[j],
          status: " "
        };
      }
      generatedWords = generatedWords.concat(wordGenerated)
      generatedWords.push({text: "\xa0", status: ""})
    }
    generatedWords[0].status = "active"
    setWords([...words, ...generatedWords])
  }, [generatedWords]);

  // Compare input text with the words of the test
  const handleInput = event => {
    var userInput = event.target.value;
    var maxInput = userInput.length;
    var copyWords = words;
    for (let i = 0; i < maxInput; i++) {
      if (userInput[i] == words[i].text) {
        copyWords[i].status = "correct"
      } else if (userInput[i] == " " && words[i].text == "\xa0") {
        copyWords[i].status = "correct"
      } else if (userInput[i] != words[i].text) {
        copyWords[i].status = "incorrect"
      }
      setWords([...copyWords])
    }

    while(copyWords[maxInput].status != " ") {
      copyWords[maxInput].status = " "
      maxInput++
    }

    copyWords[userInput.length].status = "active"
    setWords([...copyWords])
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
        <div className="typetestInput">
          <input
            type="text"
            // pattern="[A-Za-z]"
            autoFocus={true}
            onBlur={({ target }) => target.focus()}
            onChange={handleInput}
          />
        </div>
        <div className="typetestText" id="wordsList">
          <div id="carret"></div>
            {words.map((letter, i) => (
              <span style={letter.status == "active" ? {position: "relative"} : {}} className={letter.status + " "} key={i}>{letter.text}</span>
            ))}
        </div>
      </div>
    </div>
  );
}
