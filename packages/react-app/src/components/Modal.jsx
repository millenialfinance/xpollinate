/* eslint-disable no-console */
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';

import { utils } from 'ethers';
import { Web3Context } from 'contexts/Web3Context';
import { ConnextModal } from 'millenial-modal';
import { ArrowUpDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Grid,
  Select,
  GridItem,
  Input,
  Text,
  IconButton,
  Center,
  Circle,
} from '@chakra-ui/react';
import getRpcUrl from 'lib/rpc';

export const CONNEXT_ROUTER =
  'vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC';


export const NETWORKS = [
  // {
  //   assetId: '0x0000000000000000000000000000000000000000',
  //   chainName: 'xDai Chain',
  //   chainId: 100,
  //   assets: {
  //     DAI: '0x0000000000000000000000000000000000000000',
  //     USDC: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
  //     USDT: '0x4ECaBa5870353805a9F068101A40E0f32ed605C6',
  //   },
  // },
  {
    assetId: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    chainName: 'Matic Mainnet',
    chainId: 137,
    vaults_url: {
      beefy: 'https://raw.githubusercontent.com/beefyfinance/beefy-app/prod/src/features/configure/vault/polygon_pools.js'
    },
    zappers: {
      MilFinV1: '0x17A32a805779feC6A0b3eBab6Cb60fc190Ae899B',
    },
    helpers: {
      LPvaultHelper: '0x62ABF31AeA50AAc7955b050CFE7D317d5a96aD52',
      SSvaultHelper: '0x96B84adb9f337db5541D83f514B26F73Efb0457e',
    },
    vaults: [
      {
        name: 'Beefy Finance mOCEAN/MATIC Q-LP Vault',
        token: '0x5a94F81D25c73eDdBDD84b84E8F6D36C58270510',
        address: '0x82303a4b2c821204A84AB2a068eC8EDf3Bc23061',
        router: 'QUICK'
      },
      {
        name: 'Beefy Finance wETH/wBTC Q-LP Vault',
        address: '0xf26607237355D7c6183ea66EC908729E9c6eEB6b',
        token: '0xdC9232E2Df177d7a12FdFf6EcBAb114E2231198D',
        router: 'QUICK'
      },
    ],
    enabled_router: 'QUICK',
    routers: {
      QUICK: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    },
    assets: {
      DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    },
  },
  {
    assetId: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    chainName: 'Fantom Mainnet',
    chainId: 250,
    vaults_url: {
      beefy: 'https://raw.githubusercontent.com/beefyfinance/beefy-app/prod/src/features/configure/vault/fantom_pools.js'
    },
    enabled_router: 'SPOOKY',
    routers: {
      SPOOKY: '0xf491e7b69e4244ad4002bc14e878a34207e38c29'
    },
    assets: {
      DAI: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
      USDC: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
      USDT: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
    },
    zappers: {
      MilFinV1: '0x743107Cd17EDb00f94b75A770787E15FEBe5ED39',
    },
    helpers: {
      LPvaultHelper: '0x78A4cEa45487301f266A46429F8086dD1c9868eb',
      SSvaultHelper: '0xCD7433C08690AFe405e880Ad7b59583eBF1a08d1',
    },
    vaults: [
      {
        name: 'LINK/FTM Beefy Finance Vault',
        address: '0x711969A90C9EDD815A5C2b441FC80d067EC5E969',
        router: 'SPOOKY',
        isLP: true,
        token: '0x89d9bc2f2d091cfbfc31e333d6dc555ddbc2fd29'
      },
      {
        name: 'CRV/FTM Beefy Finance Vault',
        address: '0xdf68Bf80D427A5827Ff2c06A9c70D407e17DC041',
        router: 'SPOOKY',
        isLP: true,
        token: '0xb471ac6ef617e952b84c6a9ff5de65a9da96c93b'
      },
      {
        name: 'AAVE/FTM Beefy Finance Vault',
        token: '0xebf374bb21d83cf010cc7363918776adf6ff2bf6',
        router: 'SPOOKY',
        isLP: true,
        address: '0xDa4bb93Bac7CC00F6c6e2193d115Cf45099b31a0',
      }
    ]
  },
  //   {
  //    assetId: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
  //   chainName: 'Binance Smart Chain Mainnet',
  //     chainId: 56,
  //     assets: {
  //       DAI: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
  //       USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  //       USDT: '0x55d398326f99059fF775485246999027B3197955',
  //     },
  //   }
  //
];
// export const ASSETS = ['DAI', 'USDC', 'USDT'];
export const ASSETS = ['DAI', 'USDC'];

