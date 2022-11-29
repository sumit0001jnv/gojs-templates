import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { useState } from 'react';

export default function Page2(props) {

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
        diagram.groupTemplate =
            $(go.Group, "Auto",
                {
                    layout: $(go.LayeredDigraphLayout,
                        { direction: 0, columnSpacing: 10 })
                },
                $(go.Shape, "RoundedRectangle", // surrounds everything
                    { parameter1: 10, fill: "rgba(128,128,128,0.33)" }),
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
                        { padding: new go.Margin(0, 10), background: "white" })
                )
            );

        // define the Link template
        diagram.linkTemplate =
            $(go.Link,
                { selectable: false },
                $(go.Shape,
                    { strokeWidth: 3, stroke: "#333" }));

        rebuildGraph(diagram);
        return diagram;
    }

    function rebuildGraph(myDiagram) {
        // var numNodes = document.getElementById("numNodes").value;
        // numNodes = parseInt(numNodes, 10);
        // if (isNaN(numNodes)) numNodes = 16;

        // var width = document.getElementById("width").value;
        // width = parseFloat(width, 10);

        // var height = document.getElementById("height").value;
        // height = parseFloat(height, 10);

        // var randSizes = document.getElementById("randSizes").checked;

        // var circ = document.getElementById("circ").checked;

        // var cyclic = document.getElementById("cyclic").checked;

        // var minLinks = document.getElementById("minLinks").value;
        // minLinks = parseInt(minLinks, 10);

        // var maxLinks = document.getElementById("maxLinks").value;
        // maxLinks = parseInt(maxLinks, 10);

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

    function generateNodes(myDiagram, numNodes, width, height, randSizes, circ) {
        var nodeArray = [];
        for (var i = 0; i < numNodes; i++) {
            var size;
            if (randSizes) {
                size = new go.Size(Math.floor(Math.random() * (65 - width + 1)) + width, Math.floor(Math.random() * (65 - height + 1)) + height);
            } else {
                size = new go.Size(width, height);
            }

            if (circ) size.height = size.width;

            var figure = "Rectangle";
            if (circ) figure = "Ellipse";

            nodeArray.push({
                key: i,
                text: i.toString(),
                figure: figure,
                fill: go.Brush.randomColor(),
                size: size
            });
        }

        // randomize the data, to help demonstrate sorting
        for (i = 0; i < nodeArray.length; i++) {
            var swap = Math.floor(Math.random() * nodeArray.length);
            var temp = nodeArray[swap];
            nodeArray[swap] = nodeArray[i];
            nodeArray[i] = temp;
        }

        // set the nodeDataArray to this array of objects
        myDiagram.model.nodeDataArray = nodeArray;
        console.log(nodeArray);

        // setNodeArray(() => [...nodeArray]);
    }

    function generateLinks(myDiagram, min, max, cyclic) {
        if (myDiagram.nodes.count < 2) return;
        var linkArray = [];
        var nit = myDiagram.nodes;
        var nodes = new go.List(/*go.Node*/);
        nodes.addAll(nit);
        var num = nodes.length;
        if (cyclic) {
            for (var i = 0; i < num; i++) {
                if (i >= num - 1) {
                    linkArray.push({ from: i, to: 0 });
                } else {
                    linkArray.push({ from: i, to: i + 1 });
                }
            }
        } else {
            if (isNaN(min) || min < 0) min = 0;
            if (isNaN(max) || max < min) max = min;
            for (var i = 0; i < num; i++) {
                var next = nodes.get(i);
                var children = Math.floor(Math.random() * (max - min + 1)) + min;
                for (var j = 1; j <= children; j++) {
                    var to = nodes.get(Math.floor(Math.random() * num));
                    // get keys from the Node.text strings
                    var nextKey = parseInt(next.text, 10);
                    var toKey = parseInt(to.text, 10);
                    if (nextKey !== toKey) {
                        linkArray.push({ from: nextKey, to: toKey });
                    }
                }
            }
        }
        myDiagram.model.linkDataArray = linkArray;
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

    function getRadioValue(name) {
        var radio = document.getElementsByName(name);
        for (var i = 0; i < radio.length; i++)
            if (radio[i].checked) return radio[i].value;
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