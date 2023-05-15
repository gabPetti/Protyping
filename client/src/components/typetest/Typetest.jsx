import { useState, useEffect } from "react";
import wordList from "./words.json";
import "./typetest.sass";

export default function Typetest() {
  const [words, setWords] = useState([]);
  const [initialWords, setInitialWords] = useState([]);

  // Generate words to the test
  useEffect(() => {
    var generatedWords = [];
    var wordGenerated;
    for (let i = 0; i < 200; i++) {
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
    setInitialWords([...initialWords, ...generatedWords]);
    setWords([...words, ...generatedWords]);
  }, []);

  var spaces = 0;
  // Compare input text with the words of the test
  const handleInput = (event) => {
    var userInput = event.target.value;
    userInput = userInput.split(" ");
    var phraseLength = userInput.length;
    userInput = userInput.map((x) => x.split(""));
    var wordLength = userInput[phraseLength - 1].length;
    var copyWords = initialWords;
    console.log(userInput)
    
    // word input checker
    for (let i = 0; i < userInput.length; i++) {
      for (let j = 0; j < Math.max(userInput[i].length, initialWords[i].length); j++) {
        if (initialWords[i][j] != undefined && userInput[i][j] == undefined) {
          copyWords[i][j].status = "";
        } else if (initialWords[i][j] == undefined && userInput[i][j] != undefined) {
          copyWords[i][j] = { text: userInput[i][j].text, status: "extra" };
        } else if (userInput[i][j] != initialWords[i][j].text) {
          copyWords[i][j].status = "incorrect";
        } else if (userInput[i][j] == initialWords[i][j].text) {
          copyWords[i][j].status = "correct";
        }
      }
    }

    // backspace inside word checker
    if (words[phraseLength - 1][wordLength] != undefined) {
      if (words[phraseLength - 1][wordLength].status != "") {
        copyWords[phraseLength - 1][wordLength].status = "";
      }
    }

    // backspace between words checker
    if (words[phraseLength][0].status != "") {
      copyWords[phraseLength] = copyWords[phraseLength].map(x => (x.status = ""))
    }

    // set current active word
    // if (copyWords[phraseLength - 1][wordLength] == undefined) {
    //   copyWords[phraseLength][0].status = "active"
    // } else {
    //   copyWords[phraseLength - 1][wordLength].status = "active";
    // }

    setWords([...copyWords]);
  };

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
