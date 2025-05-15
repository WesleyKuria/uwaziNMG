import { useState, useEffect } from 'react';
import { Box, Button, ChakraProvider, Flex, Heading, Spinner, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeArticle = async (url: string) => {
    setLoading(true);
    try {
      // Extract keywords from URL (in real app, we'd parse the actual article)
      const mockQuery = "Kenya climate plan";
      const response = await axios.get(`http://localhost:8000/compare?query=${mockQuery}`);
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error analyzing article:", error);
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes, analyze a mock article on load
  useEffect(() => {
    analyzeArticle("https://example.com/news");
  }, []);

  return (
    <ChakraProvider>
      <Box p={8}>
        <Heading mb={8} textAlign="center">Uwazi - News Transparency Tool</Heading>
        
        {loading ? (
          <Flex justify="center">
            <Spinner size="xl" />
          </Flex>
        ) : analysis ? (
          <VStack align="stretch" spacing={6}>
            <Box bg="gray.100" p={4} borderRadius="md">
              <Text fontWeight="bold">Original Article ({analysis.base_article.source}):</Text>
              <Text>{analysis.base_article.title}</Text>
              <Text mt={2}>{analysis.base_article.content}</Text>
            </Box>

            <Heading size="md">Comparison with Other Sources:</Heading>

            {analysis.comparisons.map((comp: any, idx: number) => (
              <Box key={idx} borderWidth="1px" p={4} borderRadius="md">
                <Text fontWeight="bold">{comp.source}:</Text>
                <Text>Similarity: {(comp.similarity * 100).toFixed(1)}%</Text>
                <Text mt={2}>Key Differences:</Text>
                <ul>
                  {comp.differences.map((diff: string, i: number) => (
                    <li key={i}>{diff}</li>
                  ))}
                </ul>
              </Box>
            ))}
          </VStack>
        ) : (
          <Text>No analysis available</Text>
        )}
      </Box>
    </ChakraProvider>
  );
}

export default App;