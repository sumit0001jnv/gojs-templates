import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
export default function Page2(props) {

    const scaleDiagram = 10;

    function initDiagram() {
        const $ = go.GraphObject.make;
        // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
        const diagram =
            $(go.Diagram,
                {
                    initialAutoScale: go.Diagram.UniformToFill,
                    layout: $(go.CircularLayout)
                    // other properties are set by the layout function, defined below
                });

        // define a simple Node template
        diagram.nodeTemplate =
            $(go.Node, "Auto",
                $(go.Shape, "Ellipse", { fill: "white" }),
                $(go.TextBlock,
                    new go.Binding("text", "key"))
            );
        createNodeTemplatesArr(diagram, $);
        diagram.groupTemplate =
            $(go.Group, "Auto",
                {
                    layout: $(go.LayeredDigraphLayout,
                        { direction: 0, columnSpacing: 10 }),
                    // background: 'rgba(0,255,0,.3)',
                    // layout: $(go.CircularLayout, {
                    //     spacing: NaN,
                    //     radius: 100
                    // }),
                    // locationSpot: go.Spot.Center,
                    // locationObjectName: 'CENTER',
                    computesBoundsIncludingLinks : false,
                },
                new go.Binding("isSubGraphExpanded", "isSubGraphExpanded"),
                $(go.Shape, "RoundedRectangle", { parameter1: 10, fill: "lightgreen", stroke: "darkgreen" }),
                // $(go.Shape, "RoundedRectangle", // surrounds everything
                //     { parameter1: 10, fill: "rgba(128,128,128,0.33)" }),
                $(go.Panel, "Vertical",  // position header above the subgraph
                    { defaultAlignment: go.Spot.Left },
                    $(go.Panel, "Horizontal",  // the header
                        { defaultAlignment: go.Spot.Top },
                        $("SubGraphExpanderButton"),  // this Panel acts as a Button
                        $(go.TextBlock,     // group title near top, next to button
                            { font: "Bold 12pt Sans-Serif" },
                            new go.Binding("text", "key"))
                    ),
                    $(go.Placeholder,     // represents area for all member parts
                        { padding: new go.Margin(0, 10), background: "white" },
                    ))
            );

        // diagram.layout = $(go.LayeredDigraphLayout,
        //     { direction: 90, layerSpacing: 10, isRealtime: false });

        // define the Link template
        diagram.linkTemplate =
            $(go.Link,
                { routing: go.Link.AvoidsNodes },  // link route should avoid nodes
                $(go.Shape),
                $(go.Shape, { toArrow: "Standard" })
            );

        rebuildGraph(diagram);
        return diagram;
    }

    function createNodeTemplatesArr(diagram, $) {
        var simpletemplate =
            $(go.Node, "Auto",
                $(go.Shape, "Ellipse",
                    new go.Binding("fill", "color")),
                $(go.TextBlock,
                    new go.Binding("text", "key")),
                {
                    toolTip:
                        $("ToolTip",
                            $(go.TextBlock, { margin: 4 },
                                new go.Binding("text", "key"))
                        )
                }
            );

        // the "detailed" template shows all of the information in a Table Panel
        var detailtemplate =
            $(go.Node, "Auto",
                $(go.Shape, "RoundedRectangle",
                    new go.Binding("fill", "color")),
                $(go.Panel, "Table",
                    { defaultAlignment: go.Spot.Left },
                    $(go.TextBlock, { row: 0, column: 0, columnSpan: 2, font: "bold 12pt sans-serif" },
                        new go.Binding("text", "key")),
                    // $(go.TextBlock, { row: 1, column: 0 }, "Description:"),
                    // $(go.TextBlock, { row: 1, column: 1 }, new go.Binding("text", "key")),
                    // $(go.TextBlock, { row: 2, column: 0 }, "Color:"),
                    // $(go.TextBlock, { row: 2, column: 1 },
                    //      new go.Binding("text", "color")
                    // )
                )
            );

        // create the nodeTemplateMap, holding three node templates:
        var templmap = new go.Map(); // In TypeScript you could write: new go.Map<string, go.Node>();
        // for each of the node categories, specify which template to use
        templmap.add("simple", simpletemplate);
        templmap.add("detailed", detailtemplate);
        // for the default category, "", use the same template that Diagrams use by default;
        // this just shows the key value as a simple TextBlock
        templmap.add("", diagram.nodeTemplate);

        diagram.nodeTemplateMap = templmap;
    }   

    function rebuildGraph(myDiagram) {
        generateCircle(myDiagram, 5, 100, 50, 4, 10, true, false, true);
    }

    function generateCircle(myDiagram, numNodes, width, height, minLinks, maxLinks, randSizes, circ, cyclic) {
        myDiagram.startTransaction("generateCircle");
        // replace the diagram's model's nodeDataArray
        generateNodes(myDiagram, numNodes, width, height, randSizes, circ);
        // replace the diagram's model's linkDataArray
        generateLinks(myDiagram, minLinks, maxLinks, cyclic);
        // force a diagram layout
        layout(myDiagram);
        myDiagram.commitTransaction("generateCircle");
    }

    function generateNodes(myDiagram) {
        myDiagram.model.nodeDataArray = createNode();
    }
    function createNode() {
        let sampleArr = [
            { key: "Node 1", color: "pink", category: "detailed" },
            { key: "Group 1", isGroup: true, isSubGraphExpanded: true },
            { key: "Node 2", group: "Group 1", color: "pink", category: "detailed" },
            { key: "Node 3", group: "Group 1", color: "pink", category: "detailed" },
            { key: "Node 4", group: "Group 1", color: "pink", category: "detailed" },
            { key: "Node 5", group: "Group 1", color: "pink", category: "detailed" },
            { key: "Node 6", color: "pink", category: "detailed" }];

        let arr = [];

        for (let i = 0; i < scaleDiagram; i++) {
            const newSample = JSON.parse(JSON.stringify(sampleArr));

            newSample[0].key = newSample[0].key + '-' + i;
            newSample[1].key = newSample[1].key + '-' + i;
            newSample[1].isSubGraphExpanded =( i%2===0);

            newSample[2].key = newSample[2].key + '-' + i;
            newSample[2].group = newSample[2].group + '-' + i;

            newSample[3].key = newSample[3].key + '-' + i;
            newSample[3].group = newSample[3].group + '-' + i;

            newSample[4].key = newSample[4].key + '-' + i;
            newSample[4].group = newSample[4].group + '-' + i;

            newSample[5].key = newSample[5].key + '-' + i;
            newSample[5].group = newSample[5].group + '-' + i;

            newSample[6].key = newSample[6].key + '-' + i;
            console.log("-------------------------------")
            console.log(newSample)
            console.log("----------------------------------")
            arr.push(...newSample);
        }


        return arr;

    }
    function createLink() {
        let sampleArr = [
            { from: "Node 1", to: "Group 1" }, // from a Node to the Group
            { from: "Node 2", to: "Node 3" },  // this link is a member of the Group
            { from: "Node 2", to: "Node 4" },  // this link is a member of the Group
            { from: "Node 3", to: "Node 5" },  // this link is a member of the Group
            { from: "Node 4", to: "Node 5" },  // this link is a member of the Group
            { from: "Group 1", to: "Node 6" }  // from the Group to a Node
        ];
        let arr = [];

        for (let i = 0; i < scaleDiagram; i++) {
            const newSample = JSON.parse(JSON.stringify(sampleArr));
            for (let j = 0; j < 6; j++) {
                newSample[j].from = newSample[j].from + '-' + i;
                newSample[j].to = newSample[j].to + '-' + i;
            }

            arr.push(...newSample);
        }
        arr.push(
            { from: "Node 2-1", to: "Node 2-5" },
            { from: "Node 2-1", to: "Node 2-4" },
            { from: "Node 2-2", to: "Node 2-4" },
            { from: "Node 2-3", to: "Node 2-4" },
            { from: "Node 3-3", to: "Node 3-4" }
        )
        return arr;
    }

    function generateLinks(myDiagram, min, max, cyclic) {
        myDiagram.model.linkDataArray = createLink();
        // setLinkArray(()=>[...linkArray]);
    }

    // Update the layout from the controls, and then perform the layout again
    function layout(myDiagram) {
        myDiagram.startTransaction("change Layout");
        var lay = myDiagram.layout;

        var radius = document.getElementById("radius")?.value;
        if (radius !== "NaN") radius = parseFloat(radius, 10);
        else radius = NaN;
        lay.radius = radius;

        var aspectRatio = document.getElementById("aspectRatio")?.value;
        aspectRatio = parseFloat(aspectRatio, 10);
        lay.aspectRatio = aspectRatio;

        var startAngle = document.getElementById("startAngle")?.value;
        startAngle = parseFloat(startAngle, 10);
        lay.startAngle = startAngle;

        var sweepAngle = document.getElementById("sweepAngle")?.value;
        sweepAngle = parseFloat(sweepAngle, 10);
        lay.sweepAngle = sweepAngle;

        var spacing = document.getElementById("spacing")?.value;
        spacing = parseFloat(spacing, 10);
        lay.spacing = spacing;

        var arrangement = document.getElementById("arrangement")?.value;
        if (arrangement === "ConstantDistance") lay.arrangement = go.CircularLayout.ConstantDistance;
        else if (arrangement === "ConstantAngle") lay.arrangement = go.CircularLayout.ConstantAngle;
        else if (arrangement === "ConstantSpacing") lay.arrangement = go.CircularLayout.ConstantSpacing;
        else if (arrangement === "Packed") lay.arrangement = go.CircularLayout.Packed;

        lay.nodeDiameterFormula = go.CircularLayout.Pythagorean;

        var direction = document.getElementById("direction")?.value;
        if (direction === "Clockwise") lay.direction = go.CircularLayout.Clockwise;
        else if (direction === "Counterclockwise") lay.direction = go.CircularLayout.Counterclockwise;
        else if (direction === "BidirectionalLeft") lay.direction = go.CircularLayout.BidirectionalLeft;
        else if (direction === "BidirectionalRight") lay.direction = go.CircularLayout.BidirectionalRight;

        var sorting = document.getElementById("sorting")?.value;
        if (sorting === "Forwards") lay.sorting = go.CircularLayout.Forwards;
        else if (sorting === "Reverse") lay.sorting = go.CircularLayout.Reverse;
        else if (sorting === "Ascending") lay.sorting = go.CircularLayout.Ascending;
        else if (sorting === "Descending") lay.sorting = go.CircularLayout.Descending;
        else if (sorting === "Optimized") lay.sorting = go.CircularLayout.Optimized;

        myDiagram.commitTransaction("change Layout");
    }




    /**
     * This function handles any changes to the GoJS model.
     * It is here that you would make any updates to your React state, which is dicussed below.
     */
    function handleModelChange(changes) {
        alert('GoJS model changed!');
    }

    return (<>
        <ReactDiagram
            initDiagram={initDiagram}
            // nodeDataArray={nodeArray}
            // linkDataArray={linkArray}
            divClassName='diagram-component'
        />
    </>)
}