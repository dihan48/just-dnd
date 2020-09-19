import { useState } from "react";
import { initedDrops, currentDrop } from "./Drop";

const mousePos = { x: 0, y: 0 };
export const currentDrag = { type: null };

let currentHandlerMouseUp = () => {};
let currentDragUpdate = () => {};

function handlerMouseUp(event) {
  currentHandlerMouseUp(event);
}

function handlerMouseMove(event) {
  event.preventDefault();
  mousePos.x = event.clientX;
  mousePos.y = event.clientY;
}

function dragUpdate() {
  currentDragUpdate();
  window.requestAnimationFrame(dragUpdate);
}

document.addEventListener("mousemove", handlerMouseMove);
document.addEventListener("mouseup", handlerMouseUp);
window.requestAnimationFrame(dragUpdate);

export function useDrag(props) {
  const sourceData = props.sourceData ? props.sourceData : null;
  const type = props.type ? props.type : null;

  const [isDragging, setIsDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [preview, setPreview] = useState(null);
  const [isAddEventMouseDown, setIsAddEventMouseDown] = useState(false);

  if (preview) {
    currentDragUpdate = () => {
      preview.style.transform = `translate(${mousePos.x - offsetX}px, ${
        mousePos.y - offsetY
      }px)`;
    };
  } else {
    currentDragUpdate = () => {};
  }

  const removePreview = () => {
    preview.remove();
    setPreview(null);
  };

  currentHandlerMouseUp = (event) => {
    event.preventDefault();

    if (currentDrop.accept && type === currentDrop.accept) {
      currentDrop.handlerDrop &&
        currentDrop.handlerDrop(sourceData, currentDrop.targetData);
    }

    initedDrops.forEach((drop) => {
      if (drop.accept && drop.accept === type) {
        drop.setCanDropped(false);
        drop.setIsOver(false);
      }
      drop.setCurrentDrag(null);
    });

    preview && removePreview();

    currentDrag.type = null;

    currentDrop.accept = null;
    currentDrop.handlerDrop = null;
    currentDrop.targetData = null;

    setPreview(null);
    setIsDragging(false);
    setOffsetX(0);
    setOffsetY(0);
  };

  const drag = (element) => {
    if (element && !isAddEventMouseDown) {
      element.addEventListener("mousedown", handlerMouseDown);
      setIsAddEventMouseDown(true);
    }
  };

  function handlerMouseDown(event) {
    event.preventDefault();

    initedDrops.forEach((drop) => {
      drop.setCurrentDrag(sourceData);

      if (drop.accept && drop.accept === type) {
        drop.setCanDropped(true);
      }
    });

    setIsDragging(true);
    currentDrag.type = type;

    preview && removePreview();

    const rect = event.currentTarget.getBoundingClientRect();
    setOffsetX(event.clientX - rect.left);
    setOffsetY(event.clientY - rect.top);

    let previewNode = event.currentTarget.cloneNode(true);

    previewNode.style.position = "fixed";
    previewNode.style.left = 0;
    previewNode.style.top = 0;
    previewNode.style.opacity = 0.5;
    previewNode.style.zIndex = 100;
    previewNode.style.pointerEvents = "none";

    document.body.appendChild(previewNode);
    setPreview(previewNode);
  }

  return { isDragging, drag };
}
