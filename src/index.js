'use strict'
const CID = require('cids')

// binary resolver
module.exports = {
  resolver: {
    multicodec: 'bin',
    resolve: (ipfsBlock, path, callback) => {
      callback(null, {
        value: ipfsBlock.data,
        remainderPath: ''
      })
    },
    tree: (ipfsBlock, options, callback) => {
      callback(null, [])
    }
  },
  util: {
    deserialize: (data, cb) => {
      cb(null, data)
    },
    serialize: (data, cb) => {
      cb(null, data)
    },
    cid: (data, cb) => {
      cb(null, new CID(1, 'base2', data))
    }
  }
}