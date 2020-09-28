import { useState, useEffect, useRef } from "react";
import { state, drops } from "./State";

export const initedDrops = [];

export function useDrop(props) {
  const latestProps = useRef(props);
  useEffect(() => {
    latestProps.current = props;
  });

  const customCanDrop = props.customCanDrop ? props.customCanDrop : null;
  const drop = useRef(null);

  const [isOver, setIsOver] = useState(false);
  const [canDrop, setCanDrop] = useState(false);

  useEffect(() => {
    let id =
      drops.push({ drop, setIsOver, setCanDrop, ...latestProps.current }) - 1;

    function handlerMouseEnter(event) {
      if (
        state.currentDrag &&
        state.currentDrag.drag &&
        state.currentDrag.drag.current
      ) {
        state.currentDrop = {
          drop,
          setIsOver,
          setCanDrop,
          ...latestProps.current
        };
        setIsOver(true);
      }
    }
    function handlerMouseLeave(event) {
      if (
        state.currentDrop &&
        state.currentDrop.drop &&
        state.currentDrop.drop === drop
      )
        state.currentDrop = null;
      setIsOver(false);
    }

    drop.current.addEventListener("mouseenter", handlerMouseEnter);
    drop.current.addEventListener("mouseleave", handlerMouseLeave);
    const currentDrop = drop.current;

    return () => {
      drops.splice(id, 1);

      currentDrop.removeEventListener("mouseenter", handlerMouseEnter);
      currentDrop.removeEventListener("mouseleave", handlerMouseLeave);
    };
  }, []);

  if (customCanDrop) {
    if (
      customCanDrop(state.currentDrag, {
        drop,
        setIsOver,
        setCanDrop,
        ...props
      })
    ) {
      return [{ isOver, canDrop }, drop];
    } else {
      return [{ isOver: false, canDrop: false }, drop];
    }
  }

  return [{ isOver, canDrop }, drop];
}
