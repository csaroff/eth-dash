import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';
const web3 = new Web3(`wss://eth-mainnet.alchemyapi.io/v2/GNauZOAEhjOc34zQQqQuXorOlmC6wJ6W`);


const Transactions = () => {
  const [block, setBlock] = useState({ blockNumber: 0, transactions: []});
  const {blockNumber, transactions} = block;

  useEffect(() => {
    console.log("UseEffect called");
    const fetchTransactions = async () => {
      console.log('Fetching transactions...', new Date().toLocaleTimeString());
      const latestBlock = await web3.eth.getBlock('latest');
      const priceData = await axios.get(COINGECKO_API_URL);
      const txPromises = latestBlock.transactions.map(async (txHash) => {
        const tx = await web3.eth.getTransaction(txHash);
        const ethValue = tx.value / 10 ** 18; // Convert from wei to ether
        const usdValue = ethValue * priceData.data.ethereum.usd;
        return {
          from: tx.from,
          to: tx.to,
          ethValue: ethValue,
          usdValue: usdValue,
        };
      });
      const blockNumber = await web3.eth.getBlockNumber();
      const transactions = await Promise.all(txPromises);
      setBlock({ blockNumber, transactions })
    };

    fetchTransactions();

    const subscription = web3.eth.subscribe("newBlockHeaders", fetchTransactions);

    return () => {
      // Unfortunately, this method doesn't work https://github.com/web3/web3.js/issues/3822
      // This causes the subscription to be called twice when running react in strict mode :(
      // https://stackoverflow.com/a/60619061/6051733
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      <h1>Recent Transactions for Block {blockNumber}</h1>
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Value (ETH)</th>
            <th>Value (USD)</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={index}>
              <td>{tx.from}</td>
              <td>{tx.to}</td>
              <td>{tx.ethValue}</td>
              <td>${tx.usdValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
