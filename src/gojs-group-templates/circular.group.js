import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';

export default function CircularLayout(props) {

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
            $(go.Node, 'Auto',  // the Shape will go around the TextBlock
                new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Shape, 'RoundedRectangle',
                    { name: 'SHAPE', fill: 'white', strokeWidth: 0 },
                    // Shape.fill is bound to Node.data.color
                    new go.Binding('fill', 'color')),
                $(go.TextBlock,
                    { margin: 8, editable: true },  // some room around the text
                    new go.Binding('text').makeTwoWay()
                )
            );


        const veriticalGroupLayout =
            $(go.Group, "Auto",
                {
                    layout: $(go.LayeredDigraphLayout,
                        { direction: 0, columnSpacing: 1, }),
                    computesBoundsIncludingLinks: false,
                },
                new go.Binding("isSubGraphExpanded", "isSubGraphExpanded"),
                $(go.Shape, "RoundedRectangle", { parameter1: 2, fill: "#009688", stroke: "#00897b" }),
                $(go.Panel, 'Vertical', { padding: 1, },
                    $(go.Panel, "Vertical",  // position header above the subgraph
                        { defaultAlignment: go.Spot.Left, stretch: go.GraphObject.Fill, },
                        $(go.Panel, "Horizontal",  // the header
                            { defaultAlignment: go.Spot.Top, padding: new go.Margin(8, 4) },
                            $("SubGraphExpanderButton"),  // this Panel acts as a Button
                            $(go.TextBlock,     // group title near top, next to button
                                { font: "Bold 12pt Sans-Serif", margin: new go.Margin(0, 4) },
                                new go.Binding("text", "key", (data) => {
                                    return `Application: ${data}`
                                }))
                        ),
                        $(go.Panel, "Vertical", new go.Binding("itemArray"),
                            {
                                stretch: go.GraphObject.Fill,
                                background: '#e0f2f1',
                                itemTemplate:
                                    $(go.Panel, 'Auto',  // the Shape will go around the TextBlock
                                        {
                                            alignment: go.Spot.Left,
                                            margin: new go.Margin(4),
                                            stretch: go.GraphObject.Fill,
                                        },
                                        // new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
                                        $(go.Shape, 'RoundedRectangle',
                                            { fill: 'white', strokeWidth: 0 },
                                            // Shape.fill is bound to Node.data.color
                                        ),
                                        $(go.TextBlock,
                                            { margin: new go.Margin(1,2), editable: false,textAlign: "left",stroke:"#616161"  },  // some room around the text
                                            new go.Binding('text', 'name').makeTwoWay()
                                        ),
                                    )
                            }
                        ),
                        $(go.Placeholder,     // represents area for all member parts
                            { background: "#e0f2f1" },
                        )
                    ),

                )

            );


        diagram.linkTemplate =
            $(go.Link,
                { routing: go.Link.AvoidsNodes },  // link route should avoid nodes
                $(go.Shape,   // the "from" end arrowhead
                    { fromArrow: "Standard", fill: "red" }),
                $(go.Shape,   // the "to" end arrowhead
                    { toArrow: "Standard" })
            );

        var groupTemplateMap = new go.Map(); // In TypeScript you could write: new go.Map<string, go.Node>();
        groupTemplateMap.add("veriticalLayout", veriticalGroupLayout);
        groupTemplateMap.add("", veriticalGroupLayout);

        diagram.startTransaction("generateCircle");

        diagram.groupTemplateMap = groupTemplateMap;
        diagram.model.nodeDataArray = createNode();
        diagram.model.linkDataArray = createLink();

        diagram.nodeTemplate = new go.Node('Auto',
            $(go.Part, "Auto",
                { stretch: go.GraphObject.Fill, padding: 2 },
                {
                    fromSpot: go.Spot.Right,  // coming out from middle-right
                    toSpot: go.Spot.Left
                },   // going into middle-left
                $(go.Shape, "RoundedRectangle", { parameter1: 2, fill: "#fff", stroke: "#009688" }),
                $(go.TextBlock, new go.Binding("text", "name"),
                    {
                        stretch: go.GraphObject.Fill,
                        //  height: 24,
                        width: 150,
                        //  maxWidth:50,
                        verticalAlignment: go.Spot.Center,
                        font: '14pt sans-serif', stroke: "#424242"
                    })
            )
        );

        diagram.commitTransaction("generateCircle");

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
            {
                key: 0, isGroup: true, category: "veriticalLayout",
                color: 'lightblue', itemArray: [
                    { key: 12, name: "CategoryName", iskey: true, color: 'blue' },
                    { key: 11, name: "CategoryID", iskey: true, color: 'red' },
                    // { key: 13, name: "Description", iskey: false, color: 'blue' },
                    // { key: 14, name: "Picture", iskey: false, color: 'pink' }
                ]
            },
            // { group: 0, key: 1, name: "CategoryID", iskey: true, color: 'blue' },
            // { group: 0, key: 2, name: "CategoryName", iskey: false, color: 'blue' },
            // { group: 0, key: 3, name: "Description", iskey: false, color: 'blue' },
            // { group: 0, key: 4, name: "Picture", iskey: false, color: 'pink' },
        ];

        for (let i = 0; i < 5; i++) {
            const newArr = JSON.parse(JSON.stringify(defaultArr));
            newArr.forEach(data => {
                data.key = data.key + '' + i;
                if (data.hasOwnProperty('group')) {
                    data.group = data.group + '' + i
                }
                arr.push(data);
            })
        }

        return arr;

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