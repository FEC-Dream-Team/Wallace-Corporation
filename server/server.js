const express = require('express');

const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const axios = require('axios');
const path = require('path');
const morgan = require('morgan');
const { v1: uuidv1 } = require('uuid');
const { BlobServiceClient } = require('@azure/storage-blob');
const keys = require('./config.js');

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', parameterLimit: 100000, extended: true }));

const options = {
  url: 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-sea',
  headers: {
    Authorization: `${keys.ATELIER_API_KEY}`,
  },
};

app.get('/products/:product_id', (req, res) => {
  let { product_id } = req.params;

  axios
    .get(`${options.url}/products/${product_id}`, options)
    .then((results) => {
      res.send(results.data);
    })
    .catch(console.error);
});

// OVERVIEW
app.get('/products/:product_id/styles', (req, res) => {
  let { product_id } = req.params;

  axios
    .get(`${options.url}/products/${product_id}/styles`, options)
    .then((results) => {
      res.send(results.data);
    })
    .catch(console.error);
});

app.get('/products/:product_id/related', (req, res) => {
  let { product_id } = req.params;

  axios
    .get(`${options.url}/products/${product_id}/related`, options)
    .then((results) => {
      res.send(results.data);
    })
    .catch(console.error);
});

app.get('/cart', (req, res) => {
  axios
    .get(`${options.url}/cart`, options)
    .then((results) => {
      res.send(results.data);
    })
    .catch(console.error);
});

app.post('/cart', (req, res) => {
  axios
    .post(`${options.url}/cart`, req.body, options)
    .then(() => res.sendStatus(201))
    .catch((error) => {
      console.log('Error: ', error);
    });
});

// REVIEWS
app.get('/reviews/sort/:id/:sort', (req, res) => {
  const { id, sort } = req.params;
  const lowerSort = sort.toLowerCase();
  const reviewsURL = `${options.url}/reviews/?product_id=${id}&count=100&sort=${lowerSort}`;
  axios
    .get(reviewsURL, options)
    .then(({ data }) => res.send(data.results))
    .catch((err) => console.log(err));
});

app.get('/reviews/meta/:id', (req, res) => {
  const { id } = req.params;
  const metaReviewsURL = `${options.url}/reviews/meta/?product_id=${id}`;
  axios
    .get(metaReviewsURL, options)
    .then(({ data }) => res.send(data))
    .catch((err) => console.log(err));
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  const { review_id } = req.params;
  axios.put(`${options.url}/reviews/${review_id}/helpful`, { body: { review_id } }, options)
    .then(() => res.send(204))
    .catch(console.log);
});

app.post('/reviews', (req, res) => {
  axios.post(`${options.url}/reviews`, req.body, options)
    .then(() => res.send(204))
    .catch(console.log);
});

app.put('/reviews/:review_id/report', (req, res) => {
  const { review_id } = req.params;
  axios.put(`${options.url}/reviews/${review_id}/report`, { body: { review_id } }, options)
    .then(() => res.send(204))
    .catch(console.log);
});

// Q&A
app.get('/qa/questions/:id', (req, res) => {
  const { id } = req.params;
  axios.get(`${options.url}/qa/questions/?product_id=${id}&count=100`, options)
    .then(({ data }) => {
      res.send(data.results);
    })
    .catch(console.log);
});

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  const { question_id } = req.params;
  axios.put(`${options.url}/qa/questions/${question_id}/helpful`, { body: { question_id } }, options)
    .then(() => res.send(204))
    .catch(console.log);
});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  const { answer_id } = req.params;
  axios.put(`${options.url}/qa/answers/${answer_id}/helpful`, { body: { answer_id } }, options)
    .then(() => res.send(204))
    .catch(console.log);
});

app.put('/qa/answers/:answer_id/report', (req, res) => {
  const { answer_id } = req.params;
  axios.put(`${options.url}/qa/answers/${answer_id}/report`, { body: { answer_id } }, options)
    .then(() => res.send(204))
    .catch(console.log);
});

app.put('/qa/questions/:question_id/report', (req, res) => {
  const { question_id } = req.params;
  axios.put(`${options.url}/qa/questions/${question_id}/report`, { body: { question_id } }, options)
    .then(() => res.send(204))
    .catch(console.log);
});

app.post('/qa/questions', (req, res) => {
  axios.post(`${options.url}/qa/questions`, req.body, options)
    .then(() => {
      res.send(201);
    })
    .catch(console.log);
});

app.post('/qa/questions/:question_id/answers', (req, res) => {
  const { question_id } = req.params;

  axios.post(`${options.url}/qa/questions/${question_id}/answers`, req.body, options)
    .then(() => res.send(201))
    .catch(console.log);
});

app.post('/upload_images', (req, res) => {
  // Create the BlobServiceClient object which will be used to create a container client
  const blobServiceClient = BlobServiceClient.fromConnectionString(keys.BLOB_SERVICE_KEY);

  // Create a unique name for the container
  const containerName = 'louisaandjesse';

  console.log('\nCreating container...');
  console.log('\t', containerName);

  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Create the container
  // const createContainerResponse = await containerClient.create();
  // console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);
  const blobName = 'img' + uuidv1() + `.${req.body.name}`;

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  console.log('\nUploading to Azure storage as blob:\n\t', blobName);

  // Upload data to the blob
  const data = Buffer.from(req.body.data, 'base64');
  blockBlobClient.upload(data, data.length)
    .then((blobUploadResponse) => {
      console.log('Blob was uploaded successfully. requestId: ', blobUploadResponse);
      res.send(`https://louisajeseetest.blob.core.windows.net/louisaandjesse/${blobName}`);
    })
    .catch(console.log);
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
