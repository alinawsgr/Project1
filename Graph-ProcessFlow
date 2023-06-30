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
		  "x": 1800,
		  "y": 125,
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
	          "x": 400,
		  "y": 225,
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
		  "x": 1400,
		  "y": 225,
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
		  "x": 3500,
		  "y": 225,
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
		  "x": 3500,
		  "y": 825,
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
                  "x": 3500,
		  "y": 1225,
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
		  "x": 3500,
		  "y": 2025,
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
		  "x": 1400,
		  "y": 1425,
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
		  "x": 400,
		  "y": 1625,
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
		  "x": 400,
		  "y": 1425,
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
		  "x": 1400,
		  "y": 625,
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
		  "x": 3000,
		  "y": 625,
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
		  "x": 1600,
		  "y": 225,
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
		  "x": 1800,
		  "y": 225,
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
		  "x": 2000,
		  "y": 225,
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
		  "x": 2200,
		  "y": 125,
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
		  "x": 2200,
		  "y": 225,
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
		  "x": 2400,
		  "y": 225,
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
		  "x": 2600,
		  "y": 225,
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
		  "x": 2800,
		  "y": 0,
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
		  "x": 2800,
		  "y": 75,
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
		  "x": 2800,
		  "y": 150,
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
		  "x": 1800,
		  "y": 425,
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
		  "x": 2800,
		  "y": 225,
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
		  "x": 2800,
		  "y": 425,
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
		  "x": 3200,
		  "y": 425,
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
		  "x": 3000,
		  "y": 225,
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
		  "x": 3200,
		  "y": 225,
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
		  "x": 3500,
		  "y": 425,
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
		  "x": 3500,
		  "y": 625,
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
		  "x": 3500,
		  "y": 1025,
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
		  "x": 3100,
		  "y": 1225,
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
		  "x": 3500,
		  "y": 1425,
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
		  "x": 3500,
		  "y": 1625,
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
		  "x": 3500,
		  "y": 1825,
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
		  "x": 3300,
		  "y": 2025,
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
		  "x": 3100,
		  "y": 1625,
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
		  "x": 3100,
		  "y": 2025,
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
		  "x": 650,
		  "y": 225,
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
		  "x": 900,
		  "y": 225,
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
		  "x": 1150,
		  "y": 225,
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
		  "x": 1400,
		  "y": 425,
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
		  "x": 1400,
		  "y": 825,
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
		  "x": 1400,
		  "y": 1025,
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
		  "x": 1200,
		  "y": 1425,
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
		  "x": 1000,
		  "y": 825,
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
		  "x": 1000,
		  "y": 1425,
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
		  "x": 800,
		  "y": 1625,
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
		  "x": 600,
		  "y": 1625,
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
		  "x": 800,
		  "y": 1425,
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
		  "x": 600,
		  "y": 1425,
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
		  "x": 1400,
		  "y": 1225,
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
		  "x": 200,
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
		  "x": 400,
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
		  "x": 400,
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
		  "x": 400,
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
		  "x": 400,
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
		  "x": 400,
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
		  "x": 200,
	          "y": 1625,
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
		  "x": 0,
		  "y": 1625,
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
		  "x": 1800,
		  "y": 0,
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },   
		  {
                  key: 63,
                  title: "TBP1-EG",
		  "x": 1600,
		  "y": 125 ,
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                }, 
		  {
                  key: 64,
                  title: "Carbo",
		  "x": 3900,
		  "y": 1100 ,
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                }, 
		  {
                  key: 65,
                  title: "KZE",
		  "x": 4200,
		  "y": 1000 ,
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                }, 
		  {
                  key: 66,
                  title: "Mixer",
		  "x": 4000,
		  "y": 1300 ,
                  attributes: [
                    {
                      label: "Technical Availability",
                      value: "%"
                    }
                  ]
                },
		  {
                  key: 67,
                  title: "CIP",
		  "x": 4000,
		  "y": 1500 ,
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
	      {"from": 0, "to": 62},
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
	      {"from": 37, "to": 38},
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
	      {"from": 63, "to": 0},
	      {"from": 64, "to": 6},
	      {"from": 66, "to": 6},
	      {"from": 65, "to": 64},
	      {"from": 65, "to": 66},
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
            div0.innerHTML = '<?xml version="1.0"?><mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.suite.ui.commons" controllerName="sap.suite.ui.commons.sample.ProcessFlowConnectionLabels.ProcessFlow"><m:Panel><m:Label text="Process Flow Graph"/><m:HBox renderType="Bare"><m:Button text="Zoom In" press="onZoomIn"/><m:Button text="Zoom Out" press="onZoomOut"/><m:ToggleButton text="Toggle Connection Labels" pressed="true" press="onHideConnectionLabels"/><m:ToggleButton text="Toggle Highlighted Path" press="onHighlightPath"/><m:Button text="Reset Selected Path" press="onResetSelection"/></m:HBox><ProcessFlow id="processflow1" showLabels="true" scrollable="false" foldedCorners="true" wheelZoomable="false" nodePress="onNodePress" labelPress="onLabelPress" nodeTitlePress="onNodeTitlePress"><nodes><ProcessFlowNode key="{' + widgetName +'>key}" title="{' + widgetName + '>title}" icon="{' + widgetName + '>icon}" group="{' + widgetName + '>group}" attributes="{' + widgetName + '>attributes}" status="{'+ widgetName + '>status}" x="{' + widgetName + '>x}" y="{' + widgetName + '>y}" width="auto" maxWidth="500" laneId="{lane}" nodeId="{id}" title="{title}" titleAbbreviation="{titleAbbreviation}" state="{state}" stateText="{stateText}" texts="{texts}" highlighted="{highlighted}" focused="{focused}" type="{type}" /></nodes><lanes><ProcessFlowLaneHeader laneId="{id}" iconSrc="{icon}" text="{label}" position="{position}" /></lanes></ProcessFlow></m:Panel><m:Panel><m:Label text="Process Flow sample (simple) with zooming buttons - scrollable"/><m:HBox renderType="Bare"><m:Button text="Zoom In" press="onZoomInS"/><m:Button text="Zoom Out" press="onZoomOutS"/><m:ToggleButton text="Toggle Highlighted Path" press="onHighlightPathS"/></m:HBox><ProcessFlow id="processflow2" showLabels="true" nodePress="onNodePress" labelPress="onLabelPress" nodes="{/nodes}" lanes="{/lanes}"><nodes><ProcessFlowNode key="{' + widgetName +'>key}" title="{' + widgetName + '>title}" icon="{' + widgetName + '>icon}" group="{' + widgetName + '>group}" attributes="{' + widgetName + '>attributes}" status="{'+ widgetName + '>status}" x="{' + widgetName + '>x}" y="{' + widgetName + '>y}" width="auto" maxWidth="500" laneId="{lane}" nodeId="{id}" titleAbbreviation="{titleAbbreviation}" state="{state}" stateText="{stateText}" texts="{texts}" highlighted="{highlighted}" focused="{focused}" type="{type}" /></nodes><lines><Line from="{' + widgetName + '>from}" to="{' + widgetName + '>to}" status="{' + widgetName + '>status}" arrowOrientation="ParentOf" arrowPosition="Middle" press="linePress"/></lines><lanes><ProcessFlowLaneHeader laneId="{id}" iconSrc="{icon}" text="{label}" position="{position}" /></lanes></ProcessFlow></m:Panel></mvc:View></script>';


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
            sap.ui.define(['jquery.sap.global', 'sap/suite/ui/commons/library', 'sap/m/library', 'sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/ui/Device', 'sap/m/MessageToast',
	'sap/suite/ui/commons/ProcessFlowConnectionLabel', 'sap/m/StandardListItem', 'sap/m/Button', 'sap/m/List', 'sap/m/ResponsivePopover'],
	function(jQuery, SuiteLibrary, MobileLibrary, Controller, JSONModel, Device, MessageToast, ProcessFlowConnectionLabel, StandardListItem, Button, List, ResponsivePopover) {
	"use strict";

	return Controller.extend("sap.suite.ui.commons.sample.ProcessFlowConnectionLabels.ProcessFlow", {

		//-----------------------------------------------------------------------------------------------------------------------------
		// Global Properties
		//-----------------------------------------------------------------------------------------------------------------------------

		aConnections: null, // Required to access elements in callback since they are coming from oEvent.
		sContainerId: "", // Required in order to access the right container

		//-----------------------------------------------------------------------------------------------------------------------------
		// Event Handlers
		//-----------------------------------------------------------------------------------------------------------------------------

		onInit: function() {
			var sDataPath,
				oModel,
				oModel2;
			oModel = new JSONModel();
			sDataPath = sap.ui.require.toUrl("sap/suite/ui/commons/sample/ProcessFlowConnectionLabels/ProcessFlowLanesAndNodesWithLabels.json");
			oModel.loadData(sDataPath);
			var oView = this.getView();

			this.oProcessFlow1 = oView.byId("processflow1");
			this.oProcessFlow1.setModel(oModel);

			oModel2 = new JSONModel();
			sDataPath = sap.ui.require.toUrl("sap/suite/ui/commons/sample/ProcessFlowConnectionLabels/ProcessFlowScrollableLanesAndNodesWithLabels.json");
			oModel2.loadData(sDataPath);

			this.oProcessFlow2 = oView.byId("processflow2");
			this.oProcessFlow2.setModel(oModel2);

			oModel.attachRequestCompleted(this.oProcessFlow1.updateModel.bind(this.oProcessFlow1));
			oModel2.attachRequestCompleted(this.oProcessFlow2.updateModel.bind(this.oProcessFlow2));
		},

		onLabelPress: function(oEvent) {
			this.aConnections = oEvent.getParameter("connections");
			this.sContainerId = oEvent.getSource().getId().split("-")[2];
			var oSelectedLabel = oEvent.getParameter("selectedLabel");
			var oListData = this._getListData(this.aConnections);
			var oItemTemplate = new StandardListItem({ title: "{title}", info: "{info}" });
			var oList = this._createList(oListData, oItemTemplate);

			var oResponsivePopover;

			var oBeginButton = new Button({
				text: "Action1",
				type: MobileLibrary.ButtonType.Reject,
				press: function() {
					oResponsivePopover.setShowCloseButton(false);
				}
			});

			var oEndButton = new Button({
				text: "Action2",
				type: MobileLibrary.ButtonType.Accept,
				press: function() {
					oResponsivePopover.setShowCloseButton(true);
				}
			});

			oResponsivePopover = sap.ui.getCore().byId("__popover") || new ResponsivePopover("__popover", {
				placement: MobileLibrary.PlacementType.Auto,
				title: "Paths[" + this.aConnections.length + "]",
				content: [ oList ],
				showCloseButton: false,
				afterClose: function() {
					oResponsivePopover.destroy();
					this.getView().byId(this.sContainerId).setFocusToLabel(oSelectedLabel);
				}.bind(this),
				beginButton: oBeginButton,
				endButton: oEndButton
			});

			if (Device.system.phone) {
				oResponsivePopover.setShowCloseButton(true);
			}
			oResponsivePopover.openBy(oSelectedLabel);
		},

		onListItemPress: function(oEvent) {
			var selectedItem = oEvent.getParameter("listItem");
			var aSourceTarget = selectedItem.getInfo().split("-");
			var sSourceId = aSourceTarget[0];
			var sTargetId = aSourceTarget[1];
			this._getItemBySourceAndTargetId(sSourceId, sTargetId);
		},

		onHideConnectionLabels: function() {
			if (this.oProcessFlow1.getShowLabels()) {
				this.oProcessFlow1.setShowLabels(false);
			} else {
				this.oProcessFlow1.setShowLabels(true);
			}
		},

		onOnError: function(oEvent) {
			var sDisplay = "Exception happened: ";
			sDisplay += oEvent.getParameters().text;
			MessageToast.show(sDisplay);
		},

		onZoomIn: function() {
			this.oProcessFlow1.zoomIn();
			this.oProcessFlow1.getZoomLevel();
			MessageToast.show("Zoom level changed to: " + this.oProcessFlow1.getZoomLevel());
		},

		onZoomOut: function() {
			this.oProcessFlow1.zoomOut();
			this.oProcessFlow1.getZoomLevel();
			MessageToast.show("Zoom level changed to: " + this.oProcessFlow1.getZoomLevel());
		},

		onNodePress: function(event) {
			MessageToast.show("Node " + event.getParameters().getNodeId() + " has been clicked.");
		},

		onHighlightPath: function() {
			var oProcessFlow = this.oProcessFlow1,
				oModel = oProcessFlow.getModel(),
				sDataPath;

			this._isHighlighted = !this._isHighlighted;
			if (this._isHighlighted) {
				sDataPath = sap.ui.require.toUrl("sap/suite/ui/commons/sample/ProcessFlowConnectionLabels/ProcessFlowLanesAndNodesWithLabelsHighlighted.json");
				MessageToast.show("Path has been highlighted.");
			} else {
				sDataPath = sap.ui.require.toUrl("sap/suite/ui/commons/sample/ProcessFlowConnectionLabels/ProcessFlowLanesAndNodesWithLabels.json");
				MessageToast.show("Path is no longer highlighted.");
			}
			oModel.loadData(sDataPath);
		},

		onResetSelection: function() {
			this.oProcessFlow1.setSelectedPath(null, null);
		},

		// ProcessFlow 2: Scrollable

		onZoomInS: function() {
			this.oProcessFlow2.zoomIn();

			MessageToast.show("Zoom level changed to: " + this.oProcessFlow2.getZoomLevel());
		},

		onZoomOutS: function() {
			this.oProcessFlow2.zoomOut();

			MessageToast.show("Zoom level changed to: " + this.oProcessFlow2.getZoomLevel());
		},

		onLabelPressS: function(oEvent) {
			var oSelectedLabel = oEvent.getParameter("selectedLabel");
			MessageToast.show("Label pressed: " + oSelectedLabel.getText());
		},

		onHighlightPathS: function() {
			var oProcessFlow = this.oProcessFlow2,
				oModel2 = oProcessFlow.getModel(),
				sDataPath;

			this._isHighlighted2 = !this._isHighlighted2;
			if (this._isHighlighted2) {
				sDataPath = sap.ui.require.toUrl("sap/suite/ui/commons/sample/ProcessFlowConnectionLabels/ProcessFlowScrollableLanesAndNodesWithLabelsHighlighted.json");
				MessageToast.show("Path has been highlighted.");
			} else {
				sDataPath = sap.ui.require.toUrl("sap/suite/ui/commons/sample/ProcessFlowConnectionLabels/ProcessFlowScrollableLanesAndNodesWithLabels.json");
				MessageToast.show("Path is no longer highlighted.");
			}
			oModel2.loadData(sDataPath);
		},

		//-----------------------------------------------------------------------------------------------------------------------------
		// Helpers
		//-----------------------------------------------------------------------------------------------------------------------------

		_createList: function(data, itemTemplate) {
			var oModel = new JSONModel();

			// Sets the data for the model
			oModel.setData(data);

			// Sets the model to the list
			var oTmpList = new List({
				mode: MobileLibrary.ListMode.SingleSelectMaster,
				selectionChange: this.onListItemPress.bind(this)
			});
			oTmpList.setModel(oModel);

			// Binds Aggregation
			oTmpList.bindAggregation("items", "/navigation", itemTemplate);

			return oTmpList;
		},

		_getListData: function() {
			var aNavigation = [];
			for (var i = 0; i < this.aConnections.length; i++) {
				aNavigation.push(this._createListEntryObject(this.aConnections[i]));
			}

			return {
				navigation: aNavigation
			};
		},

		_createListEntryObject: function(oConnection) {
			var sId = oConnection.sourceNode.getNodeId() + "-" + oConnection.targetNode.getNodeId();
			var sTitle = oConnection.label.getText();

			return {
				title: sTitle,
				info: sId,
				type: "Active"
			};
		},

		_getItemBySourceAndTargetId: function(sSourceId, sTargetId) {
			for (var i = 0; i < this.aConnections.length; i++) {
				if (this.aConnections[i].sourceNode.getNodeId() === sSourceId && this.aConnections[i].targetNode.getNodeId() === sTargetId) {
					this.getView().byId(this.sContainerId).setSelectedPath(sSourceId, sTargetId);
				}
			}
		},

		//-----------------------------------------------------------------------------------------------------------------------------
		// Formatters
		//-----------------------------------------------------------------------------------------------------------------------------

		formatConnectionLabels: function(childrenData) {
			var aChildren = [];
			for (var i = 0; childrenData &&  i < childrenData.length; i++) {
				if (childrenData[i].connectionLabel && childrenData[i].connectionLabel.id) {
					var oConnectionLabel = sap.ui.getCore().byId(childrenData[i].connectionLabel.id);
					if (!oConnectionLabel) {
						oConnectionLabel = new ProcessFlowConnectionLabel({
							id: childrenData[i].connectionLabel.id,
							text: childrenData[i].connectionLabel.text,
							enabled: childrenData[i].connectionLabel.enabled,
							icon: childrenData[i].connectionLabel.icon,
							state: childrenData[i].connectionLabel.state,
							priority: childrenData[i].connectionLabel.priority
						});
					}
					aChildren.push({
						nodeId: childrenData[i].nodeId,
						connectionLabel: oConnectionLabel
					});
				} else if (jQuery.type(childrenData[i]) === 'number'){
					aChildren.push(childrenData[i]);
				}
			}
			return aChildren;
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
