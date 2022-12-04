import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';

export default function TreeLayout(props) {

    function initDiagram() {
        const $ = go.GraphObject.make;
        // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
        const diagram =
            $(go.Diagram,
                {
                    initialAutoScale: go.Diagram.UniformToFill,
                    layout: $(go.TreeLayout,
                        { angle: 90, nodeSpacing: 10, layerSpacing: 40, layerStyle: go.TreeLayout.LayerUniform })
                    // other properties are set by the layout function, defined below
                });

        const gridLayout = $(go.Group, "Auto",
            {
                layout: $(go.GridLayout,
                    {
                        wrappingColumn: NaN,
                        wrappingWidth: NaN
                    }),
                padding: new go.Margin(5) // to see the names of shapes on the bottom row
            },
            new go.Binding("row"),
            new go.Binding("column", 'col'),
            // the group is normally unseen -- it is completely transparent except when given a color or when highlighted
            $(go.Placeholder,
                { background: "#e0f2f1" },)
        );
        function genderBrushConverter(color) {
            if (color === "M") return '#90CAF9';
            if (color === "F") return '#F48FB1';
            return "orange";
        }


        // define a simple Node template
        const defaultNode =
            // 
            $(go.Node, "Auto",
                { deletable: false },
                new go.Binding("text", "name"),
                $(go.Shape, "Rectangle",
                    {
                        fill: "lightgray",
                        stroke: null, strokeWidth: 0,
                        stretch: go.GraphObject.Fill,
                        alignment: go.Spot.Center
                    },
                    new go.Binding("fill", "color")),
                $(go.TextBlock,
                    {
                        font: "700 12px Droid Serif, sans-serif",
                        textAlign: "center",
                        margin: 10, maxSize: new go.Size(80, NaN)
                    },
                    new go.Binding("text", "name"))
            );

        // define the Link template
        diagram.linkTemplate =
            $(go.Link,  // the whole link panel
                { routing: go.Link.Orthogonal, corner: 5, selectable: false },
                $(go.Shape, { strokeWidth: 3, stroke: '#424242' }));

        const borderNode =
            $(go.Node, "Table", { width: 1000 },
                $(go.Panel, "Auto",
                    {
                        stretch: go.GraphObject.Fill,
                        margin: 4,

                    },
                    new go.Binding("row"),
                    new go.Binding("column", "col"),

                    // $(go.Shape, "RoundedRectangle", { parameter1: 2, fill: "#fff", stroke: "#009688",height:1,width:1000 }),
                    $(go.Shape, "MinusLine", { height: 1, margin: 4, fill: null }),
                )
            );

        const nodeTemplateMap = new go.Map(); // In TypeScript you could write: new go.Map<string, go.Node>();
        nodeTemplateMap.add("", defaultNode);
        nodeTemplateMap.add("borderNode", borderNode);
        diagram.nodeTemplateMap = nodeTemplateMap;


        // diagram.linkTemplate =
        //     $(go.Link,
        //         { routing: go.Link.AvoidsNodes },  // link route should avoid nodes
        //         $(go.Shape,   // the "from" end arrowhead
        //             { fromArrow: "Standard", fill: "red" }),
        //         $(go.Shape,   // the "to" end arrowhead
        //             { toArrow: "Standard" })
        //     );

        const groupTemplateMap = new go.Map(); // In TypeScript you could write: new go.Map<string, go.Node>();
        groupTemplateMap.add("EmpReq", gridLayout);
        diagram.groupTemplateMap = groupTemplateMap;
        // diagram.model.nodeDataArray = createNode();
        diagram.model = new go.TreeModel(createNode());
        // diagram.model.linkDataArray = createLink();

        return diagram;
    }

    /**
     * This function handles any changes to the GoJS model.
     * It is here that you would make any updates to your React state, which is dicussed below.
     */
    function handleModelChange(changes) {
        console.log('GoJS model changed!');
    }
    function createNode() {
        const arr = [];
        const defaultArr = [
            { key: 0, name: "Source File", color: "#e91e63", birthYear: "1865", deathYear: "1936", reign: "1910-1936" },
            { key: 61, name: "Module Declaration", color: "#f44336", birthYear: "1894", deathYear: "1972", reign: "1936" },
            { key: 63, parent: 0, name: "Arrow Function", color: "#f44336", birthYear: "1894", deathYear: "1972", reign: "1936" },
            { key: 1, parent: 0, name: "Namespace import", color: "#f44336", birthYear: "1894", deathYear: "1972", reign: "1936" },
            { key: 2, parent: 0, name: "Import Specifier", color: "#f44336", birthYear: "1895", deathYear: "1952", reign: "1936-1952" },
            { key: 3, parent: 0, name: "Class Declaration", color: "#f44336", birthYear: "1926", reign: "1952-" },
            { key: 4, parent: 0, name: "Enum Declaration", color: "#f44336", birthYear: "1948" },
            { key: 5, parent: 0, name: "Variable Declaration", color: "#f44336", birthYear: "1982" },
            { key: 6, parent: 0, name: "Functional Declaration", color: "#f44336", birthYear: "1984" },
            { key: 7, parent: 3, name: "Constructor", color: "#9c27b0", birthYear: "1950" },
            { key: 8, parent: 3, name: "Method Declaration", color: "#9c27b0", birthYear: "1977" },
            { key: 9, parent: 3, name: "Property Declaration", color: "#9c27b0", birthYear: "2010" },
            { key: 10, parent: 3, name: "Get Accessor", color: "#9c27b0", birthYear: "1981" },
            { key: 11, parent: 4, name: "Enum Member", color: "#3f51b5", birthYear: "1960" },
            { key: 12, parent: 5, name: "Binding Element", color: "#00bcd4", birthYear: "1988" },
            { key: 13, parent: 6, name: "Type parameter", color: "#009688", birthYear: "1990" },
            { key: 14, parent: 6, name: "Parameter", color: "#009688", birthYear: "1964" },
            { key: 44, parent: 6, name: "Prperty Assgned", color: "#009688", birthYear: "2003" },
            { key: 45, parent: 19, name: "Arrow Function", color: "#4caf50", birthYear: "2007" },
        ]
        // for (let i = 0; i < 5; i++) {
        //     const newArr = JSON.parse(JSON.stringify(defaultArr));
        //     newArr.forEach(data => {
        //         data.key = data.key + '' + i;
        //         if (data.hasOwnProperty('group')) {
        //             data.group = data.group + '' + i
        //         }
        //         arr.push(data);
        //     })
        // }

        return defaultArr;

    }
    function createLink() {
        let arr = [
            { from: '10', to: '11' },
            { from: '20', to: '22' },
            { from: '30', to: '33' },
            { from: '40', to: '44' },
            { from: '21', to: '22' },
            { from: '31', to: '34' },
        ];

        return arr;
    }

    return (<>
        <div>
            <ReactDiagram
                initDiagram={initDiagram}
                divClassName='diagram-component'
                onModelChange={handleModelChange}
            />
        </div>
    </>)
}