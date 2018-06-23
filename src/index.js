'use strict'
const CID = require('cids')

// binary resolver
module.exports = {
  resolver: {
    multicodec: 'raw',
    defaultHashAlg: 'sha2-256',
    resolve: (binaryBlob, path, callback) => {
      callback(null, {
        value: binaryBlob,
        remainderPath: ''
      })
    },
    tree: (binaryBlob, options, callback) => {
      if (typeof options === 'function') {
        callback = options
      }
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
      cb(null, new CID(1, 'raw', data))
    }
  }
}
