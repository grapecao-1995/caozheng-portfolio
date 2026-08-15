import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

import './Masonry.css';

const useMedia = (queries, values, defaultValue) => {
  const get = () => {
    if (typeof window === 'undefined') return defaultValue;
    return values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue;
  };

  const [value, setValue] = useState(get);

  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach(q => matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries]);

  return value;
};

const useMeasure = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
};

const preloadImages = async urls => {
  await Promise.all(
    urls.map(
      src =>
        new Promise(resolve => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

const BREAKPOINTS = ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'];

/**
 * Masonry：瀑布流布局 + GSAP 入场动效。
 * - 卡片从指定方向（默认底部）弹出，错峰 + 模糊聚焦，进入视口时触发一次。
 * - 支持自定义内容渲染（renderContent），也支持纯图片模式。
 * - linkable=false 时不拦截点击，交给卡片内部元素处理。
 */
const Masonry = ({
  items,
  columns = [5, 4, 3, 2],
  gap = 16,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  linkable = true,
  renderContent = null
}) => {
  const colCount = useMedia(BREAKPOINTS, columns, columns[columns.length - 1] ?? 1);
  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);
  const [started, setStarted] = useState(false);
  const hasMounted = useRef(false);
  const reduce = useMemo(
    () =>
      typeof window !== 'undefined' &&
      !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  );

  // 进入视口后触发入场动画（只触发一次）
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setStarted(true);
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);

  // 图片模式先预加载；内容模式直接就绪
  useEffect(() => {
    if (renderContent) {
      setImagesReady(true);
      return;
    }
    preloadImages(items.map(i => i.img)).then(() => setImagesReady(true));
  }, [items, renderContent]);

  const getInitialPosition = item => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;

    if (animateFrom === 'random') {
      const directions = ['top', 'bottom', 'left', 'right'];
      direction = directions[Math.floor(Math.random() * directions.length)];
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 };
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 };
      case 'left':
        return { x: -200, y: item.y };
      case 'right':
        return { x: window.innerWidth + 200, y: item.y };
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  // 瀑布流排布：按列累积高度，含 gap；返回格子 + 容器总高
  const layout = useMemo(() => {
    if (!width) return { grid: [], height: 0 };

    const colHeights = new Array(colCount).fill(0);
    const columnWidth = (width - gap * (colCount - 1)) / colCount;

    const grid = items.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col + gap * col;
      const height = child.height;
      const y = colHeights[col];
      colHeights[col] += height + gap;
      return { ...child, x, y, w: columnWidth, h: height };
    });

    return { grid, height: Math.max(...colHeights) - gap };
  }, [colCount, items, width, gap]);

  useLayoutEffect(() => {
    if (!imagesReady || !started || layout.grid.length === 0) return;

    layout.grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const finalState = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
        opacity: 1,
        ...(blurToFocus && { filter: 'blur(0px)' })
      };

      if (!hasMounted.current) {
        if (reduce) {
          gsap.set(selector, finalState);
          return;
        }
        const initialPos = getInitialPosition(item, index);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: initialPos.x,
            y: initialPos.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: 'blur(10px)' })
          },
          {
            ...finalState,
            duration: 0.8,
            ease: 'power3.out',
            delay: index * stagger
          }
        );
      } else {
        gsap.to(selector, {
          x: item.x,
          y: item.y,
          width: item.w,
          height: item.h,
          duration: duration,
          ease: ease,
          overwrite: 'auto'
        });
      }
    });

    hasMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, imagesReady, started, stagger, animateFrom, blurToFocus, duration, ease, reduce]);

  const handleMouseEnter = (e, item) => {
    const element = e.currentTarget;
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out'
      });
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay');
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0.3,
          duration: 0.3
        });
      }
    }
  };

  const handleMouseLeave = (e, item) => {
    const element = e.currentTarget;
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay');
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3
        });
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="list"
      style={{ height: layout.height > 0 ? layout.height : undefined }}
    >
      {layout.grid.map(item => {
        return (
          <div
            key={item.id}
            data-key={item.id}
            className={`item-wrapper${started ? '' : ' item-hidden'}`}
            onClick={linkable ? () => window.open(item.url, '_blank', 'noopener') : undefined}
            onMouseEnter={e => handleMouseEnter(e, item)}
            onMouseLeave={e => handleMouseLeave(e, item)}
          >
            {renderContent ? (
              renderContent(item)
            ) : (
              <div className="item-img" style={{ backgroundImage: `url(${item.img})` }}>
                {colorShiftOnHover && (
                  <div
                    className="color-overlay"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(45deg, rgba(255,0,150,0.5), rgba(0,150,255,0.5))',
                      opacity: 0,
                      pointerEvents: 'none',
                      borderRadius: '8px'
                    }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Masonry;
