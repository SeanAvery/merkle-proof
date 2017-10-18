import Provider from 'ethjs-provider-http'
import RPC from 'ethjs-rpc'
import Trie from 'merkle-patricia-tree'
import rlp from 'rlp'
import TX from 'ethereumjs-tx'
import Block from 'ethereumjs-block'

export class MerkleProof {
  constructor(params) {
    this.rpc = new RPC(new Provider(params.provider))
  }

  async getTransactionProof(txHash) {
    try {
      const tx = await this.rpc.sendAsync({
        method: 'eth_getTransactionByHash',
        params: [txHash]
      })
      if (!tx) Error('###', txHash, 'is not a valid tx')
      const block = await this.rpc.sendAsync({
        method: 'eth_getBlockByHash',
        params: [tx.blockHash, true]
      })
      const txTrie = new Trie()
      block.transactions.map(tx => this.formatTX(tx))
      .map(sibling => {
        console.log('sibling', sibling)
        // const index = rlp.encode(parseInt(sibling.transactionIndex))
        // const input = new TX(sibling).serialize()
        txTrie.put(index, input)
      })
      let prf
      txTrie.findPath(rlp.encode(tx.transactionIndex), (err, node, keys, stack) => {
        if (err) console.log('### error in findPath', err)
        // stack.map((node, i) => node.raw.map(comp => console.log('comp', comp)))
        // console.log('block', new Block(block).raw)
        // console.log('path', rlp.encode(tx.transactionIndex))
        // console.log('value', nodes.value)
        // prf = {
        //   blockHash: Buffer.from(tx.blockHash.substring(2), 'hex')
        //   header: new Block(block)
        //   path:
        //   value:
        // }
      })
      return prf
    } catch (err) {
      Error('### error in getTransactionProof', err)
    }
  }

  formatTX(tx) {
    tx.blockNumber = parseInt(tx.blockNumber)
    tx.gas = parseInt(tx.gas)
    tx.gasPrice = parseInt(tx.gasPrice)
    tx.nonce = parseInt(tx.nonce)
    tx.value = parseInt(tx.value)
    tx.transactionIndex = parseInt(tx.transactionIndex)
    return tx
  }

  rawStack(stack) {
    stack.map(node => node.raw)
  }
}

const txHash = '0x9cbf883dbf97bd0c4c7993e10b22f5325a91fc032b38682929ce112ad644632d'
const params = {
  provider : 'https://rinkeby.infura.io'
}

const MP = new MerkleProof(params)

MP.getTransactionProof(txHash)
// .then(prf => return MP.verifyTransaction(prf))
// .then(res =>> console.log('res', res))
.catch(err => Error('### error in test', err))
