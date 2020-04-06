
<html>

<head>
    <title>SigmaJS example</title>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/sigma.core.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/conrad.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/utils/sigma.utils.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/utils/sigma.polyfills.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/sigma.settings.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/classes/sigma.classes.dispatcher.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/classes/sigma.classes.configurable.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/classes/sigma.classes.graph.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/classes/sigma.classes.camera.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/classes/sigma.classes.quad.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/classes/sigma.classes.edgequad.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/captors/sigma.captors.mouse.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/captors/sigma.captors.touch.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/renderers/sigma.renderers.canvas.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/renderers/sigma.renderers.webgl.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/renderers/sigma.renderers.svg.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/renderers/sigma.renderers.def.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/renderers/canvas/sigma.canvas.labels.def.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/renderers/canvas/sigma.canvas.hovers.def.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/renderers/canvas/sigma.canvas.nodes.def.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/renderers/canvas/sigma.canvas.edges.def.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/renderers/canvas/sigma.canvas.edges.curve.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/renderers/canvas/sigma.canvas.edges.arrow.js"></script>
    <script
        src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/renderers/canvas/sigma.canvas.edges.curvedArrow.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/renderers/canvas/sigma.canvas.edgehovers.def.js"></script>
    <script
        src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/renderers/canvas/sigma.canvas.edgehovers.curve.js"></script>
    <script
        src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/renderers/canvas/sigma.canvas.edgehovers.arrow.js"></script>
    <script
        src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/renderers/canvas/sigma.canvas.edgehovers.curvedArrow.js"></script>
    <script
        src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/renderers/canvas/sigma.canvas.extremities.def.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/middlewares/sigma.middlewares.rescale.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/middlewares/sigma.middlewares.copy.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/misc/sigma.misc.animation.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/misc/sigma.misc.bindEvents.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/misc/sigma.misc.bindDOMEvents.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/src/misc/sigma.misc.drawHovers.js"></script>
    <!-- Sigma plugins -->
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/plugins/sigma.plugins.dragNodes/sigma.plugins.dragNodes.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/plugins/sigma.layout.forceAtlas2/supervisor.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sigma@1.2.1/plugins/sigma.layout.forceAtlas2/worker.js"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
    <style type="text/css">
        #container {
            max-width: 1000px;
            height: 1000px;
            margin: auto;
        }
    </style>

    <div id="container"></div>
    <script>
        // let graph = {
        //     nodes:
        //         [{
        //             id: 'orderer0',
        //             label: 'orderer0',
        //             x: 0.5626875615812934,
        //             y: 0.9017734005476234,
        //             color: 'red',
        //             size: 3
        //         },
        //         {
        //             id: 'mychannel',
        //             label: 'mychannel',
        //             x: 0.22069058683092013,
        //             y: 0.40017295633876504,
        //             color: 'blue',
        //             size: 3
        //         },
        //         {
        //             id: 'peer0.org1.example.com',
        //             label: 'peer0.org1.example.com',
        //             x: 0.10491894896096565,
        //             y: 0.15838563295654184,
        //             color: undefined,
        //             size: 3
        //         },
        //         {
        //             id: 'peer1.org1.example.com',
        //             label: 'peer1.org1.example.com',
        //             x: 0.46294282865778236,
        //             y: 0.8499520476715383,
        //             color: undefined,
        //             size: 3
        //         },
        //         {
        //             id: 'mychannel2',
        //             label: 'mychannel2',
        //             x: 0.21655653265511265,
        //             y: 0.7051005795743812,
        //             color: 'blue',
        //             size: 3
        //         },
        //         {
        //             id: 'peer0.org2.example.com',
        //             label: 'peer0.org2.example.com',
        //             x: 0.6632539224892684,
        //             y: 0.8116684978171043,
        //             color: undefined,
        //             size: 3
        //         }],
        //     edges:
        //         [{
        //             id: 'eCpeer0.org1.example.com',
        //             source: 'mychannel',
        //             type: 'curve',
        //             target: 'peer0.org1.example.com'
        //         },
        //         {
        //             id: 'epeer0.org1.example.com',
        //             source: 'orderer0',
        //             type: 'curve',
        //             target: 'peer0.org1.example.com'
        //         },
        //         {
        //             id: 'eCpeer1.org1.example.com',
        //             source: 'mychannel',
        //             type: 'curve',
        //             target: 'peer1.org1.example.com'
        //         },
        //         {
        //             id: 'epeer1.org1.example.com',
        //             source: 'orderer0',
        //             type: 'curve',
        //             target: 'peer1.org1.example.com'
        //         },
        //         {
        //             id: 'eCpeer0.org2.example.com',
        //             source: 'mychannel2',
        //             type: 'curve',
        //             target: 'peer0.org2.example.com'
        //         },
        //         {
        //             id: 'epeer0.org2.example.com',
        //             source: 'orderer0',
        //             type: 'curve',
        //             target: 'peer0.org2.example.com'
        //         }]
        // }
        
        $.ajax({
            type: 'GET',
            url: 'http://localhost:4000/input',
            dataType: 'text',
            success: function (data) {

                var s = new sigma(
                    {
                        graph: JSON.parse(data),
                        renderer: {
                            container: document.getElementById('container'),
                            type: sigma.renderers.canvas
                        },
                        settings: {
                            minArrowSize: 10,
                        }
                    }
                );

                let dragListener = sigma.plugins.dragNodes(s, s.renderers[0])
            }
        });

    </script>
</head>

</html>