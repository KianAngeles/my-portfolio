import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-xl border border-white bg-black [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const makeDragState = () => ({
  active: false,
  startX: 0,
  startY: 0,
  pointerId: null,
  isDragging: false
});

const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  onActiveCardChange,
  manualAdvanceSignal,
  containerClassName,
  skewAmount = 6,
  easing = 'elastic',
  children
}) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const swapRef = useRef(() => {});
  const swapBackwardRef = useRef(() => {});
  const pauseAutoRef = useRef(() => {});
  const resumeAutoRef = useRef(() => {});
  const isSwappingRef = useRef(false);
  const isHoveringRef = useRef(false);
  const dragStateRef = useRef(makeDragState());
  const suppressClickRef = useRef(false);
  const prevManualAdvanceSignalRef = useRef(manualAdvanceSignal);

  const tlRef = useRef(null);
  const intervalRef = useRef();
  const container = useRef(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));
    onActiveCardChange?.(order.current[0]);

    const clearAuto = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };

    const animateToOrder = (nextOrder, duration = config.durMove) => {
      if (nextOrder.length < 2 || isSwappingRef.current) return;
      isSwappingRef.current = true;

      const tl = gsap.timeline();
      tlRef.current = tl;

      nextOrder.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 0);
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration,
            ease: config.ease
          },
          0
        );
      });

      tl.call(() => {
        order.current = nextOrder;
        onActiveCardChange?.(order.current[0]);
      });
      tl.eventCallback('onComplete', () => {
        isSwappingRef.current = false;
      });
    };

    const swapNext = () => {
      if (order.current.length < 2 || isSwappingRef.current) return;
      isSwappingRef.current = true;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(() => {
        gsap.set(elFront, { zIndex: backSlot.zIndex });
      }, undefined, 'return');
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
        onActiveCardChange?.(order.current[0]);
      });
      tl.eventCallback('onComplete', () => {
        isSwappingRef.current = false;
      });
    };

    const swapBackward = () => {
      if (order.current.length < 2) return;
      const currentOrder = order.current;
      const last = currentOrder[currentOrder.length - 1];
      const remaining = currentOrder.slice(0, -1);
      const nextOrder = [last, ...remaining];
      animateToOrder(nextOrder);
    };

    const startAuto = () => {
      clearAuto();
      intervalRef.current = window.setInterval(swapNext, delay);
    };

    swapRef.current = swapNext;
    swapBackwardRef.current = swapBackward;
    pauseAutoRef.current = () => {
      clearAuto();
    };
    resumeAutoRef.current = () => {
      if (!pauseOnHover || !isHoveringRef.current) {
        startAuto();
      }
    };

    swapNext();
    startAuto();

    const node = container.current;
    const pauseOnHoverEnter = () => {
      isHoveringRef.current = true;
      tlRef.current?.pause();
      clearAuto();
    };
    const resumeOnHoverLeave = () => {
      isHoveringRef.current = false;
      tlRef.current?.play();
      startAuto();
    };

    if (pauseOnHover && node) {
      node.addEventListener('mouseenter', pauseOnHoverEnter);
      node.addEventListener('mouseleave', resumeOnHoverLeave);
    }

    return () => {
      if (pauseOnHover && node) {
        node.removeEventListener('mouseenter', pauseOnHoverEnter);
        node.removeEventListener('mouseleave', resumeOnHoverLeave);
      }
      clearAuto();
      swapRef.current = () => {};
      swapBackwardRef.current = () => {};
      pauseAutoRef.current = () => {};
      resumeAutoRef.current = () => {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, onActiveCardChange]);

  useEffect(() => {
    if (prevManualAdvanceSignalRef.current === manualAdvanceSignal) return;
    prevManualAdvanceSignalRef.current = manualAdvanceSignal;
    swapRef.current?.();
  }, [manualAdvanceSignal]);

  const handlePointerDown = e => {
    if (e.button !== undefined && e.button !== 0) return;
    dragStateRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      pointerId: e.pointerId,
      isDragging: false
    };
    container.current?.setPointerCapture?.(e.pointerId);
    pauseAutoRef.current?.();
  };

  const handlePointerMove = e => {
    const state = dragStateRef.current;
    if (!state.active) return;

    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    if (!state.isDragging && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      state.isDragging = true;
    }
  };

  const finalizeSwipe = e => {
    const state = dragStateRef.current;
    if (!state.active) return;

    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    const swipeThreshold = 48;
    const isHorizontalSwipe = Math.abs(dx) > swipeThreshold && Math.abs(dx) > Math.abs(dy);

    if (isHorizontalSwipe) {
      suppressClickRef.current = true;
      if (dx < 0) {
        swapRef.current?.();
      } else {
        swapBackwardRef.current?.();
      }
    }

    try {
      if (state.pointerId !== null) {
        container.current?.releasePointerCapture?.(state.pointerId);
      }
    } catch {
      // no-op
    }

    dragStateRef.current = makeDragState();
    resumeAutoRef.current?.();
  };

  const handlePointerCancel = () => {
    dragStateRef.current = makeDragState();
    resumeAutoRef.current?.();
  };

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: e => {
            if (suppressClickRef.current) {
              suppressClickRef.current = false;
              e.preventDefault();
              e.stopPropagation();
              return;
            }
            child.props.onClick?.(e);
            onCardClick?.(i);
          }
        })
      : child
  );

  return (
    <div
      ref={container}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finalizeSwipe}
      onPointerCancel={handlePointerCancel}
      className={`absolute bottom-0 right-0 transform translate-x-[5%] translate-y-[20%] origin-bottom-right perspective-[900px] overflow-visible [touch-action:pan-y] max-[768px]:translate-x-[25%] max-[768px]:translate-y-[25%] max-[768px]:scale-[0.75] max-[480px]:translate-x-[25%] max-[480px]:translate-y-[25%] max-[480px]:scale-[0.55] ${containerClassName ?? ''}`.trim()}
      style={{ width, height }}>
      {rendered}
    </div>
  );
};

export default CardSwap;
