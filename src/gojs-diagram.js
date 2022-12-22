import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';

export default function GojsDiagram(props) {

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

        const nestedGroup = $(go.Group, "Auto",
            {
                layout: $(go.LayeredDigraphLayout,
                    { direction: 0, columnSpacing: 1, }),
                computesBoundsIncludingLinks: false,
            }, $(go.Placeholder,     // represents area for all member parts
                { background: "#e0f2f1" },
            ));

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
                            $("SubGraphExpanderButton", {
                                click: function (e, obj, prev) {  // change group's background brush
                                    // var shape = obj.part.findObject("SHAPE");
                                    const data = obj.part.data;
                                    const node = obj.part;
                                    diagram.startTransaction("updateExpansion");
                                    node.diagram.model.commit(function (m) {
                                        m.set(data, "isSubGraphExpanded", !data.isSubGraphExpanded);
                                    }, "clicked");
                                    diagram.commitTransaction("updateExpansion");
                                },
                            }),  // this Panel acts as a Button
                            $(go.TextBlock,     // group title near top, next to button
                                { font: "Bold 12pt Sans-Serif", margin: new go.Margin(0, 4) },
                                new go.Binding("text", "key", (data) => {
                                    return `Application: ${data}`
                                }))
                        ),
                        $(go.Panel, "Vertical",
                            new go.Binding("visible", "isSubGraphExpanded", (data) => {
                                return !data
                            }),
                            new go.Binding("itemArray"),
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
                                            { margin: new go.Margin(1, 2), editable: false, textAlign: "left", stroke: "#616161" },  // some room around the text
                                            new go.Binding('text', 'name').makeTwoWay()
                                        ),
                                    )
                            }
                        )

                    ),
                    $(go.Placeholder, "Auto", { padding: 8 },    // represents area for all member parts
                        { background: "#e0f2f1" },
                    )
                ),


            );

        const gridLayout = $(go.Group, "Auto",
            {
                layout: $(go.GridLayout,
                    {
                        wrappingColumn: NaN,
                        wrappingWidth: NaN
                    }),
                padding: new go.Margin(5) // to see the names of shapes on the bottom row
            },

            new go.Binding("isSubGraphExpanded", "isSubGraphExpanded"),
            $(go.Shape, "RoundedRectangle", { parameter1: 2, fill: "#e91e63", stroke: "#00897b" }),
            $(go.Panel, 'Vertical', { padding: 1, },
                $(go.Panel, "Horizontal",  // the header
                    { defaultAlignment: go.Spot.Top, padding: new go.Margin(8, 4) },
                    $("SubGraphExpanderButton"),  // this Panel acts as a Button
                    $(go.TextBlock,     // group title near top, next to button
                        { font: "Bold 12pt Sans-Serif", margin: new go.Margin(0, 4) },
                        new go.Binding("text", "key", (data) => {
                            return `Grid: ${data}`
                        })),
                ),
                new go.Binding("row"),
                new go.Binding("column", 'col'),
                // the group is normally unseen -- it is completely transparent except when given a color or when highlighted
                $(go.Placeholder, { padding: 8 },
                    { background: "#e0f2f1" },)
            ));


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
        groupTemplateMap.add("gridLayout", gridLayout);
        groupTemplateMap.add("nestedGroup", nestedGroup);
        groupTemplateMap.add("", veriticalGroupLayout);


        const nodeTemplateMap = new go.Map(); // In TypeScript you could write: new go.Map<string, go.Node>();
        nodeTemplateMap.add("", defaultNode);
        nodeTemplateMap.add("borderNode", borderNode);

        diagram.startTransaction("generateNode");

        diagram.groupTemplateMap = groupTemplateMap;
        diagram.nodeTemplateMap = nodeTemplateMap;
        diagram.model.nodeDataArray = createNode();
        diagram.model.linkDataArray = createLink();

        diagram.commitTransaction("generateNode");

        // diagram.addModelChangedListener(function(e) {
        //     // ignore unimportant Transaction events
        //     if (!e.isTransactionFinished) return;
        //     console.log(e.isTransactionFinished);
        //     var json = e.model.nodeDataArray;
        //     var data = e.model.linkDataArray;
        //     console.log("JSON: ",json,"Data: ",data);

        //   });

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
        const arr = [
            //application layer
            {
                key: 'APP_1', isGroup: true,
                category: "veriticalLayout",
                isSubGraphExpanded: false,
                color: 'lightblue', itemArray: [
                    { key: 11, name: "App 1 CategoryName", iskey: true, color: 'blue' },
                    { key: 11, name: "App 1 CategoryID", iskey: true, color: 'red' },
                ]
            },
            {
                key: 'APP_2', isGroup: true,
                category: "veriticalLayout",
                isSubGraphExpanded: false,
                color: 'lightblue', itemArray: [
                    { key: 21, name: "App2 CategoryName", iskey: true, color: 'blue' },
                    { key: 21, name: "App2 CategoryID", iskey: true, color: 'red' },
                ]
            },
            {
                key: 'APP_3', isGroup: true,
                category: "veriticalLayout",
                isSubGraphExpanded: false,
                color: 'lightblue', itemArray: [
                    { key: 31, name: "App3 CategoryName", iskey: true, color: 'blue' },
                    { key: 31, name: "App3 CategoryID", iskey: true, color: 'red' },
                ]
            },
            {
                key: 'APP_4', isGroup: true,
                category: "veriticalLayout",
                isSubGraphExpanded: false,
                color: 'lightblue', itemArray: [
                    { key: 41, name: "App4 CategoryName", iskey: true, color: 'blue' },
                    { key: 41, name: "App4 CategoryID", iskey: true, color: 'red' },
                ]
            },
            {
                key: 'APP_5', isGroup: true,
                category: "veriticalLayout",
                isSubGraphExpanded: false,
                color: 'lightblue', itemArray: [
                    { key: 21, name: "App2 CategoryName", iskey: true, color: 'blue' },
                    { key: 21, name: "App2 CategoryID", iskey: true, color: 'red' },
                ]
            },
            //application layer ends here
           
            //Grid layer app 1
            { key: "Grid layer", row: 0, col: 0, isGroup: true, color: "lightyellow", category: 'gridLayout', isSubGraphExpanded: false, group: "APP_1" },
            { key: 1000, category: 'defaultNode', row: 0, col: 1, name: 'Import Specifer 1', color: "orange", size: "100 100", group: "Grid layer" },
            { key: 1001, category: 'defaultNode', row: 0, col: 2, name: 'Import Specifer 2', color: "orange", size: "100 100", group: "Grid layer" },
            { key: 1002, category: 'defaultNode', row: 0, col: 3, name: 'Import Specifer 3', color: "orange", size: "100 100", group: "Grid layer" },
            { key: 1003, category: 'defaultNode', row: 1, col: 1, name: 'Import Specifer 6', color: "orange", size: "100 100", group: "Grid layer" },
            { key: 1004, row: 1, col: 2, name: 'Import Specifer 7', color: "orange", size: "100 100", group: "Grid layer" },
            { key: 1005, row: 1, col: 3, name: 'Import Specifer 8', color: "orange", size: "100 100", group: "Grid layer" },
            { key: 1006, row: 2, col: 1, name: 'Namespace Import 1', color: "orange", size: "100 100", group: "Grid layer" },


            //Grid layer app 2
            { key: "Grid layer 2", row: 0, col: 0, isGroup: true, color: "lightyellow", category: 'gridLayout', isSubGraphExpanded: false, group: "APP_2" },
            { key: 2000, row: 4, col: 1, name: 'Constructor', color: "orange", size: "100 100", group: "Grid layer 2" },
            { key: 2001, row: 4, col: 2, name: 'Method Declaration', color: "orange", size: "100 100", group: "Grid layer 2" },
            { key: 2002, row: 4, col: 3, name: 'Method Declaration', color: "orange", size: "100 100", group: "Grid layer 2" },
            { key: 2003, row: 5, col: 1, name: 'Get Accessor', color: "orange", size: "100 100", group: "Grid layer 2" },
            { key: 2004, row: 7, col: 1, name: 'Interface Declaration', color: "orange", size: "100 100", group: "Grid layer 2" },
            { key: 2005, row: 8, col: 1, name: 'Enum Declaration', color: "orange", size: "100 100", group: "Grid layer 2" },
            { key: 2006, row: 8, col: 3, name: 'Function Declaration', color: "orange", size: "100 100", group: "Grid layer 2" },
            { key: 2007, row: 9, col: 1, name: 'Valiable Declaration', color: "orange", size: "100 100", group: "Grid layer 2" },
            { key: 2008, row: 9, col: 2, name: 'Valiable Declaration', color: "orange", size: "100 100", group: "Grid layer 2" },
            { key: 2009, row: 9, col: 3, name: 'Valiable Declaration', color: "orange", size: "100 100", group: "Grid layer 2" },


        ];




        // const gridData = [
        //     { key: "EmpReq", row: 0, col: 0, isGroup: true, color: "lightyellow", category: 'gridLayout', isSubGraphExpanded: false, group: "11230" },
        //     { key: "0", category: 'defaultNode', row: 0, col: 1, name: 'Import Specifer 1', color: "orange", size: "100 100", group: "EmpReq" },
        //     { key: "1", category: 'defaultNode', row: 0, col: 2, name: 'Import Specifer 2', color: "orange", size: "100 100", group: "EmpReq" },
        //     { key: "2", category: 'defaultNode', row: 0, col: 3, name: 'Import Specifer 3', color: "orange", size: "100 100", group: "EmpReq" },
        //     { key: "5", category: 'defaultNode', row: 1, col: 1, name: 'Import Specifer 6', color: "orange", size: "100 100", group: "EmpReq" },
        //     { key: "6", row: 1, col: 2, name: 'Import Specifer 7', color: "orange", size: "100 100", group: "EmpReq" },
        //     { key: "7", row: 1, col: 3, name: 'Import Specifer 8', color: "orange", size: "100 100", group: "EmpReq" },
        //     { key: "9", row: 2, col: 1, name: 'Namespace Import 1', color: "orange", size: "100 100", group: "EmpReq" },
        // ];
        // const gridData2 = [
        //     { key: "New group 2", row: 0, col: 0, isGroup: true, color: "lightyellow", category: 'gridLayout', isSubGraphExpanded: false, group: "11230" },
        //     { key: "10", row: 4, col: 1, name: 'Constructor', color: "orange", size: "100 100", group: "New group 2" },
        //     { key: "11", row: 4, col: 2, name: 'Method Declaration', color: "orange", size: "100 100", group: "New group 2" },
        //     { key: "12", row: 4, col: 3, name: 'Method Declaration', color: "orange", size: "100 100", group: "New group 2" },
        //     { key: "14", row: 5, col: 1, name: 'Get Accessor', color: "orange", size: "100 100", group: "New group 2" },
        //     { key: "15", row: 7, col: 1, name: 'Interface Declaration', color: "orange", size: "100 100", group: "New group 2" },
        //     { key: "16", row: 8, col: 1, name: 'Enum Declaration', color: "orange", size: "100 100", group: "New group 2" },
        //     { key: "17", row: 8, col: 3, name: 'Function Declaration', color: "orange", size: "100 100", group: "New group 2" },
        //     { key: "18", row: 9, col: 1, name: 'Valiable Declaration', color: "orange", size: "100 100", group: "New group 2" },
        //     { key: "19", row: 9, col: 2, name: 'Valiable Declaration', color: "orange", size: "100 100", group: "New group 2" },
        //     { key: "20", row: 9, col: 3, name: 'Valiable Declaration', color: "orange", size: "100 100", group: "New group 2" },
        // ];
        // const defaultArr = [
        //     {
        //         key: '1123', isGroup: true,
        //         category: "veriticalLayout",
        //         isSubGraphExpanded: false,
        //         color: 'lightblue', itemArray: [
        //             { key: 12, name: "CategoryName", iskey: true, color: 'blue' },
        //             { key: 11, name: "CategoryID", iskey: true, color: 'red' },
        //             // { key: 13, name: "Description", iskey: false, color: 'blue' },
        //             // { key: 14, name: "Picture", iskey: false, color: 'pink' }
        //         ]
        //     },
        // ];

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

        // arr.push(...gridData, {
        //     key: 'internal', isGroup: true,
        //     category: "veriticalLayout",
        //     group: "11230",
        //     isSubGraphExpanded: false,
        //     color: 'lightblue', itemArray: [
        //         { key: 3313, name: "Description", iskey: false, color: 'blue' },
        //         { key: 222414, name: "Picture", iskey: false, color: 'pink' }
        //     ]
        // }, ...gridData2);

        return arr;

    }
    function createLink() {
        let arr = [
            { from: '9', to: '14' },
            { from: '7', to: '16' },
            { from: '3313', to: '9' },
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