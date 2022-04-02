import { Loader, DataTable } from '@saas-ui/react'
import { Container, Center, Text, Box, Button, Image, VStack, HStack, Divider, Link } from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { AttachmentIcon } from '@chakra-ui/icons'

function App() {
  const [res, setRes] = useState();

  const [file, setFile] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const handleUploadFile = (evt) => {
    setFile(
      evt.target.files[0],
    )
  }
  const submitPhoto = async () => {
    if (!file) { return; }
    setIsUploading(true)
    const data = new FormData()
    data.append('file', file)

    let url = "https://api.taggun.io/api/receipt/v1/verbose/file";

    try {
      const res = await axios.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'apikey': process.env.REACT_APP_TAGGUN_API_KEY
        }
      })
      console.log(res)
      setRes(res)
      setIsUploading(false);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Container>
      <Box height="100vh" mt="30vh">
        <Box textAlign="center">
          <Center>
            <Image
              boxSize='45px'
              objectFit='cover'
              src='./outline.png'
            /></Center>
          <Text fontSize="xl" fontWeight="medium">Easiest way to scan your receipts using Taggun API</Text>
          <Text fontSize="md" color="gray.500">Upload an image of a store receipt below to see results</Text>

          <VStack mt={16}>
            {file ? <Box><Text>{file.name}</Text></Box> : <VStack spacing={6}><Box>
              <label htmlFor="file-upload">
                <AttachmentIcon /> Click to select receipt
              </label>
              <input id="file-upload" type="file" onChange={handleUploadFile} />
            </Box>
            </VStack>}

            {isUploading ? <Loader thickness="2px" /> : <Button size="md" colorScheme="primary" onClick={submitPhoto}>
              Upload photo
            </Button>

            }
            <Link fontSize="xs" colorScheme="primary" href="https://d7pdsiqo9rcig.cloudfront.net/wp-content/uploads/2019/04/receipt-2.jpg">Download a sample one</Link></VStack>
        </Box>

        {res && <Box>
          <Box mt={10}>
            <Center>
              <Text fontWeight="medium">Successfully analyzed receipt</Text></Center>

            <Text fontWeight="medium">Details</Text>
            <Divider mb={4} />
            <HStack>
              <Text width={100}>
                Receipt #
              </Text>
              <Text>
                {res.data.entities.receiptNumber.data}
              </Text>
            </HStack>

            <HStack>
              <Text width={100}>
                Tax
              </Text>

              <Text>{res.data.entities.multiTaxLineItems[0].data.taxAmount.text}</Text>
            </HStack>

            <HStack>
              <Text width={100}>
                Merchant
              </Text>

              <Text>{res.data.merchantName.data}</Text>
              <Text>{res.data.merchantCity.text}</Text>

            </HStack>
          </Box>

          <Box overflowX="auto" mt={10}>
            <Text fontWeight="medium">Items</Text>
            <Divider mb={4} />
            <Box>
              <DataTable size="xs" columns={[{ "accessor": "data", "Header": "Currency" }, { "accessor": "currencyCode", "Header": "Name" }, { "accessor": "text", "Header": "Item" }]} data={res.data.amounts} />
            </Box>

            <Box overflowX="auto" mt={10}>
              <Text fontWeight="medium">Full JSON response</Text>
              <Divider mb={4} />
              <pre style={{ "fontSize": "12px", "height": "400px", overflow: "scroll", }}>
                {JSON.stringify(res, null, 2)}
              </pre>
            </Box> </Box>
        </Box>}
      </Box>
    </Container>
  );
}

export default App;
