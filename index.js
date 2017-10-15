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
      block.transactions.map(leaf => {
        const index = rlp.encode(leaf.transactionIndex)
        const input = new TX(leaf).serialize()
        txTrie.put(index, input)
      })
      txTrie.findPath(rlp.encode(tx.transactionIndex), (err, node, keys, stack) => {
        console.log('node', node)
        console.log('keys', keys)
        console.log('stack', stack)
        console.log('block', new Block(block))
        // const prf = {
        //   blockHash: Buffer.from(tx.blockHash.substring(2), 'hex')
        //   header: new Block(block)
        //   path:
        //   value:
        // }
      })
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
