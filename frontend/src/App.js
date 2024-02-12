import React, { useState } from 'react';
import { Container, TextField, Button, Card, CardContent, IconButton, Typography, Box, CircularProgress } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import './App.css';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false); // State to track loading status
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const fetchData = async () =>  {
    try {
      setLoading(true); // Set loading to true when fetching data
      const params = {
        query: query
      };
      const response = await axios.get('http://localhost:8000/generate-response/', { params });
      setResponses(prevResponses => [{"query": query, "response": response.data.response }, ...prevResponses.slice(0, 4)]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false when data fetching is complete
    }
  }; 

  const handleSearch = async () => { 
    fetchData();
    console.log(responses);
  };

  const handleLike = async () => {
    setLiked(true);
    setDisliked(false);
    try {
      const response = await axios.post('http://localhost:8000/like/');
      console.log(response)
    } catch (error) {
      console.error(error);
    }
  };


  const handleDislike = async () => {
    setLiked(false);
    setDisliked(true);
    try {
      const response = await axios.post('http://localhost:8000/dislike/');
      console.log(response)
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopy = async () => {
    try {
      const response = await axios.post('http://localhost:8000/copy/');
      console.log(response)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ height: '90vh', overflowY: 'scroll' }}>
      <div className="response-list">
        {responses.map((response, index) => (
          <Card key={index} className="response-card">
            <CardContent style={{ paddingBottom: 0 }}>
            <Typography variant="body1">{response.query}</Typography>
            <Typography variant="body2" style={{ marginTop: '10px', marginBottom: '10px' }}>{response.response}</Typography>
            {/* Actions are now wrapped in a Box for alignment */}
            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px' }}>
              <IconButton aria-label="like" onClick={handleLike} style={{ color: liked ? 'blue' : 'inherit' }}><ThumbUpAltIcon /></IconButton>
              <IconButton aria-label="dislike" onClick={handleDislike} style={{ color: disliked ? 'red' : 'inherit' }}><ThumbDownAltIcon /></IconButton>
              <IconButton aria-label="copy" onClick={handleCopy}><ContentCopyIcon/></IconButton>
            </Box>
          </CardContent>
          </Card>
        ))}
      </div>
      {loading && ( // Render loading icon if loading is true
        <Card>
        <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </Card>
      )}
      <div className="search-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px', marginBottom: '20px'}}>
      <TextField label="Ask me anything..." fullWidth value={query} onChange={(e) => setQuery(e.target.value)} />
      <Button variant="contained" color="primary" onClick={handleSearch}>Search</Button>
      </div>
    </Container>
  );
}

export default App;
