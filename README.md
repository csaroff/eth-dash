# eth-dash

eth-dash is a simple dashboard to view recent Ethereum transactions and their USD value.

## Installation

1. Install Node.js if you haven't already

2. Clone the eth-dash repository:

`git clone https://github.com/csaroff/eth-dash.git`

3. Install dependencies:

`npm install`

4. Start the development server:

`npm start`

5. View in browser at http://localhost:3000

## How it Works

eth-dash uses the Alchemy Web3 API to subscribe to new blocks on the Ethereum mainnet. When a new block is mined, it fetches the transactions in that block and looks up their value in USD using the CoinGecko API. It displays the transactions in a table, updating in real-time.

The front-end is built with React and uses the React Hooks API.

## Known Issues

Due to an issue with the Web3 library, the subscription is not properly cleaned up when the component unmounts. This causes the callback to be called twice in React strict mode. I disabled strict-mode pending a fix is in Web3.js.
(See: https://github.com/web3/web3.js/issues/3822)

## Future Improvements

- Add additional metrics like gas used, tx fees, etc.
- Improve styling and add dark mode
- Cache API calls to prevent duplicate data & improve performance
- Add tooltips/hover text for addresses
- Add batching to fetch the transaction values.
- Use the block number from the subscription instead of fetching the latest block's number.
