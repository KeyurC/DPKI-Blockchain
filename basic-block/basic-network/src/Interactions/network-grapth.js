const path = require('path');
const { config } = require('../../utilities/config');

/**
 * The class is responsible for returning a JSON Object
 * of edges and nodes in order to construct a graph.
 */
class network_graph {
    constructor() {
        this.graph = {
            nodes: [],
            edges: []
        }
    }

    /**
     * Function searches through config and determines the right position
     * in order to construct edges and nodes
     */
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

    /**
     * Adds a new edge to JSON object
     * @param {String} id Unique ID for edge
     * @param {String} source Source of edge
     * @param {String} target Destination of edge
     */
    newEdge(id, source, target) {
        this.graph.edges.push({
            id: "e" + id,
            source: source,
            type: 'curve',
            target: target
        })
    }

    /**
     * Adds a new node to JSON object
     * @param {String} id Unique ID for node 
     * @param {String} colour colour for node
     */
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

module.exports = network_graph;