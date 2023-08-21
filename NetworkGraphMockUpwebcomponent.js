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

            //this.data = [];
            /*this.data.push({
                nodes: nodes,
                lines: lines
            });*/
            
            var that = this;
            //loadthis(that, "Upstream");
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

    /////////////////////////////// VORBEREITUNG /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// festzulegende und fixe Variablen 
// Größe Platzhalter
const nodeWith = 350;
const nodeHeight = 250;
// fixe Positionen
var xEntladerPosition = 1400;
var yEntladerPosition = 1500;
var directionChange = ['Waschmaschine', 'Etikettiermaschine']  // speichert die Maschinen, wo Richtungswechsel stattfindet

// Liest das csv-file ein und wandelt es in eine matrix um
const fs = require('fs');
function readCSV(filePath) {
    const csvData = fs.readFileSync(filePath, 'utf-8');
    const rows = csvData.trim().split('\n');
    const matrix = [];
    for (let i = 0; i < rows.length; i++) {
      const columns = rows[i].split(';');
      const updatedColumns = [];
      for (let j = 0; j < columns.length; j++) {
        const value = columns[j].trim() === '' ? '0' : columns[j].trim();
        updatedColumns.push(value);
      }
      matrix.push(updatedColumns);
    }
    return matrix;
  }
  
// Verarbeitet Matrix zu Key-Value Objekt mit x und y Positionen
// Zugriff auf Inhalte der Matrix -> Zeilen: matrix[i], Spalten: matrix.map(row => row[i]).slice(x);
matrix =readCSV('C:\\Users\\k0940095\\OneDrive - Krones AG\\SAC\\Linie - GraphExcel-alscsv.csv');
// enthält alle Maschinen-Namen
const maschinen = matrix.map(row => row[4]).slice(2);
// enthalten fixe Positionen und Abhängigkeiten
const xfixPositions = matrix.map(row => row[1]).slice(2);
const yfixPositions = matrix.map(row => row[2]).slice(2);
// enthalten fixe Maschinen
const fixemaschinen = matrix.slice(2).map(row => row[3]);
const fixmachinesstring = [];
for (let i = 0; i < fixemaschinen.length; i++) {
  if (fixemaschinen[i] != 0) {
    fixmachinesstring.push(maschinen[i]);
  }
}
// Key-Value Objekt, das alle Koordinaten der einzelnen Maschinen beinhaltet
const keyvaluepositions = [];
for (let i = 0; i < maschinen.length; i++) {
  const name = maschinen[i];
  if (name === 'Entlader') {

    keyvaluepositions[name] = { x: xEntladerPosition, y: yEntladerPosition, Quelle:"", Senke:"" };
  } else {
    keyvaluepositions[name] = { x: 0, y: 0, Quelle1:"", Senke1:"" };
  }
}



/////////////////////////////////////////////////// FUNKTIONEN /////////////////////////////////////////////////////////////////////////

// Funktion, die positionnen und Abhängigkeiten von fixen Maschinen berechnet
function calculatedependencies(matrix, keyvaluepositions) {
    for (let i = 0; i < yfixPositions.length; i++) {
      if (yfixPositions[i] === 'Entlader') {
          keyvaluepositions[maschinen[i]].y = keyvaluepositions['Entlader'].y;
      }else if (yfixPositions[i] === 'Ettikettiermaschine'){
        keyvaluepositions[maschinen[i]].y = keyvaluepositions['Ettiketiermaschine'].y;
      }
    }
    for (let i = 0; i < xfixPositions.length; i++) {
        if (xfixPositions[i] === 'Entlader') {
          keyvaluepositions[maschinen[i]].x = keyvaluepositions['Entlader'].x;
        }else if (xfixPositions[i] === 'Waschmaschine'){
            keyvaluepositions[maschinen[i]].x = keyvaluepositions['Waschmaschine'].x;
        }else if (xfixPositions[i] === 'Auspacker'){
            keyvaluepositions[maschinen[i]].x = keyvaluepositions['Auspacker'].x;
        }
      }
      return keyvaluepositions;
  }

calculatedependencies(matrix,keyvaluepositions);


