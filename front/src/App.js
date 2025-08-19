import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import CssBaseline from "@mui/material/CssBaseline";
import SpaceBackground from "./SpaceBackground";
import {
  Container, TextField, Button, Card, Typography, CircularProgress, Box,
} from "@mui/material";

function App() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Normalize / prettify answers returned by the backend so ReactMarkdown
  // always gets clean markdown/plain text. Handles JSON arrays, escaped newlines,
  // and quoted wrappers.
  function formatAnswer(raw) {
    if (!raw && raw !== "") return "";
    let t = String(raw);

    // Strip surrounding single/double quotes if present
    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
      t = t.slice(1, -1);
    }

    // Try JSON parse (handles strings like '["p1","p2"]')
    try {
      const parsed = JSON.parse(t);
      if (Array.isArray(parsed)) {
        return parsed.map(x => (typeof x === 'string' ? x : JSON.stringify(x))).join('\n\n');
      }
      if (typeof parsed === 'object' && parsed !== null) {
        if (parsed.content) return String(parsed.content);
        return JSON.stringify(parsed, null, 2);
      }
    } catch (e) {
      // not JSON — continue
    }

    // Convert escaped newlines and tabs into real ones
    t = t.replace(/\\r\\n|\\n/g, '\n').replace(/\\t/g, '\t');

    // If still looks like an array literal [a, b, c], try a best-effort split
    const trimmed = t.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      const inner = trimmed.slice(1, -1);
      // split on comma that is followed by optional space and maybe a quote
      const parts = inner.split(/\s*,\s*/).map(p => p.replace(/^\s*"|"\s*$|^\s*'|'\s*$/g, ''));
      if (parts.length > 1) return parts.join('\n\n');
    }

    return t;
  }

  const handleSearch = async () => {
    setAnswer("");
    setLoading(true);
    try {
  const res = await fetch(`${API_URL}/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) {
        // try to read response body for more detail
        let body = '';
        try {
          body = await res.text();
        } catch (e) {
          body = `<unable to read body: ${e.message}>`;
        }
        const msg = `Error ${res.status} ${res.statusText}: ${body}`;
        console.error(msg);
        setAnswer(msg);
        setLoading(false);
        return;
      }
      const data = await res.json();
  // Normalize answer to a string for ReactMarkdown
      let textAnswer = "";
      if (data == null) {
        textAnswer = "";
      } else if (typeof data.answer === 'string') {
        textAnswer = data.answer;
      } else if (data.answer && typeof data.answer === 'object') {
        // prefer content field if present (LLM wrappers)
        textAnswer = data.answer.content ?? JSON.stringify(data.answer, null, 2);
      } else {
        textAnswer = String(data.answer);
      }
  // Clean/format user-visible answer
  textAnswer = formatAnswer(textAnswer);
      setAnswer(textAnswer);
    } catch (err) {
      console.error('Request failed', err);
      setAnswer(`Error contacting backend: ${err?.message ?? String(err)}`);
    }
    setLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Background particles */}
      <Box sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1 
      }}>
        <SpaceBackground />
      </Box>

      <Container 
        maxWidth="lg" 
        sx={{ 
          minHeight: "100vh", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center", 
          py: 6,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Title with white and turquoise styling */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            sx={{
              fontFamily: "'Montserrat', 'Inter', '-apple-system', 'BlinkMacSystemFont', sans-serif",
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
              letterSpacing: '-0.02em',
              color: '#ffffff',
              textShadow: 'none',
              lineHeight: 1.1,
              mb: 1,
            }}
          >
            agentic semantic{' '}
            <Box 
              component="span" 
              sx={{ 
                color: '#20B2C5',
                fontFamily: "'Montserrat', 'Inter', '-apple-system', 'BlinkMacSystemFont', sans-serif",
                fontWeight: 700,
              }}
            >
              search
            </Box>
          </Typography>
        </Box>
        
        {/* Search input */}
        <TextField
          placeholder={query ? "" : "Ask me anything..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
          variant="filled"
          sx={{
            mb: 3,
            maxWidth: '800px',
            mx: 'auto',
            '& .MuiFilledInput-root': {
              fontSize: '1.2rem',
              fontFamily: "'Montserrat', 'Inter', sans-serif",
              fontWeight: 400,
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "2px solid #e0e0e0",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
              paddingTop: '20px',
              paddingBottom: '16px',
              paddingLeft: '20px',
              paddingRight: '20px',
              '&:hover': {
                border: "2px solid #20B2C5",
                backgroundColor: "#ffffff",
              },
              '&.Mui-focused': {
                border: "2px solid #20B2C5",
                backgroundColor: "#ffffff",
                boxShadow: "0 0 0 3px rgba(32, 178, 197, 0.1)",
              },
              '&:before, &:after': {
                borderBottom: 'none !important',
              },
            },
            '& .MuiFilledInput-input': {
              color: "#000000",
              backgroundColor: "transparent",
              padding: "0px",
              fontSize: '1.2rem',
              fontFamily: "'Montserrat', 'Inter', sans-serif",
              fontWeight: 400,
              lineHeight: '1.5',
              '&::placeholder': {
                color: "#999999",
                opacity: 1,
                fontSize: '1.2rem',
                fontFamily: "'Montserrat', 'Inter', sans-serif",
                fontWeight: 400,
              },
            },
            '& .MuiInputLabel-root': {
              display: 'none', // Hide the label completely
            },
          }}
          autoFocus
        />
        
        {/* Search button */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            sx={{ 
              minWidth: '140px',
              fontSize: '1rem',
              fontFamily: "'Montserrat', 'Inter', sans-serif",
              fontWeight: 600,
              borderRadius: '12px',
              padding: '14px 28px',
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Search"}
          </Button>
        </Box>
        
        {/* Results */}
        {answer && (
          <Card sx={{ 
            p: 4, 
            mt: 2,
            maxWidth: '900px',
            mx: 'auto',
            width: '100%',
            borderRadius: '16px',
          }}>
            <ReactMarkdown
              components={{
                p: ({children}) => <Typography variant="body1" paragraph sx={{fontFamily: "'Montserrat', 'Inter', sans-serif", fontSize: '1.1rem', lineHeight: 1.7}}>{children}</Typography>,
                h1: ({children}) => <Typography variant="h4" gutterBottom sx={{color: '#20B2C5', fontWeight: 700, fontFamily: "'Montserrat', 'Inter', sans-serif", mb: 2}}>{children}</Typography>,
                h2: ({children}) => <Typography variant="h5" gutterBottom sx={{color: '#20B2C5', fontWeight: 600, fontFamily: "'Montserrat', 'Inter', sans-serif", mb: 2}}>{children}</Typography>,
                h3: ({children}) => <Typography variant="h6" gutterBottom sx={{color: '#20B2C5', fontWeight: 600, fontFamily: "'Montserrat', 'Inter', sans-serif", mb: 1.5}}>{children}</Typography>,
              }}
            >
              {answer}
            </ReactMarkdown>
          </Card>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
