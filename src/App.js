import React from "react";
import { useDrag } from "./Drag";
import { useDrop } from "./Drop";
import "./styles.css";

export default function App() {
  return (
    <div className="wrapper">
      <div className="dragList">
        <Item type="item" />
        <Item type="item" />
        <Item type="item" />
        <Item type="item" />
        <Item type="item" />
        <Item type="clothe" />
        <Item type="clothe" />
        <Item type="clothe" />
        <Item type="clothe" />
        <Item type="clothe" />
      </div>
      <Drop accept="item" targetData="items" />
      <Drop accept="clothe" targetData="clothes" />
    </div>
  );
}

function Item(props) {
  const { isDragging, drag } = useDrag({
    type: props.type,
    sourceData: { type: props.type }
  });
  return (
    <div
      ref={drag}
      className="cell"
      style={{
        opacity: isDragging ? 0.5 : 1
      }}
    >
      {props.type}
    </div>
  );
}

function Drop(props) {
  const { isOver, canDropped, drop } = useDrop({
    accept: props.accept,
    handlerDrop: (source, target) => {
      console.log(source, target);
    },
    targetData: props.targetData
  });

  return (
    <div
      className="dropList"
      ref={drop}
      style={isOver || canDropped ? { position: "relative" } : {}}
    >
      {[...Array(35)].map((x, i) => (
        <div
          className="cell"
          key={i}
          style={
            isOver || canDropped ? { position: "relative", zIndex: 2 } : {}
          }
        />
      ))}
      {canDropped && isOver && <Overlay color="green" />}
      {canDropped && !isOver && <Overlay color="blue" />}
      {!canDropped && isOver && <Overlay color="red" />}
    </div>
  );
}

function Overlay(props) {
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 1,
        backgroundColor: props.color
      }}
    />
  );
}
