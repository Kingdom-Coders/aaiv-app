import React, { useState } from 'react';
import { 
  Box, 
  Text, 
  Heading, 
  VStack, 
  HStack,
  Dialog,
  Button,
  Portal,
  CloseButton
} from '@chakra-ui/react';

const EULA = ({ onAccept, isAccepted }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAccept = () => {
    onAccept(!isAccepted);
  };

  const handleViewEULA = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Box w="100%" mb={4}>
        <HStack
          spacing={3}
          cursor="pointer"
          onClick={handleAccept}
          align="center"
        >
          <Box
            w="16px"
            h="16px"
            borderRadius="3px"
            border="2px solid"
            borderColor={isAccepted ? "#667eea" : "gray.300"}
            bg={isAccepted ? "#667eea" : "transparent"}
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="all 0.2s ease"
            flexShrink={0}
          >
            {isAccepted && (
              <Box
                w="8px"
                h="6px"
                borderLeft="2px solid white"
                borderBottom="2px solid white"
                transform="rotate(-45deg)"
                mt="-1px"
              />
            )}
          </Box>
          <Text fontSize="sm" color="gray.600" userSelect="none">
            I agree to the{" "}
            <Text
              as="span"
              color="#667eea"
              fontWeight="600"
              cursor="pointer"
              textDecoration="underline"
              _hover={{ color: "#764ba2" }}
              onClick={(e) => {
                e.stopPropagation();
                handleViewEULA();
              }}
            >
              End-User License Agreement
            </Text>
          </Text>
        </HStack>
      </Box>

      {isOpen && (
        <Dialog.Root open={isOpen} placement="center" size="lg">
          <Portal>
            <Dialog.Backdrop bg="rgba(0, 0, 0, 0.5)" />
            <Dialog.Positioner>
              <Dialog.Content 
                bg="rgba(255, 255, 255, 0.95)"
                borderRadius="16px"
                boxShadow="0 20px 60px rgba(0, 0, 0, 0.15)"
                backdropFilter="blur(20px)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                maxW="600px"
                maxH="90vh"
                m={4}
              >
                <Dialog.Header p={6} pb={4}>
                  <Dialog.Title fontSize="xl" fontWeight="600" color="gray.800">
                    End-User License Agreement
                  </Dialog.Title>
                </Dialog.Header>
                <Dialog.Body overflowY="auto" p={6} pt={2} maxH="60vh">
                  <VStack align="start" spacing={4} fontSize="sm" lineHeight="1.6">
                    <Text>
                      This End-User License Agreement ("EULA") is a legal agreement between you (either an individual or a single entity) and AAIV app ("Licensor") for the use of AAIV app ("Software"). By clicking "I Agree" or installing or using the Software, you agree to be bound by the terms of this EULA.
                    </Text>

                    <Box>
                      <Heading size="md" mb={2}>License Grant</Heading>
                      <Text>
                        Licensor grants you a revocable, non-exclusive, non-transferable, limited license to download, install, and use the Software solely for your personal, non-commercial purposes strictly in accordance with the terms of this Agreement.
                      </Text>
                    </Box>

                    <Box>
                      <Heading size="md" mb={2}>Restrictions on Use</Heading>
                      <Text mb={2}>You may not:</Text>
                      <Box as="ul" listStyleType="disc" pl={5}>
                        <li>Copy, modify, or create derivative works of the Software.</li>
                        <li>Distribute, transfer, sublicense, lease, lend, or rent the Software to any third party.</li>
                        <li>Reverse engineer, decompile or disassemble the Software, except to the extent expressly permitted by applicable law.</li>
                        <li>Remove, alter, or obscure any proprietary notices on the Software.</li>
                        <li>Use the Software to create or distribute malicious software or for any unlawful purpose.</li>
                      </Box>
                    </Box>

                    <Box>
                      <Heading size="md" mb={2}>User-Generated Contributions</Heading>
                      <Text mb={2}>
                        The Licensed Application may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, providing opportunities to submit, post, and display content, including text, video, audio, images, comments, and personal information (collectively "Contributions"). Contributions may be visible to other users or third-party websites and apps, and as such, will be treated as non-confidential and non-proprietary.
                      </Text>

                      <Text mb={2}>By making Contributions, you represent and warrant that:</Text>
                      <Box as="ul" listStyleType="disc" pl={5} spacing={1}>
                        <li>Your Contributions will not infringe upon the rights of any third party, including copyrights, patents, trademarks, or trade secrets.</li>
                        <li>You have the necessary licenses and permissions to share the Contributions with the Licensed Application.</li>
                        <li>You have written consent from each identifiable person within your Contributions for its use.</li>
                        <li>Your Contributions are not false, inaccurate, or misleading.</li>
                        <li>Your Contributions are not unsolicited promotions, spam, or mass mailings.</li>
                        <li>Your Contributions are not obscene, offensive, lewd, violent, harassing, slanderous, or otherwise objectionable.</li>
                        <li>Your Contributions do not mock, intimidate, or abuse others.</li>
                        <li>Your Contributions do not harass or incite violence against individuals or groups.</li>
                        <li>Your Contributions comply with applicable laws and regulations.</li>
                        <li>Your Contributions do not violate privacy or publicity rights of others.</li>
                        <li>Your Contributions do not include content related to child pornography or harm to minors.</li>
                        <li>Your Contributions are free from offensive content connected to race, gender, sexual preference, or physical handicap.</li>
                        <li>Your Contributions do not violate or link to content that violates this EULA or any applicable law.</li>
                      </Box>

                      <Text fontWeight="bold" mt={2}>
                        No Tolerance for Objectionable Content or Abusive Users:
                      </Text>
                      <Text>
                        AAIV app maintains a strict policy against abusive or inappropriate content and users. Any violations will lead to the immediate removal of content and suspension or termination of your account.
                      </Text>

                      <Text mt={2}>
                        Any use of the Licensed Application that violates this EULA may result in termination of your rights to use the application, including content removal and account suspension.
                      </Text>
                    </Box>

                    <Box>
                      <Heading size="md" mb={2}>Jurisdiction</Heading>
                      <Text>
                        This EULA and any disputes arising out of it will be governed by the laws of the United States, without regard to its conflict of laws principles. Any legal actions or proceedings will be brought exclusively in the courts of WA.
                      </Text>
                    </Box>

                    <Box>
                      <Heading size="md" mb={2}>Termination of Licensing</Heading>
                      <Text>
                        Licensor may terminate this EULA at any time if you fail to comply with any term(s) of this Agreement. Upon termination, you must cease all use of the Software and destroy all copies, full or partial, of the Software.
                      </Text>
                    </Box>

                    <Box>
                      <Heading size="md" mb={2}>Warranty Disclaimer</Heading>
                      <Text>
                        THE SOFTWARE IS PROVIDED "AS IS" AND WITH ALL FAULTS. LICENSOR MAKES NO WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
                      </Text>
                    </Box>

                    <Box>
                      <Heading size="md" mb={2}>Limitations of Liability</Heading>
                      <Text>
                        To the maximum extent permitted by applicable law, in no event shall Licensor be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, use, or goodwill.
                      </Text>
                    </Box>

                    <Box>
                      <Heading size="md" mb={2}>Contact Information</Heading>
                      <Text>
                        If you have any questions about this EULA, please contact us at:<br />
                        AAIV app, 4253817761, dhyun1124@gmail.com
                      </Text>
                    </Box>
                  </VStack>
                </Dialog.Body>
                <Dialog.Footer p={6} pt={4}>
                  <Button 
                    bg="#667eea"
                    color="white"
                    onClick={handleClose}
                    _hover={{
                      bg: "#764ba2",
                      transform: "translateY(-1px)"
                    }}
                    borderRadius="8px"
                  >
                    Close
                  </Button>
                </Dialog.Footer>
                <CloseButton
                  position="absolute"
                  top={4}
                  right={4}
                  size="sm"
                  onClick={handleClose}
                />
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      )}
    </>
  );
};

export default EULA; 