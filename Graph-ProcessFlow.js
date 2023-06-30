
<?xml version="1.0"?>
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:m="sap.m"
	xmlns="sap.suite.ui.commons"
	controllerName="sap.suite.ui.commons.sample.ProcessFlowConnectionLabels.ProcessFlow">
	<m:Panel>
		<m:Label text="Process Flow Graph" />
		<m:HBox renderType="Bare">
			<m:Button text="Zoom In" press="onZoomIn" />
			<m:Button text="Zoom Out" press="onZoomOut" />
			<m:ToggleButton
				text="Toggle Connection Labels"
				pressed="true"
				press="onHideConnectionLabels" />
			<m:ToggleButton
				text="Toggle Highlighted Path"
				press="onHighlightPath" />
			<m:Button text="Reset Selected Path" press="onResetSelection" />
		</m:HBox>
		<ProcessFlow
			id="processflow1"
			showLabels="true"
			scrollable="false"
			foldedCorners="true"
			wheelZoomable="false"
			nodePress="onNodePress"
			labelPress="onLabelPress"
			nodeTitlePress="onNodeTitlePress"
			<nodes>
				<ProcessFlowNode
                    key="{' + widgetName +'>key}" title="{' + widgetName + '>title}" icon="{' + widgetName + '>icon}" group="{' + widgetName + '>group}" attributes="{' + widgetName + '>attributes}" status="{'+ widgetName + '>status}" x="{' + widgetName + '>x}" y="{' + widgetName + '>y}"  width="auto" maxWidth="500"
					laneId="{lane}"
					nodeId="{id}"
					title="{title}"
					titleAbbreviation="{titleAbbreviation}"
                    children="{children, formatter:'.formatConnectionLabels'}"
					state="{state}"
					stateText="{stateText}"
					texts="{texts}"
					highlighted="{highlighted}"
					focused="{focused}"
					type="{type}" />
			</nodes>
			<lanes>
				<ProcessFlowLaneHeader
					laneId="{id}"
					iconSrc="{icon}"
					text="{label}"
					position="{position}" />
			</lanes>
		</ProcessFlow>
	</m:Panel>
	<m:Panel>
		<m:Label text="Process Flow sample (simple) with zooming buttons - scrollable" />
		<m:HBox renderType="Bare">
			<m:Button text="Zoom In" press="onZoomInS" />
			<m:Button text="Zoom Out" press="onZoomOutS" />
			<m:ToggleButton
				text="Toggle Highlighted Path"
				press="onHighlightPathS" />
		</m:HBox>
		<ProcessFlow
			id="processflow2"
			showLabels="true"
			nodePress="onNodePress"
			labelPress="onLabelPress"
			nodes="{/nodes}"
			lanes="{/lanes}">
			<nodes>
				<ProcessFlowNode
				    key="{' + widgetName +'>key}" title="{' + widgetName + '>title}" icon="{' + widgetName + '>icon}" group="{' + widgetName + '>group}" attributes="{' + widgetName + '>attributes}" status="{'+ widgetName + '>status}" x="{' + widgetName + '>x}" y="{' + widgetName + '>y}"  width="auto" maxWidth="500"
					laneId="{lane}"
					nodeId="{id}"
					titleAbbreviation="{titleAbbreviation}"
                    children="{children, formatter:'.formatConnectionLabels'}"
					state="{state}"
					stateText="{stateText}"
					texts="{texts}"
					highlighted="{highlighted}"
					focused="{focused}"
					type="{type}" />
			</nodes>
			<lines>
                <Line from="{' + widgetName + '>from}" to="{' + widgetName + '>to}" status="{' + widgetName + '>status}" arrowOrientation="ParentOf" arrowPosition="Middle" press="linePress"/>
              </lines>
            <lanes>
				<ProcessFlowLaneHeader
					laneId="{id}"
					iconSrc="{icon}"
					text="{label}"
					position="{position}" />
			</lanes>
		</ProcessFlow>
	</m:Panel>
</mvc:View>
</script>
