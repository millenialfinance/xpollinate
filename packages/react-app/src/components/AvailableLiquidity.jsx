import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { providers, constants, Contract, utils } from 'ethers';
import { getSignerAddressFromPublicIdentifier } from '@connext/vector-utils';
import { ERC20Abi } from '@connext/vector-types';

import getRpcUrl from '../lib/rpc';
import networkName from '../lib/network';
import { NETWORKS, CONNEXT_ROUTER } from './Modal';

export const VAULT_ZAP_HELPER = '0x42330e4594755feBD80ECbe053a1113FBAF62dCF';

export const VAULT_HELPER_ABI = [
  'function getCallData(tuple(address zapper, address from, address to, address router, address vault, address recipient)) public pure returns (bytes memory)',
];

const vaultZapData = {
  zapper: '0xFFafe7351CFF127e1c127378019603f7132EF5f1',
  from: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
  to: '0xdC9232E2Df177d7a12FdFf6EcBAb114E2231198D',
  router: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
  vault: '0xf26607237355D7c6183ea66EC908729E9c6eEB6b',
  recipient: '0x8A2738252bE6Eeb8F1eD0a302c61E7a81b09f48C',
};


const AvailableLiquidity = () => {
  const [tableData, setTableData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const effect = async () => {
      const signerAddress = getSignerAddressFromPublicIdentifier(
        CONNEXT_ROUTER
      );
      const _tableData = [];

      for (const network of NETWORKS) {
        // eslint-disable-next-line no-console
        console.log('network: ', network);
        const chainProvider = new providers.JsonRpcProvider(
          getRpcUrl(network.chainId)
        );

        if (network.chainId === 250) {
          const coder = new utils.AbiCoder();
          const callData = coder.encode(['address', 'address', 'address', 'address', 'address', 'address'], Object.values(vaultZapData));

          console.log("calldata: ", callData);
          console.log(callData);
        }

        for (const [assetName, assetId] of Object.entries(network.assets)) {
          let onchainBalance;
          let decimals = 18;

          try {
            if (assetId === constants.AddressZero) {
              onchainBalance = await chainProvider.getBalance(signerAddress);
            } else {
              const tokenContract = new Contract(
                assetId,
                ERC20Abi,
                chainProvider
              );

              onchainBalance = await tokenContract.balanceOf(signerAddress);
              decimals = await tokenContract.decimals();
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(
              `Couldn't get balance or decimals for asset ${assetName}:${assetId} on chain ${network.chainId}`,
              e
            );
          }

          const row = {
            chain: networkName(network.chainId),
            assetName,
            balance: onchainBalance
              ? utils.formatUnits(onchainBalance, decimals)
              : '-',
          };

          // eslint-disable-next-line no-console
          console.log('table row: ', row);
          _tableData.push(row);
        }
      }

      setTableData(_tableData);
      setLoadingData(false);
    };

    effect();
  }, []);
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Destination Chain</TableCell>
            <TableCell align="right">Asset</TableCell>
            <TableCell align="right">Exit Liquidity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loadingData ? (
            <TableRow>{'Loading...'}</TableRow>
          ) : (
            tableData.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.chain}
                </TableCell>
                <TableCell align="right">{row.assetName}</TableCell>
                <TableCell align="right">
                  {parseFloat(row.balance).toFixed(2).toString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AvailableLiquidity;
