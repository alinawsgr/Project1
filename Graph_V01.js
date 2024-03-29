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

            
            // get all machines -> Machines contains all existing machines
            for(let i = 0; i < source.length; i++){
                Machines.push({Machine: source[i].Quelle_.id.replace(" ", "-")})
            }

            // transform source xml into a less complex structure 
            for(let i = 0; i < source.length; i++){
                for(let j = 0; j < Machines.length; j++){
                    if(Machines[j].Machine in source[i]){
                        if(Machines[j].Machine[1] !== undefined){
                            if(source[i][Machines[j].Machine].id !== "@NullMember" && source[i][Machines[j].Machine].id !== ""){
                                t_source.push( {
                                    Parent_Machine: source[i].Quelle_.id,
                                    X: source[i].X.id,
                                    Y: source[i].Y.id,
                                    ID: source[i][Machines[j].Machine].id,
                                    Children_Machine: Machines[j].Machine,
                                    X_dep: source[i].X.id,
                                    Y_dep: source[i].Y.id
                                }
                                )
                            }
                        }
                    }
                }
                
            }
            setCoordinates(t_source,source);

            let oNewDataSource = restructureNodes(t_source);
            this.data = [oNewDataSource];
            buildgraph(this);
        }

        connectedCallback() {

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
            
            loadthis(this);
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
    const nodeWidth = 400;
    const nodeHeight = 400;
    // fix position of "Entlader"
    let xEntladerPosition = 1000;
    let yEntladerPosition = 1000;
    // direction changes in the graph (in this case of the main line)
    let directionChange = ['Waschmaschine', 'Etikettiermaschine']
    let pathChanges = ['Entlader','Auspacker','Waschmaschine','Etikettiermaschine', 'Varioline', 'Belader_rechts'];
    
    
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

        // get all existing machines in string format 
        let allmachinesstring = [];
        for (let i=0; i < t_source.length; i++){
            allmachinesstring.push(t_source[i].Parent_Machine);
        }
        // get all values
        // get all existing connection values
        let allconnectionvalues = [];
        let allconnectionvalues_a = [];
        for (let i=0; i<t_source.length; i++){
            allconnectionvalues_a.push(t_source[i].ID);  
        }
        for (let j=0; j<allconnectionvalues_a.length; j++){
            for (let a=0; a<allconnectionvalues.length; a++){
                if(allconnectionvalues_a[j] != allconnectionvalues[a]){
                    allconnectionvalues.push(allconnectionvalues_a[j]);
                }
            }
            }
        
        // function that calculates "Ausreißer"
        //allmachinesstring
        let externalpaths = [];
        for (let i=0; i<t_source.length; i++){
            let currentM_P = t_source[i].Parent_Machine;
            let currentM_C = t_source[i].Children_Machine;
            var found = false;
            for (var j=0; j<t_source.length; j++){
                if ((i !== j && t_source[j].Parent_Machine === currentM_P) /*|| (i !== j && t_source[j].Children_Machine === currentM_C)*/){
                    found = true;
                    break;
                }
            }
            if (found){
                externalpaths.push(t_source[i].Parent_Machine, t_source[i].ID);
            }
        }


        let t_externalpaths = [];
        for (let a=0; a<externalpaths.length; a++){
            if (externalpaths[a] === '1' || externalpaths[a] === '2'){
                t_externalpaths.pop();
            } else {
                t_externalpaths.push(externalpaths[a]);
            }
        }

        // calculates all paths in the graph regarding their value/priority (path priority must be given as an input and as a string in the format: 'number')
        function findPaths(t_source, priority, start){
            // calculates the row of the start machine, from where the paths start
            // path1 contains all connections with value 1 -> Hauptlinie
            // end nodes!
            let path = [];
            // define the start machine of the path
            for (let i=0; i<t_source.length; i++){
                if (t_source[i].ID === priority && t_source[i].Parent_Machine == start){
                    path.push(t_source[i].Parent_Machine);
                    path.push(t_source[i].Children_Machine);                    
                }
            }

            for (let j=1; j<path.length; j++){
                for (let a=0; a<t_source.length; a++){
                    if (t_source[a].ID === priority && t_source[a].Parent_Machine == path[j]){
                        path.push(t_source[a].Children_Machine);
                    }
                }
            }
            return path;
        }


        
        // function that calculates paths for each connection value (1,2,3,...) -> start findPaths()
        // hier ist noch etwas manueller workaround
        // red 
        let path1 = findPaths(t_source, '1', 'Entlader');
        // cut the path in direction changes
        let path1_hor_r = path1.slice(0, (path1.indexOf(directionChange[0])+1));
        let path1_senkr_u = path1.slice((path1.indexOf(directionChange[0])), (path1.indexOf(directionChange[1]) + 1));
        let path1_hor_l = path1.slice((path1.indexOf(directionChange[1])),( path1.length));
        let indexVar = path1_hor_l.indexOf('Varioline');
        let path1_hor_l_1 = path1_hor_l.slice(0, indexVar);
        let path1_hor_l_2 = path1_hor_l.slice (indexVar, path1_hor_l.length);

        // neuer Versuch
        // cut path1 in parts
        path1_hor_r_Entlader_Auspacker = path1.slice(0, (path1.indexOf(pathChanges[1])));
        path1_hor_r_Entlader_Auspacker_length = path1_hor_r_Entlader_Auspacker.length;

        path1_hor_r_Auspacker_Wama = path1.slice(path1.indexOf(pathChanges[1]), (path1.indexOf(pathChanges[2])));
        path1_hor_r_Auspacker_Wama_length = path1_hor_r_Auspacker_Wama.length;

        path1_senkr_u_Wama_Etima = path1.slice(path1.indexOf(pathChanges[2]), (path1.indexOf(pathChanges[3])));
        path1_senkr_u_Wama_Etima_length = path1_senkr_u_Wama_Etima.length;

        path1_hor_l_Etima_Varioline = path1.slice(path1.indexOf(pathChanges[3]), (path1.indexOf(pathChanges[4])));
        path1_hor_l_Etima_Varioline_length = path1_hor_l_Etima_Varioline.length;

        
        path1_hor_l_Varioline_Belader = path1.slice(path1.indexOf(pathChanges[4]), (path1.indexOf(pathChanges[5])));
        path1_hor_l_Varioline_Belader_length = path1_hor_l_Varioline_Belader.length;

        path1_hor_l_Belader_ = path1.slice(path1.indexOf(pathChanges[5]))
        
        path1_hor_r_Entlader_Auspacker.push(path1_hor_r_Auspacker_Wama[0]);
        path1_hor_r_Auspacker_Wama.push(path1_senkr_u_Wama_Etima[0]);
        path1_senkr_u_Wama_Etima.push(path1_hor_l_Etima_Varioline[0]);
        path1_hor_l_Varioline_Belader.push(pathChanges[5]);

        
        // yellow
        let path2 = [];
        path2_Entlader = findPaths(t_source, '2', 'Entlader');
        path2_Entlader_length = path2_Entlader.length;
        path2_Auspacker = findPaths(t_source,'2', 'Auspacker');
        path2_Auspacker_length = path2_Auspacker.length;
        


        /* rest
        let path3 = [];
        let machine3 = [];
        for (i=0; i<t_source.length; i++){
            if(t_source[i].ID === '3'){
                machine3.push(t_source[i].Parent_Machine);
            }
        }
        console.log(machine3); // ['Abschieber', 'TBB_EG04', 'TBG_EG05', 'TBG_EG08', 'EXTERN01']


        //path3 = findPaths(t_source, '3');
        let path4 = [];
        //path4 = findPaths(t_source,'4',)
        let machine4 = [];
        for (i=0; i<t_source.length; i++){
            if(t_source[i].ID === '4'){
                machine4.push(t_source[i].Children_Machine);
            }
        }
        console.log(machine4); 
        // ['Abschrauber', 'TBB_EG12', 'TBB_EG14', 'TBG_EG09', 'TBG_EG12', 'TBG_EG13', 'TBB_EG13']           -> Parent
        // ['TBB_EG14', 'TBB_EG13', 'TBB_EG16', 'TBG_EG12', 'TBG_EG13', 'Belader_links', 'Abschrauber']      -> Children
        */



        // get maximal path length for each dependent paths and set path length for each path
        // dependent paths: 
        // Entlader -> Auspacker / Varioline -> Belader
        let maxLength_Entlader_Auspacker_Varioline_Belader = 0;
        if (path1_hor_r_Entlader_Auspacker.length > path1_hor_l_Varioline_Belader.length){
            maxLength_Entlader_Auspacker_Varioline_Belader = path1_hor_r_Entlader_Auspacker.length;
        } else {
            maxLength_Entlader_Auspacker_Varioline_Belader = path1_hor_l_Varioline_Belader.length;
        }
    

        // Auspacker -> Wama / Etima -> Varioline
        let maxLength_Auspacker_Wama_Etima_Varioline = 0;
        if (path1_hor_r_Auspacker_Wama.length > path1_hor_l_Etima_Varioline.length){
            maxLength_Auspacker_Wama_Etima_Varioline = path1_hor_r_Auspacker_Wama.length;
        } else {
            maxLength_Auspacker_Wama_Etima_Varioline = path1_hor_l_Etima_Varioline.length;
        }
        

        // Entlader -> Belader / Auspacker -> Varioline / Wama -> Etima
        let maxLength_Entlader_Belader_Auspacker_Varioline_Wama_Etima = 0;
        if ( path2_Entlader.length > path2_Auspacker.length){
            maxLength_Entlader_Belader_Auspacker_Varioline_Wama_Etima  = path2_Entlader.length;
        }
        if(path2_Entlader.length < path2_Auspacker.length){
            maxLength_Entlader_Belader_Auspacker_Varioline_Wama_Etima = path2_Auspacker.length;
        }
        if(path2_Auspacker.length > path1_senkr_u_Wama_Etima.length){
            maxLength_Entlader_Belader_Auspacker_Varioline_Wama_Etima = path2_Auspacker.length;
        }
        if(path2_Auspacker.length < path1_senkr_u_Wama_Etima.length){
            maxLength_Entlader_Belader_Auspacker_Varioline_Wama_Etima = path1_senkr_u_Wama_Etima.length;
        }
        if(path1_senkr_u_Wama_Etima.length > path2_Entlader.length){
            maxLength_Entlader_Belader_Auspacker_Varioline_Wama_Etima = path1_senkr_u_Wama_Etima.length;
        }
        if (path1_senkr_u_Wama_Etima.length < path2_Entlader.length){
            maxLength_Entlader_Belader_Auspacker_Varioline_Wama_Etima = path2_Entlader.length;
        }
        

        


        // functions that calculate the coordinates for each direction
        function calcpositionshor_r(path, t_source,maxLength, nodeWidth, priority) {
            let firstMachineX = null; 
            let firstMachineY = null; 
            let space = (maxLength * nodeWidth)/ path.length;
        
            for (let i = 0; i < path.length; i++) {
                let xOffset = (i + 1) * space;
                let yOffset = 0;
                let firstMachine = path[0];
        
                for (let j = 0; j < t_source.length; j++) {
                    if (t_source[j].Parent_Machine === firstMachine) {
                        firstMachineX = t_source[j].X;
                        firstMachineY = t_source[j].Y;
                        break; 
                    }
                }
        
                for (let a = 0; a < t_source.length; a++) {
                    if (t_source[a].Parent_Machine === path[i + 1]) {
                        t_source[a].X = firstMachineX + xOffset;
                        t_source[a].Y = firstMachineY + yOffset;
                    }
                }
            }
        }
        
          
        function calcpositionshor_l (path,t_source,maxLength, nodeWidth, priority){
            let firstMachineX = null; 
            let firstMachineY = null; 
            let space = (maxLength * nodeWidth)/ path.length;

        
            for (let i = 0; i < path.length; i++) {
                let xOffset = (i + 1) * space;
                let yOffset = 0;
                let firstMachine = path[0];
                for (let j = 0; j < t_source.length; j++) {
                    if (t_source[j].Parent_Machine === firstMachine) {
                        firstMachineX = t_source[j].X;
                        firstMachineY = t_source[j].Y;
                        break; 
                    }
                }
        
                for (let a = 0; a < t_source.length; a++) {
                    if (t_source[a].Parent_Machine === path[i + 1] && path[i + 1] !== 'Varioline') {
                        t_source[a].X = firstMachineX - xOffset;
                        t_source[a].Y = firstMachineY + yOffset;
                    }
                }
                
            }
            
            
          }
          
        function calcpositionssenkr_u(path,t_source, maxLength, nodeHeight, priority) {
            let firstMachineX = null; 
            let firstMachineY = null; 
            let space = (maxLength * nodeHeight)/ path.length;
        
            for (let i = 0; i < path.length; i++) {
                let xOffset = 0;
                let yOffset = (i + 1) * space;
                let firstMachine = path[0];
                
        
                for (let j = 0; j < t_source.length; j++) {
                    if (t_source[j].Parent_Machine === firstMachine) {
                        firstMachineX = t_source[j].X;
                        firstMachineY = t_source[j].Y;
                        break; 
                    }
                }
        
                for (let a = 0; a < t_source.length; a++) {
                    if (t_source[a].Parent_Machine === path[i + 1] && path[i+1] != 'Varioline') {
                        t_source[a].X = firstMachineX + xOffset;
                        t_source[a].Y = firstMachineY + yOffset;
                    }
                }
            }

            }
          
        function calcpositionssenkr_o (path,t_source, maxLength, nodeHeight,priority){
            let firstMachineX = null; 
            let firstMachineY = null;
            let space = (maxLength * nodeHeight)/ path.length; 
        
            for (let i = 0; i < path.length; i++) {
                let xOffset = 0;
                let yOffset = (i + 1) * space;
                let firstMachine = path[0];
        
                for (let j = 0; j < t_source.length; j++) {
                    if (t_source[j].Parent_Machine === firstMachine) {
                        firstMachineX = t_source[j].X;
                        firstMachineY = t_source[j].Y;
                        break; 
                    }
                }
        
                for (let a = 0; a < t_source.length; a++) {
                    if (t_source[a].Parent_Machine === path[i + 1]) {
                        t_source[a].X = firstMachineX + xOffset;
                        t_source[a].Y = firstMachineY - yOffset;
                    }
                }
            }
           
          }
        
        function calcpositionsexternal (path){
            let start = path[0];
            let startsecond = path[1];
            let startX = 0;
            let startY = 0;
            let end = path[path.length - 1];
            let endX = 0;
            let endY = 0;
                // get coordinates of start and end machine of the external path
                for (let x = 0; x<t_source.length; x++){
                    if (t_source[x].Parent_Machine === start){
                        startX = t_source[x].X;
                        startY = t_source[x].Y;
                    }
                    if (t_source[x].Parent_Machine === end){
                        endX = t_source[x].X;
                        endY = t_source[x].Y;
                    }
                    // the position of the second machine in the path is calculated with the X coordinate from the start machine and the y coordinate from the end machine
                    if (t_source[x].Parent_Machine === startsecond){
                        t_source[x].X = startX;
                        t_source[x].Y = endY;
                    } 
                }
            let elementsbetween = path.length - 3; 
            let pathlength_X = (endX- startX) / elementsbetween 
            //let pathlength_Y = endY - endY; 
            for (let j=2; j<(path.length)-1; j++){
                let offset = 0;
                let nextMachine = path[j];
                for (let e=0; e<t_source.length; e++){
                    if (startY !== endY){
                        offset = (j-1) * pathlength_X - nodeHeight;
                        if (t_source[e].Parent_Machine === path[j]){
                            t_source[e].Y = endY;
                            t_source[e].X = t_source[e].X - offset;
                        }
                    }
                    if (startY === endY){
                        offset = (j) * pathlength_X - nodeWidth;
                        if (t_source[e].Parent_Machine === path[j]){
                            t_source[e].Y = startY - nodeWidth;
                            t_source[e].X = startX + offset; 
                        }


                    }
                }
            }
            
        }

        // calculates all paths and the positions of all machines
        // 1
        
        calcpositionshor_r(path1_hor_r_Entlader_Auspacker, t_source,maxLength_Entlader_Auspacker_Varioline_Belader, nodeWidth,'1');
        calcpositionshor_r(path1_hor_r_Auspacker_Wama, t_source,maxLength_Auspacker_Wama_Etima_Varioline, nodeWidth, '1');
        
        calcpositionssenkr_u(path1_senkr_u_Wama_Etima, t_source,maxLength_Entlader_Belader_Auspacker_Varioline_Wama_Etima, nodeHeight,'1');
        
        calcpositionshor_l(path1_hor_l_Etima_Varioline,t_source,maxLength_Auspacker_Wama_Etima_Varioline, nodeWidth,'1');
        

        for (let a=0; a<t_source.length; a++){
            if (t_source[a].Y_dep === 'Etikettiermasschine'){
                for (let y=0; y<t_source.length; y++){
                    if(t_source[y].Parent_Machine === 'Etikettiermaschine'){
                        t_source[a].Y = t_source[y].Y;
                    }      
                }
            }
            if (t_source[a].X_dep === 'Auspacker'){
                for (let x=0; x<t_source.length; x++){
                    if(t_source[x].Parent_Machine === 'Auspacker'){
                        t_source[a].X = t_source[x].X;
                    }      
                }
            }
        }
        calcpositionshor_l(path1_hor_l_Varioline_Belader,t_source, maxLength_Entlader_Auspacker_Varioline_Belader, nodeWidth,'1');
        calcpositionshor_l(path1_hor_l_Belader_,t_source,path1_hor_l_Belader_.length, nodeWidth,'1');


        
        // 2
        calcpositionssenkr_u(path2_Entlader,t_source, maxLength_Entlader_Belader_Auspacker_Varioline_Wama_Etima, nodeHeight,'2');
        for (let a=0; a<t_source.length; a++){
            if (t_source[a].Y_dep === 'Etikettiermasschine'){
                for (let y=0; y<t_source.length; y++){
                    if(t_source[y].Parent_Machine === 'Etikettiermaschine'){
                        t_source[a].Y = t_source[y].Y;
                    }      
                }
            }
            if (t_source[a].X_dep === 'Entlader'){
                for (let x=0; x<t_source.length; x++){
                    if(t_source[x].Parent_Machine === 'Entlader'){
                        t_source[a].X = t_source[x].X;
                    }      
                }
            }
        }
        calcpositionssenkr_u(path2_Auspacker, t_source, maxLength_Entlader_Belader_Auspacker_Varioline_Wama_Etima, nodeHeight, '2');

        // others...   
        
        let paths_4 = [];
        let paths_10 = [];
        let paths_20 = [];
        let paths_3 = [];

        // externalpaths: 

        for (let i = 0; i < t_externalpaths.length; i++) {
            let index = '';
            if (t_externalpaths[i] === '4') {
                x = i-1;
                index = t_externalpaths[x];
                paths_4.push(findPaths(t_source, '4', index));
            } else if (t_externalpaths[1] === '10') {
                x = i-1;
                index = t_externalpaths[x];
                paths_10.push(findPaths(t_source, '10', index));
            } else if (t_externalpaths[i] === '20') {
                x = i-1;
                index = t_externalpaths[x];
                paths_20.push(findPaths(t_source, '20', index));
            } else if (t_externalpaths[i] === '3') {
                x = i-1;
                index = t_externalpaths[x];
                paths_3.push(findPaths(t_source, '3', index));
            }
        }
        console.log(paths_3);
        console.log(paths_4); // 1: ['TBB_EG12', 'TBB_EG13', 'Abschrauber', 'TBB_EG14', 'TBB_EG16'] 2: ['TBG_EG09', 'TBG_EG12', 'TBG_EG13', 'Belader_links']
        console.log(paths_10);
        console.log(paths_20);

        for (let p=0; p<paths_4.length; p++){
            let currentpath = paths_4[p];
            calcpositionsexternal(currentpath);
        }
    }

    // function that transform p_source data into input format for graph 

    function restructureNodes(aSource){
        var oNewStructure = {
            "nodes" : [],
            "lines": []
        };

        // Define ID 
        for(var x in aSource){
            let oCurrent = aSource[x];

            oCurrent.Key = x;
        }

        var aNodes = oNewStructure.nodes,
            aLines = oNewStructure.lines;

        for(var i in aSource){
            let oCurrentNode = aSource[i],
            sCurrentName = oCurrentNode.Parent_Machine,
            sCurrKey = oCurrentNode.Key,
            sCurrentChild = oCurrentNode.Children_Machine;

            aNodes.push({
                "key": sCurrKey,
                "title": sCurrentName,
                "x": oCurrentNode.X,
                "y": oCurrentNode.Y,
                "status": "Success",
                "attributes": [
                    {
                        "label": "Technical Availability",
                        "value": "92,59%"
                    }
                ]
            });

            let aFiltredNextNodes = aSource.filter(oData => oData.Parent_Machine === sCurrentChild);
            for(var j in aFiltredNextNodes){
                let oNexNode = aFiltredNextNodes[j],
                sNextKey = oNexNode.Key;

                aLines.push({
                    "from": sCurrKey,
                    "to": sNextKey
                });
            }
        }

        return oNewStructure;
    }

    function buildgraph(that) {
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
            div0.innerHTML = '<?xml version="1.0"?><script id="oView_UpStream' + widgetName + '" name="oView_' + widgetName + '" type="sapui5/xmlview"><mvc:View controllerName="myView.Template" xmlns="sap.suite.ui.commons.networkgraph" xmlns:layout="sap.suite.ui.commons.networkgraph.layout" xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns:l="sap.ui.layout" height="100%">><l:FixFlex><l:fixContent><m:FlexBox fitContainer="true" renderType="Bare" wrap="Wrap"><m:SegmentedButton selectionChange="changeData"><m:items><m:SegmentedButtonItem text="Ebene 1" key="data"/><m:SegmentedButtonItem text="Ebene 2" key="nodata"/><m:SegmentedButtonItem text="Ebene 3" key="nodata3"/></m:items></m:SegmentedButton><m:items><Graph  enableWheelZoom="true" height="200%" width="200%" nodes="{' + widgetName + '>/nodes}" lines="{' + widgetName + '>/lines}" groups="{' + widgetName + '>/groups}" id="graph_' + widgetName + '" > <layoutAlgorithm><layout:NoopLayout/></layoutAlgorithm><statuses><Status key="CustomKrones" title="Standard" backgroundColor="#0060AD" borderColor="sapUiContentShadowColor" hoverBorderColor="sapUiContentShadowColor"/></statuses> <nodes> <Node key="{' + widgetName +'>key}"  title="{' + widgetName + '>title}" icon="{' + widgetName + '>icon}" group="{' + widgetName + '>group}"  attributes="{' + widgetName + '>attributes}"  shape="Box" status="{'+ widgetName + '>status}" x="{' + widgetName + '>x}"  y="{' + widgetName + '>y}" showDetailButton="false" width="auto" maxWidth="500"> <attributes> <ElementAttribute label="{' + widgetName + '>label}" value="{' + widgetName + '>value}"/> </attributes> </Node> </nodes> <lines> <Line from="{' + widgetName + '>from}" to="{' + widgetName + '>to}" status="{' + widgetName + '>status}" arrowOrientation="ParentOf" arrowPosition="Middle" press="linePress"></Line> </lines> <groups> <Group key="{' + widgetName + '>key}" title="{' + widgetName + '>title}"></Group> </groups> </Graph></m:items></m:FlexBox></l:fixContent></l:FixFlex> </mvc:View></script>';


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

    
    // UTILS
    function loadthis(that) {
        that.data = [];
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
