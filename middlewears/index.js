import express from 'express'

const app = express();

var users = [{
  name: 'John',
  kidneys: [{
    healthy: false
  }]

}]
app.use(express.json());

app.get('/', function (req, res) {
  let usersKidneys = users[0].kidneys;
  let numberOfKidneys = usersKidneys.length;
  let numberOfHealthyKidneys = 0;
  for (let i = 0; i < numberOfKidneys; i++) {
    if (usersKidneys[i].healthy) {
      numberOfHealthyKidneys++;
    }

  }

  const numberOfUnhealthyKidneys = numberOfKidneys - numberOfHealthyKidneys;

  res.json({
    numberOfKidneys,
    numberOfHealthyKidneys,
    numberOfUnhealthyKidneys
  })

})


app.post('/', function (req, res) {
  const isHealthy = req.body.isHealthy;
  users[0].kidneys.push({
    healthy: isHealthy
  })
  res.json({
    message: 'Kidney added'
  })
})


app.put('/', function (req, res) {
  
  for (let i = 0; i < users[0].kidneys.length; i++) {
    users[0].kidneys[i].healthy = true;
  }
  res.json({
    message: 'kidneys are healthy now'
  })
})


app.delete('/', function (req, res) {
  users[0].kidneys = users[0].kidneys.filter(kidney => kidney.healthy === true);
  res.json({
    message: 'Unhealthy kidneys deleted'
  })

})


app.listen(3000);
