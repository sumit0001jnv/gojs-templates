import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';

export default function GridLayout(props) {

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

        // define a simple Node template
        const defaultNode =
            // 
            $(go.Node, "Auto",
                {
                    stretch: go.GraphObject.Fill,
                    padding: 1,
                    fromSpot: go.Spot.Right,  // coming out from middle-right
                    toSpot: go.Spot.Left
                },
                new go.Binding("row"),
                new go.Binding("column", "col"),
                $(go.Panel, "Auto",
                    $(go.Shape, "RoundedRectangle", { parameter1: 4, fill: "#fff", stroke: "#424242" }),
                    $(go.TextBlock, new go.Binding("text", "name"),
                        {
                            stretch: go.GraphObject.Fill,
                            width: 150,
                            verticalAlignment: go.Spot.Center,
                            font: '12pt sans-serif', stroke: "#424242"
                        })
                )
            );

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


        diagram.linkTemplate =
            $(go.Link,
                { routing: go.Link.AvoidsNodes },  // link route should avoid nodes
                $(go.Shape,   // the "from" end arrowhead
                    { fromArrow: "Standard", fill: "red" }),
                $(go.Shape,   // the "to" end arrowhead
                    { toArrow: "Standard" })
            );

        const groupTemplateMap = new go.Map(); // In TypeScript you could write: new go.Map<string, go.Node>();
        groupTemplateMap.add("EmpReq", gridLayout);
        diagram.groupTemplateMap = groupTemplateMap;
        diagram.model.nodeDataArray = createNode();
        diagram.model.linkDataArray = createLink();

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
            { key: "EmpReq", row: 0, col: 0, isGroup: true, color: "lightyellow" },
            // nodes, each assigned to a group/cell
            { key: "0", row: 0, col: 1, name: 'Import Specifer 1', color: "orange", size: "100 100", group: "EmpReq" },
            { key: "1", row: 0, col: 2, name: 'Import Specifer 2', color: "orange", size: "100 100", group: "EmpReq" },
            { key: "2", row: 0, col: 3, name: 'Import Specifer 3', color: "orange", size: "100 100", group: "EmpReq" },
            { key: "5", row: 1, col: 1, name: 'Import Specifer 6', color: "orange", size: "100 100", group: "EmpReq" },
            { key: "6", row: 1, col: 2, name: 'Import Specifer 7', color: "orange", size: "100 100", group: "EmpReq" },
            { key: "7", row: 1, col: 3, name: 'Import Specifer 8', color: "orange", size: "100 100", group: "EmpReq" },
            { key: "9", row: 2, col: 1, name: 'Namespace Import 1', color: "orange", size: "100 100", group: "EmpReq" },
            // { key: "l1", row: 3, col: 1, category: 'borderNode', color: "orange", group: "EmpReq", size: "1000 100", },
            { key: "10", row: 4, col: 1, name: 'Constructor', color: "orange", size: "100 100", group: "EmpReq" },
            { key: "11", row: 4, col: 2, name: 'Method Declaration', color: "orange", size: "100 100", group: "EmpReq" },
            { key: "12", row: 4, col: 3, name: 'Method Declaration', color: "orange", size: "100 100", group: "EmpReq" },
            { key: "14", row: 5, col: 1, name: 'Get Accessor', color: "orange", size: "100 100", group: "EmpReq" },
            { key: "15", row: 7, col: 1, name: 'Interface Declaration', color: "orange", size: "100 100", group: "EmpReq" },
            { key: "16", row: 8, col: 1, name: 'Enum Declaration', color: "orange", size: "100 100", group: "EmpReq" },
            { key: "17", row: 8, col: 3, name: 'Function Declaration', color: "orange", size: "100 100", group: "EmpReq" },
            { key: "18", row: 9, col: 1, name: 'Valiable Declaration', color: "orange", size: "100 100", group: "EmpReq" },
            { key: "19", row: 9, col: 2, name: 'Valiable Declaration', color: "orange", size: "100 100", group: "EmpReq" },
            { key: "20", row: 9, col: 3, name: 'Valiable Declaration', color: "orange", size: "100 100", group: "EmpReq" },
        ];

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
            // { from: '10', to: '11' },
            // { from: '20', to: '22' },
            // { from: '30', to: '33' },
            // { from: '40', to: '44' },
            // { from: '21', to: '22' },
            // { from: '31', to: '34' },
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