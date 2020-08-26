const express = require('express');

const app = express();

const fs = require('fs').promises;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('../client/build'));

// app.get('/api/tickets', async (req, res) => {
//   const content = await fs.readFile('./data.json');
//   const storedTickets = JSON.parse(content);
//   res.send(storedTickets);
// });

app.get('/api/tickets', async (req, res) => {
  const content = await fs.readFile('./data.json');
  const storedTickets = JSON.parse(content);
  if (req.query.searchText) {
    const filteredTickets = storedTickets
      .filter((ticket) => ticket.title.toLowerCase().includes(req.query.searchText));
    res.send(filteredTickets);
  } else {
    res.send(storedTickets);
  }
});

app.post('/api/tickets/:ticketId/done', async (req, res) => {
  const content = await fs.readFile('./data.json');
  const storedTickets = JSON.parse(content);
  const currentTicket = req.body;
  currentTicket.updated = true;
  storedTickets.map((ticket) => {
    if (`:${ticket.id}` === req.params.ticketId) {
      Object.assign(ticket, currentTicket);
    }
  });
  const message = JSON.stringify(storedTickets);
  await fs.writeFile('./data.json', message);
  res.send(storedTickets);
});

app.post('/api/tickets/:ticketId/undone/', async (req, res) => {
  const content = await fs.readFile('./data.json');
  const storedTickets = JSON.parse(content);
  const currentTicket = req.body;
  currentTicket.updated = false;
  storedTickets.forEach((ticket) => {
    if (`:${ticket.id}` === req.params.ticketId) {
      Object.assign(ticket, currentTicket);
    }
  });
  const message = JSON.stringify(storedTickets);
  await fs.writeFile('./data.json', message);
  res.send(storedTickets);
});

app.get('/', (req, res) => {
  res.send('hello');
});

let port;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
  console.log("⚠️ Not seeing your changes as you develop?");
  console.log(
    "⚠️ Do you need to set 'start': 'npm run development' in package.json?"
  );
}

// Start the listener!
const listener = app.listen(port, () => {
  console.log("❇️ Express server is running on port", listener.address().port);
});
