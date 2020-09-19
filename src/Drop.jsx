import { useState, useEffect } from "react";

export const initedDrops = [];
export const currentDrop = {
  accept: null,
  handlerDrop: null,
  targetData: null
};

export function useDrop(props) {
  const accept = props && props.accept ? props.accept : null;
  const handlerDrop = props && props.handlerDrop ? props.handlerDrop : null;
  const targetData = props && props.targetData ? props.targetData : null;

  const [isOver, setIsOver] = useState(false);
  const [canDropped, setCanDropped] = useState(false);
  const [isAddEventMouseEnter, setIsAddEventMouseEnter] = useState(false);
  const [initIndex, setInitIndex] = useState(-1);
  const [currentDrag, setCurrentDrag] = useState(null);
  const [mouseEvents, setMouseEvents] = useState(null);

  useEffect(() => {
    if (initIndex === -1) {
      setInitIndex(
        initedDrops.push({
          accept,
          setCanDropped,
          setIsOver,
          setCurrentDrag,
          handlerDrop,
          targetData
        }) - 1
      );
    } else {
      initedDrops[initIndex] = {
        accept,
        setCanDropped,
        setIsOver,
        setCurrentDrag,
        handlerDrop,
        targetData
      };
    }
    return () => {
      if (initIndex !== -1) {
        initedDrops[initIndex] = null;
      }
    };
  }, [initIndex, accept, handlerDrop, targetData]);

  function handlerMouseEnter(event) {
    setIsOver(true);
    setCurrentDrop(true);
  }

  function handlerMouseLeave(event) {
    setIsOver(false);
    setCurrentDrop(false);
  }

  function setCurrentDrop(isSet) {
    if (isSet) {
      currentDrop.accept = accept;
      currentDrop.handlerDrop = handlerDrop;
      currentDrop.targetData = targetData;
    } else {
      currentDrop.accept = null;
      currentDrop.handlerDrop = null;
      currentDrop.targetData = null;
    }
  }

  const drop = (element) => {
    if (!isAddEventMouseEnter && element && currentDrag) {
      const mouseenter = new MouseEvents(
        element,
        "mouseenter",
        handlerMouseEnter
      );
      const mouseleave = new MouseEvents(
        element,
        "mouseleave",
        handlerMouseLeave
      );

      setMouseEvents({ mouseenter, mouseleave });

      setIsAddEventMouseEnter(true);
    }
    if (isAddEventMouseEnter && element && !currentDrag) {
      if (mouseEvents) {
        mouseEvents.mouseenter.remove();
        mouseEvents.mouseleave.remove();
        setIsOver(false);
        setCanDropped(false);
      }
      setIsAddEventMouseEnter(false);
    }
  };

  return { isOver, canDropped, drop, currentDrag };
}

class MouseEvents {
  constructor(element, eventName, handler) {
    this.element = element;
    this.eventName = eventName;
    this.handler = handler;

    this.element.addEventListener(this.eventName, this.handler);
  }
  remove() {
    this.element.removeEventListener(this.eventName, this.handler);
  }
}
