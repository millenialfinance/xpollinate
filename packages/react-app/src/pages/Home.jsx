import React from 'react';
import { Text } from '@chakra-ui/react';
import { Container } from 'components/index';

export const Home = (props) => (
  <div>
    <Text
      align="center"
      p="1rem"
      fontWeight="thin"
      fontSize="2xl"
      fontFamily="sans-serif"
    >
      Cross-Chain Vault Zap
    </Text>
    <Text
      align="center"
      p="1rem"
      fontWeight="thin"
      fontSize="xl"
      fontFamily="sans-serif"
    >
      By <a href="https://milfinance.xyz">Millennial Finance</a>
    </Text>
    <Text
      align="center"
      p="1rem"
      fontWeight="thin"
      fontSize="l"
      fontFamily="sans-serif"
    >
      This will zap your DAI into the selected vault at{' '}
      <a href="https://polygon.beefy.finance/">Beefy Finance</a>
    </Text>
    <Container />
  </div>
);
