const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const ejs = require("ejs");

var id = null;

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));


mongoose.connect('mongodb://localhost:27017/candidatesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useFindAndModify', false);

const testSchema = new mongoose.Schema({
  round_score: {
    type: Number,
    min: 0,
    max: 10,
  }
});

const candidateSchema = new mongoose.Schema({
  name: String,
  email: String,
  test: [testSchema]
});

const Candidate = mongoose.model("Candidate", candidateSchema);


app.get("/", function(request, response) {
  response.render("index");
});

// Get Highest Scoring Candidate
app.get("/highestScoringCandidate", function(request, response) {
  const scores = [];
  Candidate.find({}, function(err, results) {
    if (!err) {
      results.forEach(function(singleArrayItem) {
        const firstRound = singleArrayItem.test[0].round_score;
        const secondRound = singleArrayItem.test[1].round_score;
        const thirdRound = singleArrayItem.test[2].round_score;
        var total_score = firstRound + secondRound + thirdRound;
        scores.push(total_score);
      })


      var largest = [0];
      //find the largest num;
      for (var i = 0; i < scores.length; i++) {
        var comp = (scores[i] - largest[0]) > 0;
        if (comp) {
          largest = [];
          largest.push(scores[i]);
        }
      }
      console.log(largest);

      //find the index of 'Scores array'
      var arrIndex = [];
      for (var i = 0; i < scores.length; i++) {
        var comp = scores[i] - largest[0] == 0;
        if (comp) {
          arrIndex.push(i);
        }
      }
      console.log(arrIndex);

      arrIndex.forEach(function(index_position) {
        const highestScoreCandidate = results[index_position].name;
        response.write("<h1>Highest Scoring Candidate : " + highestScoreCandidate + " with Score: " + largest + "</h1>\n");
      });

      response.send();


    } else {
      console.log(err);
    }
  })
});

// Get Average Score Per Round by all Candidates.
app.get("/averageScorePerRound", function(req, res) {
  const firstRound = [];
  const secondRound = [];
  const thirdRound = [];
  Candidate.find({}, function(err, results) {
    results.forEach(function(result) {
      const firstRoundScore = result.test[0].round_score;
      firstRound.push(firstRoundScore);
      const secondRoundScore = result.test[1].round_score;
      secondRound.push(secondRoundScore);
      const thirdRoundScore = result.test[2].round_score;
      thirdRound.push(thirdRoundScore);
    })
    const reducer = (accumulator, curr) => accumulator + curr;
    const sumOfFirstRound = firstRound.reduce(reducer);
    const sumOfSecondRound = secondRound.reduce(reducer);
    const sumOfThirdRound = thirdRound.reduce(reducer);
    const len = firstRound.length;
    const avergeOfFirstRound = sumOfFirstRound / len;
    const avergeOfSecondRound = sumOfSecondRound / len;
    const avergeOfThirdRound = sumOfThirdRound / len;
    res.write("<h1>Average Score in First Round Scored by all Candidates: " + avergeOfFirstRound + " marks</h1>\n");
    res.write("<h1>Average Score in Second Round Scored by all Candidates: " + avergeOfSecondRound + " marks</h1>\n");
    res.write("<h1>Average Score in Third Round Scored by all Candidates: " + avergeOfThirdRound + " marks</h1>");
    res.send();
  })
});

var name = null;

app.post("/", function(request, response) {
  const name = request.body.name;
  const email = request.body.email;
  const candidate_score = new Candidate({
    name: request.body.name,
    email: request.body.email,
  });
  candidate_score.save();

  setTimeout(function(req, res) {
    Candidate.findOne({
      name: request.body.name
    }, function(err, results) {
      if (err) {
        console.log(err);
      } else {
        id = results._id;
        console.log(id);
      }

    });
  }, 3000);

  response.render("score", {
    Name: name
  });


});


app.post("/score", function(req, res) {
  const firstRound = req.body.fRound;
  const secondRound = req.body.sRound;
  const thirdRound = req.body.tRound;

  Candidate.findByIdAndUpdate(id, {
      test: [{
        round_score: firstRound
      }, {
        round_score: secondRound
      }, {
        round_score: thirdRound
      }]
    },
    function(err, docs) {
      if (err) {
        console.log(err)
      } else {
        console.log("Update Successfully");
        res.render("success");
      }
    });

});


app.listen(3000, function() {
  console.log("server started on port 3000");
});
