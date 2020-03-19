const { config } = require('./config');

class network_graph {
    constructor() {
        this.graph = {
            nodes: [],
            edges: []
        }
    }

    networkToJson() {
        for (let keys in config) {
            if (keys.replace(/[0-9]/g, '') == 'orderer') {
                this.newNode(keys, 'red');
            } else {
                for (let furtherKeys in config[keys]) {
                    let nodes = config[keys][furtherKeys];
                    var channel = nodes.channelName;
                    if (nodes.node == 'true') {
                        this.newNode(channel, 'blue');
                    } else if (nodes.node == 'multiple') {
                        for (let tmp in config[keys][furtherKeys]) {
                            let hostname = nodes[tmp].hostname;
                            if (typeof hostname != 'undefined') {
                                this.newNode(hostname);
                                let channel = config[keys].channel.channelName;
                                this.newEdge("C" + hostname, channel, hostname);
                                this.newEdge(hostname, 'orderer0', hostname);
                            }
                        }

                    }
                }
            }
        }

        return this.graph;
    }

    newEdge(id, source, target) {
        this.graph.edges.push({
            id: "e" + id,
            source: source,
            type: 'curve',
            target: target
        })
    }

    newNode(id, colour) {
        this.graph.nodes.push({
            id: id,
            label: id,
            x: Math.random(),
            y: Math.random(),
            color: colour,
            size: 3
        })

    }

}

// network = new network_graph();
// network.networkToJson()
module.exports = { network_graph }