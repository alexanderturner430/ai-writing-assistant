const analyzeText = async (text) => {
    try {
      const response = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });
      
      const analysis = await response.json();
      console.log('Analysis:', analysis);
      return analysis;
    } catch (error) {
      console.error('Error analyzing text:', error);
      throw error;
    }
  };
  
  // Example usage
  analyzeText("The quick brown fox jumps over the lazy dog.")
    .then(analysis => {
      // Handle the analysis results
      console.log(analysis);
    });
  