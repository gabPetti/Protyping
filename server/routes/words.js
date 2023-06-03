const router = require("express").Router();
const { getWordsList } = require('most-common-words-by-language');


router.get("/:language/:wordsNum", async (req, res) => {
  var words = getWordsList(req.params.language, req.params.wordsNum)
  res.status(200).json(words);
});

module.exports = router;
