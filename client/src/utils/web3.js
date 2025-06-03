import Web3 from 'web3';

let web3;

export const initWeb3 = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      web3 = new Web3(window.ethereum);
      return web3;
    } catch (error) {
      console.error('User denied account access');
      return null;
    }
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
    return web3;
  } else {
    console.log('Non-Ethereum browser detected. Consider installing MetaMask!');
    return null;
  }
};

export const getMAZOLContract = (address, abi) => {
  if (!web3) return null;
  return new web3.eth.Contract(abi, address);
};

export const transferMazol = async (contract, from, to, amount) => {
  try {
    const result = await contract.methods
      .transfer(to, amount)
      .send({ from });
    return result;
  } catch (error) {
    console.error('Transfer failed:', error);
    throw error;
  }
};
