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
                    "key": 0,
                    "title": "Abschieber",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 1,
                    "title": "Füller",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 2,
                    "title": "Dosendeckelzufuhr",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 3,
                    "title": "Variopac",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 4,
                    "title": "Paker Packer",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
            
                },{
                    "key": 5,
                    "title": "Belader",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 6,
                    "title": "TBB-EG01",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 7,
                    "title": "TBB-EG02",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 8,
                    "title": "TBB-EG03",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 9,
                    "title": "TBB-EG04",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 10,
                    "title": "TBB-EG05",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 11,
                    "title": "TBB-EG06",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },
                {
                    "key": 12,
                    "title": "TBB-EG07  ",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 13,
                    "title": "TBG-EG01",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 14,
                    "title": "TBG-EG02",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 15,
                    "title": "TBG-EG03",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 16,
                    "title": "TBG-EG04",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 17,
                    "title": "TBP-IN-EG01",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 18,
                    "title": "TBP-IN-EG02",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 19,
                    "title": "TBP-OUT-EG01",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 20,
                    "title": "TBP-OUT-EG02",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 21,
                    "title": "TBP-OUT-EG03",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 22,
                    "title": "TBP-OUT-EG04",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 23,
                    "title": "TBP-OUT-EG05",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 24,
                    "title": "TBP-OUT-EG06",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 25,
                    "title": "Extern-Abgabe Palette Belader voll",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 26,
                    "title": "Extern-Aufgabe Palette Belader leer",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 27,
                    "title": "Extern-Aufgabe Vollpalette",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 28,
                    "title": "Extern-Aufgabe Vollpalette",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 29,
                    "title": "Extern-Abgabe Palette Belader defekt",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 30,
                    "title": "EXTERN06",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 31,
                    "title": "EXTERN07",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 32,
                    "title": "EXTERN08",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 33,
                    "title": "EXTERN09",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 34,
                    "title": "EXTERN010",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                },{
                    "key": 35,
                    "title": "EXTERN011",
                    "attributes": [
                        {
                            "label": "Technical Availability",
                            "value": "%"
                        }
                    ]
                }
            ],
  
          
            "lines": [
                {"from": 0, "to": 1},
                {"from": 1, "to": 2},
                {"from": 2, "to": 3},
                {"from": 3, "to": 4},
                {"from": 4, "to": 5},
                {"from": 5, "to": 6},
                {"from": 6, "to": 7},
                {"from": 7, "to": 8},
                {"from": 8, "to": 9},
                {"from": 9, "to": 10},
                {"from": 10, "to": 11},
                {"from": 11, "to": 12},
                {"from": 12, "to": 13},
                {"from": 13, "to": 14},
                {"from": 14, "to": 15},
                {"from": 15, "to": 16},
                {"from": 16, "to": 17},
                {"from": 17, "to": 18},
                {"from": 18, "to": 19},
                {"from": 19, "to": 20},
                {"from": 20, "to": 21},
                {"from": 21, "to": 22},
                {"from": 22, "to": 23},
                {"from": 23, "to": 24},
                {"from": 24, "to": 25},
                {"from": 25, "to": 26},
                {"from": 26, "to": 27},
                {"from": 27, "to": 28},
                {"from": 28, "to": 29},
                {"from": 29, "to": 30},
                {"from": 30, "to": 31},
                {"from": 31, "to": 32},
                {"from": 32, "to": 33},
                {"from": 33, "to": 34},
                {"from": 34, "to": 35},
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
