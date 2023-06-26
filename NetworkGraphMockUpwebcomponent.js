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

    // UTILS
    function loadthis(that) {
        that.data = [{
            "nodes": [
                {
                  key: 0,
                  title: "Abschieber",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                  },
                {
                  key: 1,
                  title: "Entlader",
	          "x": 50,
		  "y": 25,
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%",
		      
                    }
                  ]
                  },
	        {
                  key: 2,
                  title: "Auspacker",
		  "x": 500,
		  "y": 137,
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 4,
                  title: "Waschmaschine",
		  "x": 1000,
		  "y": 137,
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 5,
                  title: "Linatronic",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 6,
                  title: "Füller",
                  "x": 1000,
		  "y": 350,
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                    
                },
                {
                  key: 7,
                  title: "Etikettiermaschine",
		  "x": 1000,
		  "y": 500,
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 8,
                  title: "Varioline",
		  "x": 500,
		  "y": 500,
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 9,
                  title: "Belader-rechts",
		  "x": 200,
		  "y": 1425,
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 10,
                  title: "Belader-links",
		  "x": 50,
		  "y": 350,
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 11,
                  title: "Gebindewascher",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 12,
                  title: "Abschrauber",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 13,
                  title: "TBB-EG01",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 14,
                  title: "TBB-EG02",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 15,
                  title: "TBB-EG03",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 16,
                  title: "TBB-EG04",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 17,
                  title: "TBB-EG05",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 18,
                  title: "TBB-EG06",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 19,
                  title: "TBB-EG07",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 20,
                  title: "TBB-EG08",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 21,
                  title: "TBB-EG09",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 22,
                  title: "TBB-EG10",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 23,
                  title: "TBB-EG11",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 24,
                  title: "TBB-EG12",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 25,
                  title: "TBB-EG13",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 26,
                  title: "TBB-EG14",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 27,
                  title: "TBB-EG15",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 28,
                  title: "TBB-EG16",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 29,
                  title: "TBB-EG17",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 30,
                  title: "TBB-EG18",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 31,
                  title: "TBB-EG19",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 32,
                  title: "TBB-EG20",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 33,
                  title: "TBB-EG21",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 34,
                  title: "TBB-EG22",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 35,
                  title: "TBB-EG23",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 36,
                  title: "TBB-EG24",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 37,
                  title: "TBB-EG25",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 38,
                  title: "TBB-EG26",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 39,
                  title: "TBG-EG01",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 40,
                  title: "TBG-EG02",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 41,
                  title: "TBG-EG03",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 42,
                  title: "TBG-EG04",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 43,
                  title: "TBG-EG05",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 44,
                  title: "TBG-EG06",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 45,
                  title: "TBG-EG07",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 46,
                  title: "TBG-EG08",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 47,
                  title: "TBG-EG09",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 48,
                  title: "TBG-EG10",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 49,
                  title: "TBG-EG11",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 50,
                  title: "TBG-EG12",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 51,
                  title: "TBG-EG13",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 53,
                  title: "TBG-EG15",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 54,
                  title: "TBP1-EG01",
		  "x": 0,
		  "y": 225,
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 55,
                  title: "TBP1-EG02",
		  "x": 50,
		  "y": 425,
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 56,
                  title: "TBP1-EG03",
		  "x": 50,
		  "y": 625,
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 57,
                  title: "TBP1-EG04",
		  "x": 50,
		  "y": 825,
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 58,
                  title: "TBP1-EG05",
		  "x": 50,
		  "y": 1025,
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 59,
                  title: "TBP1-EG06",
		  "x": 50,
		  "y": 1225,
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 60,
                  title: "TBP1-EG07",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 61,
                  title: "TBP1-EG08",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 62,
                  title: "TBP2-EG",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 63,
                  title: "EXTERN01",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 64,
                  title: "EXTERN02",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 65,
                  title: "Extern-Aufgabe PAL",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },{
                  key: 66,
                  title: "Extern-Abgabe PAL",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 67,
                  title: "EXTERN05",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 68,
                  title: "EXTERN06",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 69,
                  title: "EXTERN07",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 70,
                  title: "EXTERN08",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 71,
                  title: "EXTERN09",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 72,
                  title: "EXTERN10",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
                {
                  key: 73,
                  title: "EXTERN11",
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
		    
	           ],
            
          "lines": [
              {"from": 0, "to": 16},
              {"from": 1, "to": 39},
              {"from": 1, "to": 55},
              {"from": 2, "to": 13},
              {"from": 2, "to": 42},
              {"from": 4, "to": 29},
              {"from": 5, "to": 31},
              {"from": 6, "to": 32},
              {"from": 6, "to": 33},
              {"from": 7, "to": 36},
              {"from": 8, "to": 45},
              {"from": 9, "to": 60},
              {"from": 10, "to": 60},
              {"from": 11, "to": 43},
              {"from": 12, "to": 26},
              {"from": 13, "to": 14},
              {"from": 14, "to": 15},
              {"from": 14, "to": 23},
              {"from": 15, "to": 17},
              {"from": 17, "to": 18},
              {"from": 16, "to": 17},
              {"from": 18, "to": 19},
              {"from": 19, "to": 20},
              {"from": 19, "to": 21},
              {"from": 19, "to": 22},
              {"from": 19, "to": 24},              
              {"from": 23, "to": 34},
              {"from": 24, "to": 25},
              {"from": 24, "to": 27},
              {"from": 25, "to": 12},
              {"from": 26, "to": 28},
              {"from": 27, "to": 28},
              {"from": 28, "to": 4},
              {"from": 29, "to": 30},
              {"from": 30, "to": 5},
              {"from": 31, "to": 6},
              {"from": 33, "to": 34},
              {"from": 34, "to": 35},
              {"from": 34, "to": 37},
              {"from": 35, "to": 7},
              {"from": 36, "to": 38},
              {"from": 38, "to": 8},
              {"from": 39, "to": 40},
              {"from": 40, "to": 41},
              {"from": 41, "to": 2},
              {"from": 42, "to": 11},
              {"from": 43, "to": 44},
              {"from": 43, "to": 46},
              {"from": 44, "to": 53},
              {"from": 45, "to": 47},
              {"from": 46, "to": 47},
              {"from": 47, "to": 48},
              {"from": 47, "to": 50},
              {"from": 48, "to": 49},
              {"from": 49, "to": 9},
              {"from": 50, "to": 51},
              {"from": 51, "to": 10},
              {"from": 53, "to": 8},
              {"from": 54, "to": 1},
              {"from": 55, "to": 56},
              {"from": 56, "to": 57},
              {"from": 57, "to": 58},
              {"from": 58, "to": 59},
              {"from": 59, "to": 9},
              {"from": 59, "to": 10},
              {"from": 60, "to": 61},
              {"from": 61, "to": 66},
              {"from": 62, "to": 0},
              {"from": 63, "to": 64},
              {"from": 64, "to": 62},
              {"from": 65, "to": 53},
              {"from": 66, "to": 67}
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
