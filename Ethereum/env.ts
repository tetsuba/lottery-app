
type EnvTypes = {
    TEST: boolean,
    RINKEBY: boolean,
    GANACHE_URL: string,
    RINKEBY_KEY: string,
    RINKEBY_URL: string
}

export default function Env(): EnvTypes {
    return {
        /* Used for testing */
        TEST: !!process.env.TEST,
        GANACHE_URL: process.env.GANACHE_URL || '',

        /* Used for deploying a contract */
        RINKEBY: !!process.env.RINKEBY,
        RINKEBY_KEY: process.env.RINKEBY_KEY || '',
        RINKEBY_URL: process.env.RINKEBY_URL || ''
    }
}
