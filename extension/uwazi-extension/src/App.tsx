import { useState, useEffect } from 'react';
import { Box, Button, ChakraProvider, Flex, Heading, Spinner, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';

function App() {
  const [articleInfo, setArticleInfo] = useState<{title: string, url: string} | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get current page info when popup opens
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id!},
        func: () => {
          const title = document.title;
          const url = window.location.href;
          const h1 = document.querySelector('h1')?.textContent || title;
          return { title: h1, url: url };
        }
      }, (results) => {
        if (results && results[0]?.result) {
          setArticleInfo(results[0].result);
          analyzeArticle(results[0].result.title);
        }
      });
    });
  }, []);

  const analyzeArticle = async (query: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/compare?query=${encodeURIComponent(query)}`);
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error analyzing article:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <Box p={4} width="400px">
        <Heading size="md" mb={4}>Uwazi</Heading>
        
        {loading ? (
          <Flex justify="center">
            <Spinner size="sm" />
          </Flex>
        ) : analysis ? (
          <VStack align="stretch" spacing={4}>
            <Text fontSize="sm" fontWeight="bold">Original:</Text>
            <Text fontSize="sm">{analysis.base_article.title}</Text>

            <Text fontSize="sm" fontWeight="bold" mt={2}>Comparisons:</Text>
            
            {analysis.comparisons.map((comp: any, idx: number) => (
              <Box key={idx} borderWidth="1px" p={2} borderRadius="md">
                <Text fontSize="sm" fontWeight="bold">{comp.source}</Text>
                <Text fontSize="xs">Key differences:</Text>
                <ul>
                  {comp.differences.slice(0, 3).map((diff: string, i: number) => (
                    <li key={i} style={{fontSize: '12px'}}>{diff}</li>
                  ))}
                </ul>
              </Box>
            ))}
          </VStack>
        ) : (
          <Text fontSize="sm">No analysis available for this page</Text>
        )}
      </Box>
    </ChakraProvider>
  );
}

export default App;