/// Funktion, die Senke in das Key-Value Objekt einträgt
const newMatrix = matrix.map(row => row.slice(8));
newMatrix.splice(0,2);
function findAndStoreSenkenQuellen(newMatrix,maschinen,keyvaluepositions){
    for (let i = 0; i < newMatrix[0].length; i++) {
        const senken1Liste = [];
        const senken3Liste = [];
        const senken2Liste = [];
        const senken4Liste = [];
        const senken101Liste = [];
            for (let j = 0; j < newMatrix[i].length; j++) {
              if (newMatrix[i][j] == 1) {
                senken1Liste.push(maschinen[j]);
              } 
              if (newMatrix[i][j] == 3) {
                senken3Liste.push(maschinen[j]);
              }
              if (newMatrix[i][j] == 2) {
                senken2Liste.push(maschinen[j]);
              }
              if (newMatrix[i][j] == 4) {
                senken4Liste.push(maschinen[j]);
              }
              if (newMatrix[i][j] == 101) {
                senken101Liste.push(maschinen[j]);
              }
            }
            var maschinex = maschinen[i];
            keyvaluepositions[maschinex].Senke1 = senken1Liste;
            keyvaluepositions[maschinex].Senke2 = senken2Liste;
            keyvaluepositions[maschinex].Senke3 = senken3Liste;
            keyvaluepositions[maschinex].Senke4 = senken4Liste;
            keyvaluepositions[maschinex].Senke101 = senken101Liste;
          }   
    for (let a=0; a<newMatrix[0].length; a++){
      const quellen1Liste = [];
      const quellen2Liste = [];
      const quellen3Liste = [];
      const quellen4Liste = [];
      const quellen101Liste = [];
      for (let b = 0; b< newMatrix.length; b++){
        if (newMatrix[b][a] == 1){
          quellen1Liste.push(maschinen[b])
        }
        else if (newMatrix[b][a] == 3){
          quellen3Liste.push(maschinen[b]);
        }
        else if (newMatrix[b][a] == 2){
            quellen2Liste.push(maschinen[b]);
        }
        else if (newMatrix[b][a] == 4){
            quellen4Liste.push(maschinen[b]);
        }
        else if (newMatrix[b][a] == 101){
            quellen101Liste.push(maschinen[b]);
        }
      }
      var maschinex = maschinen[a];
      keyvaluepositions[maschinex].Quelle1 = quellen1Liste;
      keyvaluepositions[maschinex].Quelle2 = quellen2Liste;
      keyvaluepositions[maschinex].Quelle3 = quellen3Liste;
      keyvaluepositions[maschinex].Quelle4 = quellen4Liste;
      keyvaluepositions[maschinex].Quelle101 = quellen101Liste;
    }
    return keyvaluepositions;
    }     
findAndStoreSenkenQuellen(newMatrix,maschinen,keyvaluepositions);



// Kalkuliert die Pfade abhängig von der Gewichtung
function findPaths(machineName, keyvaluepositions, property) {
  const paths = [];
  const machine = keyvaluepositions[machineName];
  if (!machine) {
    return paths;
  }
  const path = [machineName];
  if (machine[property].length > 0) {
    const nextMachineName = machine[property][0];
    const nextPaths = findPaths(nextMachineName, keyvaluepositions, property);

    for (const nextPath of nextPaths) {
      paths.push([...path, ...nextPath]);
    }
  } else {
    paths.push(path);
  }
  return paths;
}



  
// Funktionen, die die Node Positions nach Richtungen berechnet
function calcpositionshor_r (path, width){
  const firstMachine = path[0];
  for (let i = 0; i < path.length; i++) {
    const machineName = path[i];
    const currentMachine = keyvaluepositions[machineName];
    const xOffset = i * width;
    currentMachine.y = keyvaluepositions[firstMachine].y;
    currentMachine.x = keyvaluepositions[firstMachine].x + xOffset;
  }
}

function calcpositionshor_l (path, width){
  const firstMachine = path[0];
  for (let i = 0; i < path.length; i++) {
    const machineName = path[i];
    const currentMachine = keyvaluepositions[machineName];
    const xOffset = i * width;
    currentMachine.y = keyvaluepositions[firstMachine].y;
    currentMachine.x = keyvaluepositions[firstMachine].x - xOffset;
  }
}

function calcpositionssenkr_u(path, height) {
    const firstMachine = path[0];
    for (let i = 0; i < path.length; i++) {
      const machineName = path[i];
      const currentMachine = keyvaluepositions[machineName];
      const yOffset = i * height;
      // Setze den x-Wert der aktuellen Maschine auf den x-Wert der ersten Maschine (fixe Maschine)
      currentMachine.x = keyvaluepositions[firstMachine].x;
      // Setze den y-Wert der aktuellen Maschine entsprechend dem yOffset
      currentMachine.y = keyvaluepositions[firstMachine].y + yOffset;
    }
  }

function calcpositionssenkr_o (path, height){
  const firstMachine = path[0];
  for (let i = 0; i < path.length; i++) {
    const machineName = path[i];
    const currentMachine = keyvaluepositions[machineName];
    const yOffset = i * height;
    currentMachine.x = keyvaluepositions[firstMachine].x;
    currentMachine.y = keyvaluepositions[firstMachine].y + yOffset;
  }
}




// Bestimme für Hauptlinie die Pfade inklusive Aufteilung in Teilpfade
// rote Pfeile
const path1 = findPaths("Entlader", keyvaluepositions, "Senke1");
innerPath1 = path1[0]; 
const path1_hor_r = innerPath1.slice(0, innerPath1.indexOf(directionChange[0])+1);
const path1_senkr_u = innerPath1.slice(innerPath1.indexOf(directionChange[0]), innerPath1.indexOf(directionChange[1]) + 1);
const path1_hor_l = innerPath1.slice(innerPath1.indexOf(directionChange[1]), innerPath1.length);
calcpositionshor_r(path1_hor_r, nodeWith);
calcpositionssenkr_u(path1_senkr_u, nodeHeight);
calcpositionshor_l(path1_hor_l, nodeWith);

