'use strict'
/* eslint-env mocha */
const IpfsBlock = require('ipfs-block')
const CID = require('cids')
const multihashing = require('multihashing-async')
const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)

const ipldRaw = require('../src/index')
const resolver = ipldRaw.resolver

describe('raw codec', () => {
  let testData = Buffer.from('test data')
  let testIpfsBlock

  before((done) => {
    ipldRaw.util.serialize(testData, (err, result) => {
      expect(err).to.not.exist()
      toIpfsBlock(resolver.multicodec, result, (err, ipfsBlock) => {
        expect(err).to.not.exist()
        testIpfsBlock = ipfsBlock
        done()
      })
    })
  })

  it('multicodec is raw', () => {
    expect(resolver.multicodec).to.equal('raw')
  })

  it('resolver.resolve', () => {
    resolver.resolve(testIpfsBlock, 'a/b/c/d', (err, result) => {
      expect(err).to.not.exist()
      expect(result.value.toString('hex')).to.equal(testData.toString('hex'))
      expect(result.remainderPath).to.equal('')
    })
  })

  it('resolver.tree', () => {
    resolver.tree(testIpfsBlock, {}, (err, paths) => {
      expect(err).to.not.exist()
      expect(Array.isArray(paths)).to.eql(true)
      expect(paths.length).to.eql(0)
    })
  })
})

function toIpfsBlock (multicodec, value, callback) {
  multihashing(value, 'keccak-256', (err, hash) => {
    if (err) {
      return callback(err)
    }
    const cid = new CID(1, multicodec, hash)
    callback(null, new IpfsBlock(value, cid))
  })
}
