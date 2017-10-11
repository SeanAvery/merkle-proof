import Provider from 'ethjs-provider-http'
import RPC from 'ethjs-rpc'

export class MerkleProof {
  constructor(params) {
    this.eth = new RPC(new Provider(params.provider))
  }

  async getTransactionProof(txHash) {
    try {
      const tx = await this.eth.sendAsync({
        method: 'eth_getTransactionByHash',
        params: [txHash]
      })
      console.log('tx', tx.blockHash)
      const block = await this.eth.sendAsync({
        method: 'eth_getBlockByHash',
        params: [tx.blockHash, true]
      })
      console.log('block', block)
    } catch (err) {
      Error('### error in getTransactionProof', err)
    }
  }
}

const txHash = '0x9cbf883dbf97bd0c4c7993e10b22f5325a91fc032b38682929ce112ad644632d'
const params = {
  provider : 'https://rinkeby.infura.io'
}

const MP = new MerkleProof(params)

MP.getTransactionProof(txHash).then(prf => console.log('proof', prf))
