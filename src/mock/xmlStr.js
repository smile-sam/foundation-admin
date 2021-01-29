export var xmlStr = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:flowable="http://flowable.org/bpmn" targetNamespace="http://www.flowable.org/processdef">

  <bpmndi:BPMNDiagram id="BPMNDiagram_process">
    <bpmndi:BPMNPlane id="BPMNPlane_process" bpmnElement="Leave">
      <bpmndi:BPMNEdge id="BPMNEdge_rejectFlow" bpmnElement="rejectFlow">
        <omgdi:waypoint x="631.866093577786" y="142.36609357778607" />
        <omgdi:waypoint x="631.5931090276993" y="101.32067323657485" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="BPMNEdge_flowEnd" bpmnElement="flowEnd">
        <omgdi:waypoint x="651.49994" y="162" />
        <omgdi:waypoint x="696.5002839785394" y="162.0891701657418" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="BPMNEdge_jugdeFlow" bpmnElement="jugdeFlow">
        <omgdi:waypoint x="565" y="162.21367521367523" />
        <omgdi:waypoint x="611.9141630901288" y="162.41416309012877" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="BPMNEdge_flowStart" bpmnElement="flowStart">
        <omgdi:waypoint x="243.2256558149128" y="162" />
        <omgdi:waypoint x="304.60807973558974" y="162" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="BPMNEdge_modeFlow" bpmnElement="modeFlow">
        <omgdi:waypoint x="404.60807973558974" y="162" />
        <omgdi:waypoint x="465" y="162" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="BPMNShape_leaveTask" bpmnElement="leaveTask">
        <omgdc:Bounds x="304.60807973558974" y="122.00000000000001" width="100" height="79.99999999999999" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_managerTask" bpmnElement="managerTask">
        <omgdc:Bounds x="465" y="122" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_managerJudgeTask" bpmnElement="managerJudgeTask" isMarkerVisible="true">
        <omgdc:Bounds x="611.5" y="142" width="40" height="40" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_endLeave" bpmnElement="endLeave">
        <omgdc:Bounds x="696.5" y="148" width="28" height="28" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_startLeave" bpmnElement="startLeave">
        <omgdc:Bounds x="213.2256558149128" y="147" width="30" height="30" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_endLeave2" bpmnElement="endLeave2">
        <omgdc:Bounds x="617.5" y="73.32098285753572" width="28" height="28" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
`;
