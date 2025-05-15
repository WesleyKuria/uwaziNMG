import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Textarea,
  Button,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';

function App() {
  const [userText, setUserText] = useState('');
  const [comparisonResults, setComparisonResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Choose the right backend URL
  const backendURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000'
      : 'https://your-backend-url.onrender.com'; // ← Replace this with real URL

  const handleCompare = async () => {
    if (!userText.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${backendURL}/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_text: userText }),
      });
      const data = await response.json();
      setComparisonResults(data.similar_articles || []);
    } catch (err) {
      console.error('Error:', err);
      setComparisonResults(['Error fetching comparison data.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <Box p={6}>
        <Heading mb={4}>Uwazi - Transparency in News</Heading>

        {/* Language Side-by-Side */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mb={10}>
          <Box>
            <Heading size="md">About Uwazi (English)</Heading>
            <Text mt={2}>
              Uwazi helps readers explore multiple perspectives of the same news story by comparing articles across various media houses.
            </Text>
          </Box>
          <Box>
            <Heading size="md">Kuhusu Uwazi (Kiswahili)</Heading>
            <Text mt={2}>
              Uwazi huwasaidia wasomaji kuchunguza mitazamo tofauti ya habari moja kwa kulinganisha makala kutoka vyombo mbalimbali vya habari.
            </Text>
          </Box>
        </SimpleGrid>

        {/* Tabs for navigation */}
        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>Compare</Tab>
            <Tab>How It Works</Tab>
            <Tab>Technology</Tab>
            <Tab>Download Extension</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Heading size="md" mb={4}>Compare Articles</Heading>
              <Text mb={2}>Paste a news article or URL to compare different perspectives:</Text>
              <Textarea
                placeholder="Paste article content or URL here..."
                mb={4}
                rows={6}
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
              />
              <Button colorScheme="blue" onClick={handleCompare} isDisabled={loading}>
                {loading ? <Spinner size="sm" /> : 'Compare Perspectives'}
              </Button>

              {/* Results Section */}
              {comparisonResults.length > 0 && (
                <Box mt={6}>
                  <Heading size="sm" mb={2}>Similar Articles:</Heading>
                  <VStack align="start" spacing={3}>
                    {comparisonResults.map((article, idx) => (
                      <Box key={idx} p={3} border="1px solid #ccc" borderRadius="md">
                        {article}
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}
            </TabPanel>

            <TabPanel>
              <Heading size="md" mb={4}>How It Works / Jinsi Inavyofanya Kazi</Heading>
              <Text>
                Uwazi uses natural language processing to extract keywords, retrieve related articles, and highlight semantic differences such as bias, tone, or fact framing.
              </Text>
              <Text mt={2}>
                Uwazi hutumia teknolojia ya lugha asilia kuchambua maneno muhimu, kupata makala zinazohusiana, na kuonyesha tofauti katika muktadha na msimamo.
              </Text>
            </TabPanel>

            <TabPanel>
              <Heading size="md" mb={4}>Technology Used / Teknolojia</Heading>
              <VStack align="start" spacing={2}>
                <Text>• Python (spaCy, sentence-transformers)</Text>
                <Text>• React + Chakra UI</Text>
                <Text>• BeautifulSoup (scrapers)</Text>
                <Text>• News APIs (Nation, Citizen, Al Jazeera, NYT)</Text>
                <Text>• Kiswahili + English interface</Text>
              </VStack>
            </TabPanel>

            <TabPanel>
              <Heading size="md" mb={4}>Download Chrome Extension</Heading>
              <Text mb={2}>Click below to download the ZIP file of the Chrome extension:</Text>
              <Button
                colorScheme="green"
                onClick={() => {
                  window.open('/extension/uwazi-extension.zip', '_blank');
                }}
              >
                Download Extension
              </Button>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ChakraProvider>
  );
}

export default App;
