'use strict'
const CID = require('cids')
const multihash = require('multihashing-async')

// binary resolver
module.exports = {
  resolver: {
    multicodec: 'raw',
    defaultHashAlg: 'sha2-256',
    resolve: async (binaryBlob, path) => {
      return {
        value: binaryBlob,
        remainderPath: ''
      }
    },
    tree: async (binaryBlob, options) => []
  },
  util: {
    deserialize: async (data) => data,
    serialize: async (data) => data,
    cid: async (data, options = {}) => {
      const hashAlg = options.hashAlg || 'sha2-256'
      const version = typeof options.version === 'undefined' ? 1 : options.version
      return new Promise((resolve, reject) => {
        multihash(data, hashAlg, (err, mh) => {
          if (err) return reject(err)
          resolve(new CID(version, 'raw', mh))
        })
      })
    }
  }
}
