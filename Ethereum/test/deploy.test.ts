import * as assert from 'assert'
import deploy, { getProvider } from '../deploy'

describe('deploy', () => {

  describe('getProvider()', () => {

      describe('running in a test environment', () => {
        it('should return a ganache url',() => {
          const provider = getProvider()
          assert.equal(process.env.GANACHE_URL, provider)
        })
      })

    describe('running in a production environment', () => {
      // @ts-ignore
      before(() => {
        process.env.RINKEBY = 'true'
      })

      afterEach(() => {
        process.env.RINKEBY = ''
      })

      it('should return a rinkeby test message',() => {
        const provider = getProvider()
        assert.equal('Rinkeby test success', provider)
      })
    })
  })
})