const Modal = ({ disabled }) => {
  const { web3Provider, account } = useContext(Web3Context);
  const [showModal, setShowModal] = useState(false);
  const [withdrawalAddress, setWithdrawalAddress] = useState(false);
  const [recipient, setRecipient] = useState(account);
  const [callData, setCallData] = useState(false);
  const [helperText, setHelperText] = useState(undefined);
  const [senderOpen, setSenderOpen] = useState(false);
  const [receiverOpen, setReceiverOpen] = useState(false);
  const [vaultSelectorOpen, setVaultSelectorOpen] = useState(false);
  const [assetOpen, setAssetOpen] = useState(false);
  const [asset, setAsset] = useState(ASSETS[0]);
  const [senderChain, setSenderChain] = useState(NETWORKS[0]);
  const [receiverChain, setReceiverChain] = useState(NETWORKS[1]);
  const [showButton, setShowButton] = useState(!disabled);
  const [vault, setVault] = useState(NETWORKS[1].vaults[0]);
  const [beefyVaults, setBeefyVaults] = useState(receiverChain.vaults);

  useEffect(() => {
    if (receiverChain.vaults) {
      setVault(receiverChain.vaults[0]);
      setWithdrawalAddress(receiverChain.vaults[0].isLP ? receiverChain.helpers.LPvaultHelper : receiverChain.helpers.SSvaultHelper);
    }
  }, [receiverChain]);

  const isValidAddress = (input) => {
    const valid = input.match(/0x[0-9a-fA-F]{40}/);

    return !!valid;
  };

  useEffect(() => {
    if (receiverChain.vaults_url) {
      const getVaults = async (endPoint) => {
        try {
          const response = await axios.get(endPoint.beefy);
          const data = response.data;
          let vaults = '[' + data.substring(data.indexOf('\n') + 1);
          const allVaults = eval(vaults);
          const selectedVaults = allVaults.filter(v => {
            return (
              v.name.includes('LP') &&
                v.addLiquidityUrl.includes(
                  receiverChain.enabled_router.toLowerCase()
             )) ||
              !v.name.includes('LP');
          });
          const formattedVaults = selectedVaults.map(v => {
            return {
              name: `Beefy ${v.name} Vault`,
              token: v.tokenAddress,
              isLP: v.name.includes('LP'),
              router: receiverChain.enabled_router,
              address: v.earnContractAddress,
            };
          });

          setBeefyVaults(formattedVaults);
          setVault(formattedVaults[0]);
          setWithdrawalAddress(formattedVaults[0].isLP ? receiverChain.helpers.LPvaultHelper : receiverChain.helpers.SSvaultHelper);
        } catch (err) {
          console.error(err);
        }
      };

      getVaults(receiverChain.vaults_url);
    }
  }, [receiverChain]);

  useEffect(() => {
    setWithdrawalAddress(vault.isLP ? receiverChain.helpers.LPvaultHelper : receiverChain.helpers.SSvaultHelper);
  }, [vault, receiverChain]);

  useEffect(() => {
    if (
      receiverChain.zappers &&
      receiverChain.vaults &&
      receiverChain.routers &&
      receiverChain.routers[vault.router]
    ) {
      const zapper = receiverChain.zappers.MilFinV1;
      const fromTokenAddr = receiverChain.assets[asset];
      const router = receiverChain.routers[vault.router];
      console.log("Zapper: ", zapper);
      console.log("From token: ", fromTokenAddr);
      console.log("Router: ", router);
      console.log("Vault: ", vault);
      const coder = new utils.AbiCoder();
      const vals = [
        zapper,
        fromTokenAddr,
        vault.token,
        router,
        vault.address,
        account,
      ];

      console.log('Vals: ', vals);
      const _callData = coder.encode(
        ['address', 'address', 'address', 'address', 'address', 'address'],
        vals
      );

      console.log('Calldata: ', _callData);

      setCallData(_callData);
    }
  }, [recipient, account, asset, receiverChain, vault]);

  const handleChange = (event) => {
    const [addr, shouldShowButton] = event.target.value.split('-secret');

    if (!isValidAddress(addr.trim())) {
      setHelperText('Must be an Ethereum address');
      setShowButton(false);
      return;
    } else {
      setHelperText(undefined);
    }

    setShowButton(disabled ? shouldShowButton !== undefined : true);
    setRecipient(addr.trim());
  };

  const handleSubmit = (values) => {
    const errors = { receiverAddress: '' };

    if (!values.receiverAddress) {
      errors.receiverAddress = 'Required';
    }
    return errors;
  };

  const swapChains = () => {
    const s = senderChain;
    const r = receiverChain;

    setSenderChain(r);
    setReceiverChain(s);
  };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <Grid templateColumns="repeat(5, 1fr)" gap={4}>
          <GridItem colSpan={2}>
            <Select
              id="sender-chain"
              open={senderOpen}
              onClose={() => setSenderOpen(false)}
              onOpen={() => setSenderOpen(true)}
              onChange={(event) => setSenderChain(NETWORKS[event.target.value])}
              fullWidth
              value={NETWORKS.findIndex(
                (n) => n.chainId === senderChain.chainId
              )}
              borderColor="gray.300"
            // component={Select}
            >
              {NETWORKS.map((t, index) => {
                return (
                  <option value={index} key={index}>
                    {t.chainName} - {t.assetName}
                  </option>
                );
              })}
            </Select>
          </GridItem>
          <Center>
            <IconButton
              icon={
                <Circle size="2rem" bg="gray.100">
                  <ArrowUpDownIcon />
                </Circle>
              }
              variant="ghost"
              _hover={{ bg: 'white' }}
              transform="rotate(90deg)"
              onClick={swapChains}
            />
          </Center>
          <GridItem colStart={4} colEnd={6}>
            <Select
              id="receiver-chain"
              open={receiverOpen}
              onClose={() => setReceiverOpen(false)}
              onOpen={() => setReceiverOpen(true)}
              onChange={(event) =>
                setReceiverChain(NETWORKS[event.target.value])
              }
              fullWidth
              value={NETWORKS.findIndex(
                (n) => n.chainId === receiverChain.chainId
              )}
              borderColor="gray.300"
            // component={Select}
            >
              {NETWORKS.map((t, index) => {
                return (
                  <option value={index} key={index}>
                    {t.chainName} - {t.assetName}
                  </option>
                );
              })}
            </Select>
          </GridItem>
        </Grid>
        <Center>
          <Select
            id="asset"
            open={assetOpen}
            onClose={() => setAssetOpen(false)}
            onOpen={() => setAssetOpen(true)}
            onChange={(event) => setAsset(ASSETS[event.target.value])}
            fullWidth
            defaultValue={1}
            value={ASSETS.findIndex((a) => a === asset)}
            borderColor="gray.300"
            maxW="8rem"
            marginTop="1rem"
          // component={Select}
          >
            {ASSETS.map((t, index) => {
              return (
                <option value={index} key={index}>
                  {t}
                </option>
              );
            })}
          </Select>
        </Center>
        <Grid>
          <GridItem>
            <GridItem colStart={4} colEnd={6}>
              <Text mb="8px" fontWeight="light" marginTop="1rem" color="#6E7191">
                Destination Vault
            </Text>
              <Select
                id="selected-vault"
                open={vaultSelectorOpen}
                onClose={() => setVaultSelectorOpen(false)}
                onOpen={() => setVaultSelectorOpen(true)}
                onChange={(event) =>
                  setVault(beefyVaults[event.target.value])
                }
                fullWidth
                value={beefyVaults.findIndex(
                  (v) => v.address === vault.address
                )}
                borderColor="gray.300"
              // component={Select}
              >
                {beefyVaults.map((v, index) => {
                  return (
                    <option value={index} key={index}>
                      {v.name} - {v.address}
                    </option>
                  );
                })}
              </Select>
            </GridItem>
          </GridItem>
        </Grid>
        <Grid>
          <GridItem>
            <Text mb="8px" fontWeight="light" marginTop="1rem" color="#6E7191">
              Receiver Address*
            </Text>
            <Input
              label="Receiver Address"
              name="receiverAddress"
              aria-describedby="receiverAddress"
              defaultValue={recipient}
              onChange={handleChange}
              borderColor="gray.300"
              required
              fullWidth
            />
          </GridItem>
        </Grid>
      </form>

      {helperText && (
        <Grid>
          <GridItem>
            <Text id="helper-text" color="crimson" isTruncated>
              {helperText}
            </Text>
          </GridItem>
        </Grid>
      )}

      <Grid container spacing={2} style={{ justifyContent: 'center' }}>
        <Grid item style={{ marginTop: 24 }}>
          <Button
            isDisabled={
              !recipient ||
              !senderChain ||
              !receiverChain ||
              !callData ||
              senderChain.chainId === receiverChain.chainId
            }
            bgGradient="linear-gradient(257.5deg, #EB0055 -39.73%, #FFFA80 107.97%)"
            _focus={{ boxShadow: 'outline' }}
            _hover={{
              bg: 'linear-gradient(257.5deg, #EB0055 -39.73%, #FFFA80 107.97%)',
            }}
            fontWeight="light"
            disabled={
              !withdrawalAddress ||
              !senderChain ||
              !receiverChain ||
              !showButton ||
              senderChain.chainId === receiverChain.chainId
            }
            onClick={() => {
              console.log('senderChain: ', senderChain);
              console.log('receiverChain: ', receiverChain);
              console.log(
                'getRpcUrl(senderChain.chainId): ',
                getRpcUrl(senderChain.chainId)
              );
              console.log(
                'getRpcUrl(receiverChain.chainId): ',
                getRpcUrl(receiverChain.chainId)
              );
              setShowModal(true);
            }}
          >
            {disabled ? 'Disabled due to Maintenance' : 'SWAP'}
          </Button>
        </Grid>
      </Grid>

      {web3Provider !== 'undefined' ? (
        <ConnextModal
          showModal={showModal}
          routerPublicIdentifier={CONNEXT_ROUTER}
          depositAssetId={senderChain.assets[asset]}
          depositChainId={senderChain.chainId}
          withdrawAssetId={receiverChain.assets[asset]}
          withdrawChainId={receiverChain.chainId}
          withdrawalAddress={withdrawalAddress}
          withdrawalRecipient={recipient}
          vaultName={vault.name}
          withdrawCallTo={withdrawalAddress}
          withdrawCallData={callData}
          onClose={() => setShowModal(false)}
          depositChainProvider={getRpcUrl(senderChain.chainId)}
          withdrawChainProvider={getRpcUrl(receiverChain.chainId)}
          injectedProvider={web3Provider}
          loginProvider={window.ethereum}
        />
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
};

export default Modal;
