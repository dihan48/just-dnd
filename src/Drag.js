import { useState, useEffect, useRef } from "react";
import { state, drags, drops } from "./State";

const root = document.documentElement;

const mousePos = { x: 0, y: 0 };

function handlerMouseMove(event) {
  event.preventDefault();
  mousePos.x = event.clientX;
  mousePos.y = event.clientY;
}

function dragUpdate() {
  if (state.currentDrag) {
    currentDragUpdate();
    window.requestAnimationFrame(dragUpdate);
  } else {
    root.removeEventListener("mousemove", handlerMouseMove);
  }
}

function currentDragUpdate() {
  if (state.preview) {
    state.preview.style.left = `${mousePos.x - state.preview.offsetX}px`;
    state.preview.style.top = `${mousePos.y - state.preview.offsetY}px`;
  }
}

root.addEventListener("mouseup", handlerMouseUp);
function handlerMouseUp(event) {
  event.preventDefault();
  root.removeEventListener("mousemove", handlerMouseMove);

  if (!state.currentDrag) return;

  state.preview && removePreview();

  state.currentDrag && state.currentDrag.setIsDragging(false);

  if (
    state.currentDrop &&
    state.currentDrop.handlerDrop &&
    validType(
      state.currentDrop.accept,
      state.currentDrag.latestProps.current.type
    )
  ) {
    state.currentDrop.handlerDrop(state.currentDrag, state.currentDrop);
  }

  drops.forEach((item) => {
    item.setIsOver(false);
    item.setCanDrop(false);
  });

  state.currentDrag = null;
}

function removePreview() {
  if (state.preview) {
    state.preview.remove();
    state.preview = null;
  }
}

function validType(accept, type) {
  if (!accept || !type) return false;

  if (Array.isArray(accept)) {
    if (accept.indexOf(type) !== -1) {
      return true;
    } else {
      return false;
    }
  } else {
    if (accept === type) {
      return true;
    } else {
      return false;
    }
  }
}

function createPreview(event) {
  state.preview && removePreview();

  let previewNode = event.currentTarget.cloneNode(true);

  previewNode.style.position = "fixed";
  previewNode.style.left = 0;
  previewNode.style.top = 0;
  previewNode.style.opacity = 0.5;
  previewNode.style.zIndex = 100;
  previewNode.style.pointerEvents = "none";

  document.body.appendChild(previewNode);
  state.preview = previewNode;

  const rect = event.currentTarget.getBoundingClientRect();
  state.preview.offsetX = event.clientX - rect.left;
  state.preview.offsetY = event.clientY - rect.top;
}

export function useDrag(props) {
  const drag = useRef(null);

  const latestProps = useRef(props);
  useEffect(() => {
    latestProps.current = props;
  });

  const [uid] = useState({});
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (drag && drag.current) {
      const dragCurrent = drag.current;

      const inDrags = drags.some((item) => {
        return item.uid === uid;
      });

      if (inDrags === false) {
        const currentDrag = { uid, drag, setIsDragging, latestProps };
        drags.push(currentDrag);

        const handlerMouseDown = (event) => {
          event.preventDefault();
          if (event.button !== 0) return;

          mousePos.x = event.clientX;
          mousePos.y = event.clientY;

          root.addEventListener("mousemove", handlerMouseMove);
          window.requestAnimationFrame(dragUpdate);

          setIsDragging(true);
          state.currentDrag = currentDrag;

          drops.forEach((dropItem) => {
            dropItem.setCanDrop(
              validType(dropItem.accept, latestProps.current.type)
            );
          });

          createPreview(event);
        };

        dragCurrent.addEventListener("mousedown", handlerMouseDown);
      }
    }
  }, [uid]);

  return [{ isDragging }, drag];
}
