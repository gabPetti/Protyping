import { useState, useEffect, useRef, useContext } from "react";
import { TypetestContext } from "../../context/TypetestContext";
import axios from "axios";
import Stats from "../stats/Stats";
import "./typetest.sass";
var errorChars = 0;
var oldInputElement = 0;
var wordList;

export default function Typetest({ getStats }) {
  const [caret, setCaret] = useState({ left: 0, top: 6, line: 0, init: false });
  const [words, setWords] = useState([]);
  const {
    wpm,
    wpmArray,
    raw,
    mode,
    totalWords,
    totalTime,
    typedChars,
    updateTypedChars,
    updateCorrectChars,
  } = useContext(TypetestContext);
  const [started, setStarted] = useState(false);
  const [end, setEnd] = useState(false);
  const inputElement = useRef();

  // automatic focus on test when not fosusing on another input
  $("body")
    .off()
    .on("click", function () {
      if (!$("input:not(#inputElement)").is(":focus")) {
        inputElement.current.focus();
      }
    });

  // handle when shortcuts are pressed
  function handleKeyDown(e) {
    var zKey = 90;
    var vKey = 86;
    var aKey = 65;
    if (
      ((e.ctrlKey || e.metaKey) && e.keyCode == zKey) ||
      ((e.ctrlKey || e.metaKey) && e.keyCode == vKey) ||
      ((e.ctrlKey || e.metaKey) && e.keyCode == aKey)
    ) {
      e.preventDefault();
      return false;
    }
  }

  // transition to dashboard
  useEffect(() => {
    if (end === true) {
      getStats({
        wpm: wpm, // working
        wpmArray: wpmArray, // working
        accuracy: ((typedChars - errorChars) * 100) / typedChars, // not working, needs to add error from incorrect spacing
        raw: raw, // working
        consistency: 0, // not working
        burst: 0, // not working
        finished: true, // working
        totalTime: totalTime, // working
      });
    }
  }, [end]);

  // Reset test
  useEffect(() => {
    // reset variables
    updateTypedChars(0);
    updateCorrectChars(0);
    errorChars = 0;
    oldInputElement = 0;

    var wordsArray = [];
    inputElement.current.value = "";

    const fetchWords = async () => {
      const res = await axios.get("/server/words/english/10000");
      wordList = res.data;
      var wordGenerated;
      for (let i = 0; i < totalWords; i++) {
        wordGenerated = wordList[Math.floor(Math.random() * 10000)].split("");
        for (let j = 0; j < wordGenerated.length; j++) {
          wordGenerated[j] = {
            text: wordGenerated[j],
            status: "",
          };
        }
        wordGenerated.push({ text: "\xa0" });
        wordsArray = wordsArray.concat({
          textArray: wordGenerated,
          status: "",
        });
      }
      wordsArray[0].textArray[0].status = "active";
      wordsArray[0].status = "active";
      setWords([...wordsArray]);
      setStarted(false);
    };
    fetchWords();
  }, [mode, totalWords, totalTime]);

  // Compare input text with the words of the test
  const handleInput = () => {
    setStarted(true);
    if (oldInputElement < inputElement.current.value.length) {
      updateTypedChars((x) => x + 1);
    }
    oldInputElement = inputElement.current.value.length;

    var userInput = inputElement.current.value;
    userInput = userInput.split(" ");
    userInput = userInput.map((x) => x.split(""));
    var copyWords = words;
    var inputLength;
    var subInputLength;
    userInput.length == undefined
      ? (inputLength = 0)
      : (inputLength = userInput.length);

    var iActive;
    var jActive;
    // locate active indexes
    if (
      copyWords[userInput.length - 1].textArray[
        userInput[userInput.length - 1].length
      ] == undefined
    ) {
      iActive = userInput.length;
      jActive = 0;
    } else {
      iActive = userInput.length - 1;
      jActive = userInput[userInput.length - 1].length;
    }

    // iterate through 3 words: previous word, current word and next word
    for (let i = Math.max(0, inputLength - 2); i < inputLength + 1; i++) {
      // get previous word, current word and next word length
      userInput[i] == undefined
        ? (subInputLength = 0)
        : (subInputLength = userInput[i].length);
      // remove space
      copyWords[i].textArray.pop();
      var wordIsCorrect = true;
      for (
        let j = 0;
        j < Math.max(subInputLength, words[i].textArray.length);
        j++
      ) {
        // not typed word
        if (userInput[i] === undefined) {
          copyWords[i].textArray[j].status = "";

          // not typed char
        } else if (
          userInput[i][j] === undefined &&
          i >= iActive &&
          j >= jActive
        ) {
          if (words[i].textArray[j].status != "extra") {
            copyWords[i].textArray[j].status = "";
          } else {
            // remove extra char
            while (j < words[i].textArray.length) {
              copyWords[i].textArray.pop();
            }
          }

          // missed char
        } else if (
          userInput[i][j] == undefined &&
          words[i].textArray[j].status != "extra"
        ) {
          copyWords[i].textArray[j].status = "missed";
          wordIsCorrect = false;

          // extra char
        } else if (words[i].textArray[j] == undefined) {
          copyWords[i].textArray[j] = {
            text: userInput[i][j],
            status: "extra",
          };
          errorChars++;
          wordIsCorrect = false;

          // correct char
        } else if (
          userInput[i][j] == words[i].textArray[j].text &&
          words[i].textArray[j].status != "extra"
        ) {
          if (words[i].textArray[j].status != "correct") {
            updateCorrectChars((x) => x + 1);
          }
          copyWords[i].textArray[j].status = "correct";

          // incorrect char
        } else if (
          userInput[i][j] != words[i].textArray[j].text &&
          words[i].textArray[j].status != "extra"
        ) {
          if (words[i].textArray[j].status != "incorrect") {
            errorChars++;
          }
          copyWords[i].textArray[j].status = "incorrect";
          wordIsCorrect = false;
        }
      }
      if (words[i].status == "active") {
        copyWords[i].status = "";
      }
      // check if previous word is correct
      if (
        i == Math.max(0, inputLength - 2) &&
        wordIsCorrect == false &&
        words[i].status != "incorrect"
      ) {
        copyWords[i].status == "incorrect";
        errorChars++;
        console.log("error for spacing at the wrong time");
      } else if (
        i == Math.max(0, inputLength - 2) &&
        wordIsCorrect == true &&
        words[i].status != "incorrect"
      ) {
        copyWords[i].status == "correct";
      }
      // retrieve space
      copyWords[i].textArray.push({ text: "\xa0" });
    }

    // locate active word
    if (
      copyWords[userInput.length - 1].textArray[
        userInput[userInput.length - 1].length
      ] == undefined
    ) {
      copyWords[userInput.length].textArray[0].status = "active";
      copyWords[userInput.length].status = "active";
    } else {
      copyWords[userInput.length - 1].textArray[
        userInput[userInput.length - 1].length
      ].status = "active";
      copyWords[userInput.length - 1].status = "active";
    }

    setWords([...copyWords]);
  };

  // caret smooth effect
  useEffect(() => {
    const elem = document.querySelector("span.active");
    if (elem != null) {
      var line = caret.line;
      var init = caret.init;

      var parentTop = elem.offsetTop;
      var parentLeft = elem.offsetLeft;

      if (parentTop > caret.top) {
        const box = document.querySelector(".typetestText");
        line++;
        if (line > 1) {
          box.scrollTo(0, 42 * (line - 1));
        }
      } else if (parentTop < caret.top) {
        const box = document.querySelector(".typetestText");
        line--;
        if (line > 0) {
          box.scrollTo(0, 42 * (line - 1));
        }
      }
      var parentTop = elem.offsetTop;
      var parentLeft = elem.offsetLeft;
      init = true;
      setCaret({ left: parentLeft, top: parentTop, line: line, init: init });
    }
  }, [words]);

  return (
    <div className="typetestContainer">
      <div className="typetestWrapper">
        <Stats started={started} onEnd={setEnd} />
        <div className="typetestInput">
          <input
            id="inputElement"
            type="text"
            autoFocus
            onChange={handleInput}
            ref={inputElement}
            onKeyDown={() => handleKeyDown(event)}
          />
        </div>
        <div className="typetestText">
          <div id="caret" style={{ left: caret.left, top: caret.top }}></div>
          {words.map((word, i) => (
            <div className={`words ${word.status}`} key={i}>
              {word.textArray.map((letter, j) => (
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
