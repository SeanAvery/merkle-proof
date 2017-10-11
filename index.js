import Provider from 'ethjs-provider-http'
import RPC from 'ethjs-rpc'

export class MerkleProof {
  constructor(params) {
    this.eth = new RPC(new Provider(params.provider))
    console.log('this.eth', this.eth)
  }
}

const params = {
  provider : 'https://gmainnet.infura.io'
}

new MerkleProof(params)
