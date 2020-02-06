module.exports = {
    /**
     * Networks define how you connect to your ethereum client and let you set the
     * defaults web3 uses to send transactions. If you don't specify one truffle
     * will spin up a development blockchain for you on port 9545 when you
     * run `develop` or `test`. You can ask a truffle command to use a specific
     * network from the command line, e.g
     *
     * $ truffle test --network <network-name>
     */

    networks: {
        // Useful for testing. The `development` name is special - truffle uses it by default
        // if it's defined here and no other network is specified at the command line.
        // You should run a client (like ganache-cli, geth or parity) in a separate terminal
        // tab if you use this network and you must also set the `host`, `port` and `network_id`
        // options below to some value.
        ganache: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*",
            gasPrice: "500000000000"
        },
        sirius: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "162",
            gasPrice: "500000000000",
            from: "0xd119b8b038d3a67d34ca1d46e1898881626a082b"
        },
        standalone: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "161",
            gasPrice: "500000000000",
            from: "0xc916cfe5c83dd4fc3c3b0bf2ec2d4e401782875e"
        }
    },
    // Set default mocha options here, use special reporters etc.
    mocha: {
        // timeout: 100000
    },
    // Configure your compilers
    compilers: {
        solc: {
          version: '0.5.8',
        }
    }
};
