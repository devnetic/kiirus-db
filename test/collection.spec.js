import test from 'ava'
import sinon from 'sinon'

import * as fetch from '@devnetic/fetch'

import { Client } from './../src'

console.log(fetch);


const host = 'http://localhost'
const port = 8008
const database = 'test-database'
const collection = 'tasks'

const client = Client.connect(`${host}:${port}`)

let fetchStub
let sendSpy

test.beforeEach(t => {
  fetchStub = sinon.stub(fetch, 'default')
  sendSpy = sinon.spy(client, 'send')
})

test('insert records to collection succesfully', async (t) => {
  const expectedCommand = {
    command: 'collection-insert',
    options: {
      database,
      collection,
      body: [
        { item: 'journal', qty: 25, size: { h: 14, w: 21, uom: 'cm' }, status: 'A' },
        { item: 'notebook', qty: 50, size: { h: 8.5, w: 11, uom: 'in' }, status: 'A' }
      ]
    }
  }

  const expectedResult = {
    nInserted: 2
  }

  const options = {
    method: 'POST',
    body: JSON.stringify(expectedCommand),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'Content-Length': Buffer.byteLength(JSON.stringify(expectedCommand))
    }
  }

  fetchStub.calledWith(`${host}:${port}`, options)
  fetchStub.resolves({ json: () => { return expectedResult } })

  const result = await client
    .db(database)
    .collection(collection)
    .insert([
      { item: 'journal', qty: 25, size: { h: 14, w: 21, uom: 'cm' }, status: 'A' },
      { item: 'notebook', qty: 50, size: { h: 8.5, w: 11, uom: 'in' }, status: 'A' }
    ])

  t.true(sendSpy.calledWith(expectedCommand))
  t.deepEqual(result, expectedResult)
})
