(function() {
    let _shadowRoot;
    let _id;

    let div;
    let widgetName;
    var Ar = [];

    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
    <style>
    </style>      
    `;

    class MockUpNetworkGraph extends HTMLElement {

        constructor() {
            super();

            _shadowRoot = this.attachShadow({
                mode: "open"
            });
            _shadowRoot.appendChild(tmpl.content.cloneNode(true));

            _id = createGuid();

            //_shadowRoot.querySelector("#oView").id = "oView";

            this._export_settings = {};
            this._export_settings.title = "";
            this._export_settings.subtitle = "";
            this._export_settings.icon = "";
            this._export_settings.unit = "";
            this._export_settings.footer = "";

            this.addEventListener("click", event => {
                console.log('click');

            });

            this._firstConnection = 0;
            this.data = [];
            this.oModel = null;
            this.sSelDisplayOption = "Upstream";
        }

        //Get Table Data into Custom Widget Function
        async setDataSource(source) { 
            let Machines = []; // contains names of existing machines
            let t_source = []; // contains the transformed xml-structure

            source = Array(74);
            // get all machines -> Machines contains all existing machines
            for(i = 0; i < source.length; i++){
                Machines.push({Machine: source[i].Quelle_.id.replace(" ", "-")})
            }

            // transform source xml into a less complex structure 
            for(i = 0; i < source.length; i++){
                for(j = 0; j < Machines.length; j++){
                    if(Machines[j].Machine in source[i]){
                        if(Machines[j].Machine[1] !== undefined){
                            if(source[i][Machines[j].Machine].id !== "@NullMember" && source[i][Machines[j].Machine].id !== ""){
                                t_source.push( {
                                    Parent_Machine: source[i].Quelle_.id,
                                    X: source[i].X.id,
                                    Y: source[i].Y.id,
                                    ID: source[i][Machines[j].Machine].id,
                                    Children_Machine: Machines[j].Machine
                                }
                                )
                            }
                        }
                    }
                }
                
            }
            console.log(t_source)
            setCoordinates(t_source,source);
        }

        connectedCallback() {

            loadthis(this);
            try {
                if (window.commonApp) {
                    let outlineContainer = commonApp.getShell().findElements(true, ele => ele.hasStyleClass && ele.hasStyleClass("sapAppBuildingOutline"))[0]; // sId: "__container0"

                    if (outlineContainer && outlineContainer.getReactProps) {
                        let parseReactState = state => {
                            let components = {};

                            let globalState = state.globalState;
                            let instances = globalState.instances;
                            let app = instances.app["[{\"app\":\"MAIN_APPLICATION\"}]"];
                            let names = app.names;

                            for (let key in names) {
                                let name = names[key];

                                let obj = JSON.parse(key).pop();
                                let type = Object.keys(obj)[0];
                                let id = obj[type];

                                components[id] = {
                                    type: type,
                                    name: name
                                };
                            }

                            for (let componentId in components) {
                                let component = components[componentId];
                            }

                            let metadata = JSON.stringify({
                                components: components,
                                vars: app.globalVars
                            });

                            if (metadata != this.metadata) {
                                this.metadata = metadata;

                                this.dispatchEvent(new CustomEvent("propertiesChanged", {
                                    detail: {
                                        properties: {
                                            metadata: metadata
                                        }
                                    }
                                }));
                            }
                        };

                        let subscribeReactStore = store => {
                            this._subscription = store.subscribe({
                                effect: state => {
                                    parseReactState(state);
                                    return {
                                        result: 1
                                    };
                                }
                            });
                        };

                        let props = outlineContainer.getReactProps();
                        if (props) {
                            subscribeReactStore(props.store);
                        } else {
                            let oldRenderReactComponent = outlineContainer.renderReactComponent;
                            outlineContainer.renderReactComponent = e => {
                                let props = outlineContainer.getReactProps();
                                subscribeReactStore(props.store);

                                oldRenderReactComponent.call(outlineContainer, e);
                            }
                        }
                    }
                }
            } catch (e) {}
        }

        disconnectedCallback() {
            if (this._subscription) { // react store subscription
                this._subscription();
                this._subscription = null;
            }
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            if ("designMode" in changedProperties) {
                this._designMode = changedProperties["designMode"];
            }
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            console.log(changedProperties);
            var that = this;
            //loadthis(that);
        }

        _renderExportButton() {
            let components = this.metadata ? JSON.parse(this.metadata)["components"] : {};
            console.log("_renderExportButton-components");
            console.log(components);
            console.log("end");
        }

        _firePropertiesChanged() {
            this.title = "FD";
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        title: this.title
                    }
                }
            }));
        }

        // SETTINGS
        get title() {
            return this._export_settings.title;
        }
        set title(value) {
            console.log("setTitle:" + value);
            this._export_settings.title = value;
        }

        get subtitle() {
            return this._export_settings.subtitle;
        }
        set subtitle(value) {
            this._export_settings.subtitle = value;
        }

        get icon() {
            return this._export_settings.icon;
        }
        set icon(value) {
            this._export_settings.icon = value;
        }

        get unit() {
            return this._export_settings.unit;
        }
        set unit(value) {
            this._export_settings.unit = value;
        }

        get footer() {
            return this._export_settings.footer;
        }
        set footer(value) {
            this._export_settings.footer = value;
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue != newValue) {
                this[name] = newValue;
            }
        }

    }
    customElements.define("sac-mock-network-graph", MockUpNetworkGraph);

   

    // fix variables that have to be declared in the beginning
    // size of the space between the machine nodes
    const nodeWidth = 350;
    const nodeHeight = 250;
    // fix position of "Entlader"
    let xEntladerPosition = 1400;
    let yEntladerPosition = 1500;
    // direction changes in the graph (in this case of the main line)
    let directionChange = ['Waschmaschine', 'Etikettiermaschine']
    let startPoints = ['Entlader'];
    
    
    //////////////////////////////////////////////////////// MAIN FUNCTION ///////////////////////////////////////////////////////////////////////////////////////////////
    // contains functions, that calculates the coordinates and connections for each machine in the input data (input: xml data)
    function setCoordinates(t_source, source){
        // write fix Entlader Positions into t_source as a base machine
        for (let i = 0; i < t_source.length; i++) {
            if (t_source[i].Parent_Machine === 'Entlader'){
                t_source[i].X = xEntladerPosition;
                t_source[i].Y = yEntladerPosition;
            }
            else {
                t_source[i].X = 0;
                t_source[i].Y = 0;
            }

        }
        // get only fix machines in string format -> doppelte maschinen in liste (['Entlader', 'Entlader', 'Auspacker', 'Auspacker', 'Waschmaschine', 'F�ller', 'F�ller', 'Etikettiermaschine', 'Varioline', 'Belader_rechts'])
        let fixmachinesstring = [];
        for (let i = 0; i < t_source.length; i++) {
            if (t_source[i].Fix_Machines != '@NullMember') {
                fixmachinesstring.push(t_source[i].Parent_Machine);
            }
        }
        // get all existing machines in string format -> ['Abschieber', 'Linatronic', 'Belader_links', 'Gebindewascher', 'Abschrauber', 'TBB_EG01', 'TBB_EG02', 'TBB_EG02', 'TBB_EG03', 'TBB_EG04', 'TBB_EG05', 'TBB_EG06', 'TBB_EG07', 'TBB_EG07', 'TBB_EG07', 'TBB_EG07', 'TBB_EG11', 'TBB_EG12', 'TBB_EG12', 'TBB_EG14', 'TBB_EG15', 'TBB_EG16', 'TBB_EG17', 'TBB_EG18', 'TBB_EG21', 'TBB_EG22', 'TBB_EG22', 'TBB_EG24', 'TBB_EG26', 'TBG_EG01', 'TBG_EG02', 'TBG_EG05', 'TBG_EG05', 'TBG_EG06', 'TBG_EG07', 'TBG_EG08', 'TBG_EG09', 'TBG_EG09', 'TBG_EG10', 'TBG_EG12', 'TBG_EG15', 'TBP1_EG02', 'TBP1_EG03', 'TBP1_EG04', 'TBP1_EG05', 'TBP1_EG07', 'Extern_Aufgabe_PAL', 'TBG_EG04', 'Entlader', 'Entlader', 'Auspacker', 'Auspacker', 'Waschmaschine', 'F�ller', 'F�ller', 'Etikettiermaschine', 'Varioline', 'Belader_rechts', 'TBP1_EG08', 'TBB_EG23', 'TBP1_EG01', 'TBG_EG11', 'TBP1_EG06', 'TBP1_EG06', 'TBG_EG13', 'TBG_EG03', 'TBB_EG13', 'EXTERN01']
        let allmachinesstring = [];
        for (let i=0; i < t_source.length; i++){
            allmachinesstring.push(t_source[i].Parent_Machine);
        }
        // get all existing connection values
        let allconnectionvalues = [];
        let allconnectionvalues_a = [];
        for (let i=0; i<t_source.length; i++){
            allconnectionvalues_a.push(t_source[i].ID);   // ['3', '1', '1', '2', '4', '1', '1', '10', '1', '3', '1', '1', '20', '20', '20', '1', '10', '1', '4', '4', '1', '1', '1', '1', '1', '10', '1', '1', '1', '1', '1', '2', '3', '2', '1', '3', '1', '4', '1', '4', '2', '2', '2', '2', '2', '1', '1', '2', '1', '2', '1', '2', '1', '20', '1', '1', '1', '1', '101', '1', '1', '1', '2', '2', '4', '1', '4', '3']
        }
        for (let j=0; j<allconnectionvalues_a.length; j++){
            for (let a=0; a<allconnectionvalues.length; a++){
                if(allconnectionvalues_a[j] != allconnectionvalues[a]){
                    allconnectionvalues.push(allconnectionvalues_a[j]);
                }
            }
            }
        console.log(allconnectionvalues); // ['3', '1', '1', '2', '4', '1', '1', '10', '1', '3', '1', '1', '20', '20', '20', '1', '10', '1', '4', '4', '1', '1', '1', '1', '1', '10', '1', '1', '1', '1', '1', '2', '3', '2', '1', '3', '1', '4', '1', '4', '2', '2', '2', '2', '2', '1', '1', '2', '1', '2', '1', '2', '1', '20', '1', '1', '1', '1', '101', '1', '1', '1', '2', '2', '4', '1', '4', '3']
        // fehler: hier aktuell []
    

        /*function, that calculates the position dependencies from fix machines and sets their coordinates based on that
        function calculatedependencies(t_source) {
            for (let i = 0; i < t_source.length; i++) {
                // iterates through the fix machines from column Fixe_Maschinen
                for (let a=0; a<fixmachinesstring.length; a++){
                    // calculates dependencies to the fix machines in the columns X and Y
                    if (fixmachinesstring[a] == t_source[i].X){ //contains ist ein problem
                        for (let j=0; allmachinesstring.length; j++){
                            // find the position/ row of the fix machine in t_source
                            if (fixmachinesstring[a] == allmachinesstring[j]){
                                t_source[i].X = t_source[j].X;
                            }
                        }
                    }
                    if (fixmachinesstring[a] == t_source[i].Y){
                        for (let j=0; allmachinesstring.length; j++){
                            // find the position/ row of the fix machine in t_source
                            if (fixmachinesstring[a] == allmachinesstring[j]){
                                t_source[i].Y = t_source[j].Y;
                            }
                        }
                    }

                } 
            }
        }
        calculatedependencies(t_source); */

        // calculates all paths in the graph regarding their value/priority (path priority must be given as an input and as a string in the format: 'number')
        /*function findPaths(t_source, priority){
            // calculates the row of the start machine, from where the paths start
            // path1 contains all connections with value 1 -> Hauptlinie
            let path = [];
            // calculate all other machines with the same priority
            for (let j=0; j<t_source.length; j++){
                if (t_source[j].ID  === priority){
                    if(t_source[j].Parent_Machine === 'Entlader'){
                        path.push(t_source[j].Parent_Machine);
                        //startMachine = t_source[j].Children_Machine;
                    }
                    for (a=0; a<path.length;a++){
                        if(t_source[j].Parent_Machine === path[a]){
                            path.push(t_source[j].Children_Machine);
                    }
                }
                }
            }
            return path;
        } */

        function calcStart(priority){
            for (let i=0; i<t_source.length; i++){
                if (t_source[i].ID === priority){
                    if (t_source[i].Parent_Machine === 'Entlader'){
                        startMachine = t_source[i];
                    }
                }
            }
            return startMachine;
        }

        function findPaths(t_source, priority){
            let path = [];
            let startMachine = '';
            // define "Entlader" as the start Position for the path
            let start;
            start = calcStart('1');
            console.log(start);
            for (let j=0; j<t_source.length; j++){
                if (t_source[j].ID  === priority){
                    if(t_source[j].Parent_Machine = start.Children_Machine){
                        path.push(t_source[j].Parent_Machine)
                        startMachine = t_source[i]
                    }
                }
            }
        
            return path;
        }
        


        // function that calculates paths for each connection value (1,2,3,...) -> start findPaths()
        // hier ist noch etwas manueller workaround
        // red 
        let path1 = findPaths(t_source, '1');
        // cut the path in direction changes
        let path1_hor_r = path1.slice(0, (path1.indexOf(directionChange[0])+1));
        console.log(path1_hor_r);
        let path1_senkr_u = path1.slice((path1.indexOf(directionChange[0])), (path1.indexOf(directionChange[1]) + 1));
        let path1_hor_l = path1.slice((path1.indexOf(directionChange[1])),( path1.length));
        // yellow
        let path2 = [];
        //path2 = findPaths(t_source, '2');
        //console.log(path2);
        // rest
        let path3 = [];
        //path3 = findPaths(t_source, '3');
        let path4 = [];
        //path4 = findPaths(t_source, '4');
        let path10 = [];
        //path10 = findPaths(t_source, '10');
        let path20 = [];
        //path20 = findPaths(t_source, '20');
        let path101 = [];
        //path101 = findPaths(t_source, '101');


        // functions that calculate the coordinates for each direction
        function calcpositionshor_r (path, t_source, nodeWidth, priority){
            let firstMachineSource = [];
            let firstMachineX = [];
            let firstMachineY = []
            for (let i=0; i<path.length; i++){
                let xOffset = i * nodeWidth;
                let yOffset = 0;
                let firstMachine = path[i];
                for(let j=0; j<t_source.length; j++){
                    if ((t_source[j].Parent_Machine === firstMachine) && (t_source[j].ID === priority)){
                        firstMachineSource = t_source[j];
                        firstMachineX = firstMachineSource.X;
                        firstMachineY = firstMachineSource.Y;
                    }
                }
                for (let a=0; a<t_source.length; a++){
                    if ((t_source[a].Parent_Machine === firstMachine) && (t_source[a].ID === priority)){
                        let currentMachine = t_source[a];
                        currentMachine.X = firstMachineX + xOffset;
                        currentMachine.Y = firstMachineY + yOffset;
                    }
                }

                }
            }
          
          function calcpositionshor_l (path,t_source, nodeWidth, priority){
            let firstMachineSource = [];
            let firstMachineX = [];
            let firstMachineY = []
            for (let i=0; i<path.length; i++){
                let xOffset = i * nodeWidth;
                let firstMachine = path[i];
                for(let j=0; j<t_source.length; j++){
                    if ((t_source[j].Parent_Machine === firstMachine) && (t_source[j].ID === priority)){
                        firstMachineSource = t_source[j];
                        firstMachineX = firstMachineSource.X;
                        firstMachineY = firstMachineSource.Y;
                    }
                }
                for (let a=0; a<t_source.length; a++){
                    if ((t_source[a].Parent_Machine === firstMachine) && (t_source[a].ID === priority)){
                        let currentMachine = t_source[a];
                        currentMachine.X = firstMachineX - xOffset;
                        currentMachine.Y = firstMachineY;
                    }
                }

                }
            
          }
          
          function calcpositionssenkr_u(path,t_source, nodeHeight, priority) {
            let firstMachineSource = [];
            let firstMachineX = [];
            let firstMachineY = []
            for (let i=0; i<path.length; i++){
                let yOffset = i * nodeHeight;
                let firstMachine = path[i];
                for(let j=0; j<t_source.length; j++){
                    if ((t_source[j].Parent_Machine === firstMachine) && (t_source[j].ID === priority)){
                        firstMachineSource = t_source[j];
                        firstMachineX = firstMachineSource.X;
                        firstMachineY = firstMachineSource.Y;
                    }
                }
                for (let a=0; a<t_source.length; a++){
                    if ((t_source[a].Parent_Machine === firstMachine) && (t_source[a].ID === priority)){
                        let currentMachine = t_source[a];
                        currentMachine.X = firstMachineX;
                        currentMachine.Y = firstMachineY - yOffset;
                    }
                }

                }

            }
          
          function calcpositionssenkr_o (path,t_source, nodeHeight,priority){
            let firstMachineSource = [];
            let firstMachineX = [];
            let firstMachineY = []
            for (let i=0; i<path.length; i++){
                let yOffset = i * nodeHeight;
                let firstMachine = path[i];
                for(let j=0; j<t_source.length; j++){
                    if ((t_source[j].Parent_Machine === firstMachine) && (t_source[j].ID === priority)){
                        firstMachineSource = t_source[j];
                        firstMachineX = firstMachineSource.X;
                        firstMachineY = firstMachineSource.Y;
                    }
                }
                for (let a=0; a<t_source.length; a++){
                    if ((t_source[a].Parent_Machine === firstMachine) && (t_source[a].ID === priority)){
                        let currentMachine = t_source[a];
                        currentMachine.X = firstMachineX;
                        currentMachine.Y = firstMachineY + yOffset;
                    }
                }

                }
           
          }

        // calculates all paths and the positions of all machines
        // 1
        calcpositionshor_r(path1_hor_r, t_source, nodeWidth, '1');
        console.log(path1_hor_r); // ['TBG_EG01', 'TBB_EG19', 'TBP1_EG07', 'TBB_EG02', 'TBB_EG03', 'TBB_EG05', 'TBB_EG06', 'TBB_EG07', 'TBB_EG12', 'TBB_EG15', 'TBB_EG16', 'Waschmaschine']
        //calcpositionssenkr_u(path1_senkr_u, t_source, nodeHeight,'1');
        //calcpositionshor_l (path1_hor_l,t_source,nodeWidth,'1');
        // 2
        //calcpositionssenkr_u(path2,t_source,nodeHeight);
        // others...
        }
        





          // function that transform p_source data into input format for graph 
                 

    
    // UTILS
    function loadthis(that) {
        that.data = [{
            "nodes": [
                {
                    "key": 0,
                    "title": "Stretch Blow Molder",
                    "status": "Success",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "92,59%"
                        }
                    ]
                },{
                    "key": 1,
                    "title": "Filler",
                    "status": "Warning",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "81,81%"
                        }
                    ]
                },{
                    "key": 2,
                    "title": "Labeller",
                    "status": "Error",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "59,06%"
                        }
                    ]
                },{
                    "key": 3,
                    "title": "Non-returnable Packer",
                    "status": "Success",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "92,39%"
                        }
                    ]
                },{
                    "key": 4,
                    "title": "Palettizer",
                    "status": "Success",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "94,14%"
                        }
                    ]
                },
            ],
            "lines": [
                {"from": 0, "to": 1},
                {"from": 1, "to": 2},
                {"from": 2, "to": 3},
                {"from": 3, "to": 4}
            ]
        }];
        var that_ = that;

        widgetName = "mockNetworkGraph_1";
        console.log("widgetName:" + widgetName);
        if (typeof widgetName === "undefined") {
            widgetName = that._export_settings.title.split("|")[0];
            console.log("widgetName_:" + widgetName);
        }

        div = document.createElement('div');
        div.slot = "content_" + widgetName;
            console.log("--First Time --");
        
            let div0 = document.createElement('div');
            div0.innerHTML = '<?xml version="1.0"?><script id="oView_UpStream' + widgetName + '" name="oView_' + widgetName + '" type="sapui5/xmlview"><mvc:View controllerName="myView.Template" xmlns="sap.suite.ui.commons.networkgraph" xmlns:layout="sap.suite.ui.commons.networkgraph.layout" xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns:l="sap.ui.layout"><l:FixFlex><l:fixContent><m:FlexBox fitContainer="true" renderType="Bare" wrap="Wrap"><m:items><Graph  enableWheelZoom="true"  nodes="{' + widgetName + '>/nodes}" lines="{' + widgetName + '>/lines}" groups="{' + widgetName + '>/groups}" id="graph_' + widgetName + '" orientation="LeftRight"> <layoutData> <m:FlexItemData/> </layoutData> <layoutAlgorithm> <layout:LayeredLayout mergeEdges="{settings>mergeEdges}" nodePlacement="{settings>nodePlacement}" nodeSpacing="{settings>nodeSpacing}" lineSpacingFactor="{settings>lineSpacingFactor}"> </layout:LayeredLayout> </layoutAlgorithm> <statuses><Status key="CustomKrones" title="Standard" backgroundColor="#0060AD" borderColor="sapUiContentShadowColor" hoverBorderColor="sapUiContentShadowColor"/></statuses> <nodes> <Node key="{' + widgetName +'>key}"  title="{' + widgetName + '>title}" icon="{' + widgetName + '>icon}" group="{' + widgetName + '>group}" attributes="{' + widgetName + '>attributes}"  shape="Box" status="{'+ widgetName + '>status}" x="{' + widgetName + '>x}"  y="{' + widgetName + '>y}" showDetailButton="false" width="auto" maxWidth="500"> <attributes> <ElementAttribute label="{' + widgetName + '>label}" value="{' + widgetName + '>value}"/> </attributes> </Node> </nodes> <lines> <Line from="{' + widgetName + '>from}" to="{' + widgetName + '>to}" status="{' + widgetName + '>status}" arrowOrientation="ParentOf" arrowPosition="Middle" press="linePress"></Line> </lines> <groups> <Group key="{' + widgetName + '>key}" title="{' + widgetName + '>title}"></Group> </groups> </Graph></m:items></m:FlexBox></l:fixContent></l:FixFlex> </mvc:View></script>';


            if(that._firstConnection === 1){
                _shadowRoot.removeChild(_shadowRoot.lastChild);
                _shadowRoot.removeChild(_shadowRoot.lastChild);
                _shadowRoot.appendChild(div0);
            }else{
                _shadowRoot.appendChild(div0);
            }

            let div1 = document.createElement('div');
            div1.innerHTML = '<div id="ui5_content_' + widgetName + '" name="ui5_content_' + widgetName + '"><slot name="content_' + widgetName + '"></slot></div>';

            _shadowRoot.appendChild(div1);

            if(that_.childElementCount > 0){
                that_.removeChild(that_.firstChild);
            }

            that_.appendChild(div);

            var mapcanvas_divstr = _shadowRoot.getElementById('oView_UpStream' + widgetName);

            Ar = [];
            Ar.push({
                'id': widgetName,
                'div': mapcanvas_divstr
            });
            console.log(Ar);
        //that_._renderExportButton();

        sap.ui.getCore().attachInit(function() {
            "use strict";

            //### Controller ###
            sap.ui.define([
                "sap/ui/core/mvc/Controller",
                "sap/ui/model/json/JSONModel",
                "sap/m/Popover"
            ], function(Controller, JSONModel, Popover) {
                "use strict";

                return Controller.extend("myView.Template", {
                    onInit: function () {
                        var this_ = this;

                            that._firstConnection = 1;

                            var oModel = new JSONModel(that.data[0]);
                            
                            oModel.setSizeLimit(Number.MAX_SAFE_INTEGER);

                            this_.getView().setModel(oModel, that.widgetName);

                            this_.oModelSettings = new JSONModel({
                                maxIterations: 200,
                                maxTime: 500,
                                initialTemperature: 200,
                                coolDownStep: 1,
                                mergeEdges: true,
                                nodePlacement: sap.suite.ui.commons.networkgraph.NodePlacement.LinearSegments,
                                nodeSpacing: 50,
                                lineSpacingFactor: 0.25
                            });
                            
                            this_.getView().setModel(this_.oModelSettings, "settings");

                            this_.oGraph = this_.byId("graph_" + widgetName);
                            //this_.oGraph._fZoomLevel = 0.75;
                        }
                    });
            });

            console.log("widgetName Final:" + widgetName);
            var foundIndex = Ar.findIndex(x => x.id == widgetName);
            var divfinal = Ar[foundIndex].div;
            console.log(divfinal);

            //### THE APP: place the XMLView somewhere into DOM ###
            var oView = sap.ui.xmlview({
                viewContent: jQuery(divfinal).html(),
            });

            oView.placeAt(div);
        });
    }

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0,
                v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function loadScript(src, shadowRoot) {
        return new Promise(function(resolve, reject) {
            let script = document.createElement('script');
            script.src = src;

            script.onload = () => {
                console.log("Load: " + src);
                resolve(script);
            }
            script.onerror = () => reject(new Error(`Script load error for ${src}`));

            shadowRoot.appendChild(script)
        });
    }
})();
