'use strict'
/* eslint-env mocha */
const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)

const ipldRaw = require('../src/index')
const resolver = ipldRaw.resolver
const multihash = require('multihashes')

describe('raw codec', () => {
  let testData = Buffer.from('test data')
  let testBlob

  before(async () => {
    const result = await ipldRaw.util.serialize(testData)
    testBlob = result
  })

  it('multicodec is raw', () => {
    expect(resolver.multicodec).to.equal('raw')
  })

  it('defaultHashAlg is sha2-256', () => {
    expect(resolver.defaultHashAlg).to.equal('sha2-256')
  })

  it('resolver.resolve', async () => {
    const result = await resolver.resolve(testBlob, 'a/b/c/d')
    expect(result.value.toString('hex')).to.equal(testData.toString('hex'))
    expect(result.remainderPath).to.equal('')
  })

  it('resolver.tree', async () => {
    const paths = await resolver.tree(testBlob, {})
    expect(Array.isArray(paths)).to.eql(true)
    expect(paths.length).to.eql(0)
  })

  it('resolver.tree option parameter can be ignored', async () => {
    const paths = await resolver.tree(testBlob)
    expect(Array.isArray(paths)).to.eql(true)
    expect(paths.length).to.eql(0)
  })
})

describe('raw util', () => {
  let rawData = Buffer.from('some raw data')

  it('serialize is noop', async () => {
    const result = await ipldRaw.util.serialize(rawData)
    expect(result).to.equal(rawData)
  })

  it('deserialize is noop', async () => {
    const result = await ipldRaw.util.deserialize(rawData)
    expect(result).to.equal(rawData)
  })

  it('create cid', async () => {
    const cid = await ipldRaw.util.cid(rawData)
    expect(cid.version).to.equal(1)
    expect(cid.codec).to.equal('raw')
    expect(cid.multihash).to.exist()
    const mh = multihash.decode(cid.multihash)
    expect(mh.name).to.equal('sha2-256')
  })

  it('create cid with hashAlg', async () => {
    const cid = await ipldRaw.util.cid(rawData, { hashAlg: 'sha2-512' })
    expect(cid.version).to.equal(1)
    expect(cid.codec).to.equal('raw')
    expect(cid.multihash).to.exist()
    const mh = multihash.decode(cid.multihash)
    expect(mh.name).to.equal('sha2-512')
  })
})