// Bestimme auf Basis der Hauptlinie die restlichen Pfade
// gelbe Pfeile
const path2_Entlader = findPaths("Entlader", keyvaluepositions,"Senke2" )[0];
const path2_Auspacker = findPaths("Auspacker", keyvaluepositions, "Senke2")[0];

function calcpositionssenkr_u_2(path){
  const firstMachine = path[0];
  const lastMachine = path[path.length-1];
  const pathLength =path.length -2;
    for (let i = 1; i < path.length -2; i++) {
      const machineName = path[i];
      const currentMachine = keyvaluepositions[machineName];
      const diff = keyvaluepositions[lastMachine].y - keyvaluepositions[firstMachine].y;
      const diffspace = diff / pathLength;
      const yOffset = i * diffspace;
      // Setze den x-Wert der aktuellen Maschine auf den x-Wert der ersten Maschine (fixe Maschine)
      currentMachine.x = keyvaluepositions[firstMachine].x;
      // Setze den y-Wert der aktuellen Maschine entsprechend dem yOffset
      currentMachine.y = keyvaluepositions[firstMachine].y + yOffset;
    }
}


calcpositionssenkr_u_2(path2_Entlader)
calcpositionssenkr_u_2(path2_Auspacker)
console.log(path2_Auspacker)




// Key-Value Objekt in Ausgabeformat umwandeln
// Maschinen und Positionen
const data = {
  nodes: []
};

for (const machineName in keyvaluepositions) {
  if (keyvaluepositions.hasOwnProperty(machineName)) {
    const machine = keyvaluepositions[machineName];
    const node = {
      key: data.nodes.length,
      title: machineName,
      x: machine.x,
      y: machine.y,
      attributes: [
        {
          label: "Technical Availability",
          value: "%"
        }
      ]
    };
    //console.log(JSON.stringify(node, null, 2) + ','); // Ausgabe des aktuellen Knotens mit Komma
    data.nodes.push(node);
  }
}

//console.log(JSON.stringify(data, null, 2)); // Ausgabe des gesamten Datenobjekts

// Verbindungen zwischen den Maschinen 
const lines = [];

for (let i = 0; i < newMatrix.length; i++) {
  const row = newMatrix[i];

  for (let j = 0; j < row.length; j++) {
    if (row[j] !== '0') {
      lines.push({ "from": i, "to": j });
    }
  }
}
//console.log(lines);

    

    // UTILS
    function loadthis(that) {
        that.data = [{
            data,lines
            
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
            div0.innerHTML = '<?xml version="1.0"?><script id="oView_UpStream' + widgetName + '" name="oView_' + widgetName + '" type="sapui5/xmlview"><mvc:View controllerName="myView.Template" xmlns="sap.suite.ui.commons.networkgraph" xmlns:layout="sap.suite.ui.commons.networkgraph.layout" xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns:l="sap.ui.layout" height="100%">><l:FixFlex><l:fixContent><m:FlexBox fitContainer="true" renderType="Bare" wrap="Wrap"><m:SegmentedButton selectionChange="changeData"><m:items><m:SegmentedButtonItem text="Ebene 1" key="data"/><m:SegmentedButtonItem text="Ebene 2" key="nodata"/><m:SegmentedButtonItem text="Ebene 3" key="nodata3"/></m:items></m:SegmentedButton><m:items><Graph  enableWheelZoom="true" height="200%" width="200%" nodes="{' + widgetName + '>/nodes}" lines="{' + widgetName + '>/lines}" groups="{' + widgetName + '>/groups}" id="graph_' + widgetName + '" > <statuses><Status key="CustomKrones" title="Standard" backgroundColor="#0060AD" borderColor="sapUiContentShadowColor" hoverBorderColor="sapUiContentShadowColor"/></statuses> <nodes> <Node key="{' + widgetName +'>key}"  title="{' + widgetName + '>title}" icon="{' + widgetName + '>icon}" group="{' + widgetName + '>group}"  attributes="{' + widgetName + '>attributes}"  shape="Box" status="{'+ widgetName + '>status}" x="{' + widgetName + '>x}"  y="{' + widgetName + '>y}" showDetailButton="false" width="auto" maxWidth="500"> <attributes> <ElementAttribute label="{' + widgetName + '>label}" value="{' + widgetName + '>value}"/> </attributes> </Node> </nodes> <lines> <Line from="{' + widgetName + '>from}" to="{' + widgetName + '>to}" status="{' + widgetName + '>status}" arrowOrientation="ParentOf" arrowPosition="Middle" press="linePress"></Line> </lines> <groups> <Group key="{' + widgetName + '>key}" title="{' + widgetName + '>title}"></Group> </groups> </Graph></m:items></m:FlexBox></l:fixContent></l:FixFlex> </mvc:View></script>';


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
                "sap/m/Popover",
		"sap/suite/ui/commons/networkgraph/layout/NoopLayout"
            ], function(Controller, JSONModel, Popover,NoopLayout) {
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
                            });
                            
                            this_.getView().setModel(this_.oModelSettings, "settings");

                            this_.oGraph = this_.byId("graph_" + widgetName);
			    this_.oGraph.setLayoutAlgorithm(new NoopLayout);
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
