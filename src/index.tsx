import React, { useEffect, useRef } from "react";
import tagNames from "./tagNames";
import type {
  HTMLAttributes,
  MouseEventHandler,
  PropsWithChildren,
} from "react";
import type { TagName } from "./tagNames";

interface TrackerProps<TrackParams = any> {
  clickTrackParam?: TrackParams;
  exposureTrackParam?: TrackParams;
  onClick?: MouseEventHandler;
}

export type SendData<TrackParams = any> = (
  type: "click" | "exposure",
  trackerParams: TrackParams
) => void;

type TrackerEl<T extends TagName = "div"> = (
  props: TrackerProps & {
    children?: React.ReactNode;
  } & JSX.IntrinsicElements[T]
) => JSX.Element;

type TrackerElMap = {
  [T in TagName]: TrackerEl<T>;
};

const getTracerComponent = <TrackParams extends any = any>({
  sendData,
  onError,
}: {
  sendData: SendData<TrackParams>;
  onError?: (err: any) => void;
}) => {
  const exposureAttrKey = "rtc-exposure";

  let TopGuard: null | IntersectionObserver = null;

  // 防止ssr报错
  if (typeof window !== "undefined") {
    if ("IntersectionObserver" in window) {
      TopGuard = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const { target } = entry;
            observer.unobserve(target);
            try {
              const exposureString =
                target.getAttribute(`data-${exposureAttrKey}`) || "{}";
              const data = JSON.parse(exposureString);
              sendData("exposure", data);
            } catch (err) {
              onError?.(err);
            }
          }
        });
      });
    }
  }

  const Tracker = <T extends TagName = "div">(
    TagName: TagName = "div"
  ): TrackerEl<T> => {
    return (props: PropsWithChildren<TrackerProps> & HTMLAttributes<any>) => {
      const {
        children = null,
        clickTrackParam,
        exposureTrackParam = {},
        onClick: onUserClick,
        ...restProps
      } = props;

      const exposureRef = useRef<HTMLElement>(null);

      const onClick: MouseEventHandler = (event) => {
        onUserClick?.(event);
        if (clickTrackParam) sendData("click", clickTrackParam);
      };

      useEffect(() => {
        if (exposureRef.current && exposureTrackParam) {
          TopGuard?.observe(exposureRef.current);
        }
        return () => {
          if (exposureRef.current && exposureTrackParam)
            TopGuard?.unobserve(exposureRef.current);
        };
      }, []);

      // 防止ts类型报错
      const Comp = TagName as any;

      return (
        <Comp
          ref={exposureRef}
          onClick={onClick}
          {...{
            [`data-${exposureAttrKey}`]: JSON.stringify(exposureTrackParam),
          }}
          {...restProps}
        />
      );
    };
  };

  const trackerMap: TrackerElMap = (() => {
    // @ts-ignore
    const trackerMap: TrackerElMap = tagNames.reduce((total, tag) => {
      // @ts-ignore
      total[tag] = Tracker(tag);
      return total;
      // @ts-ignore
    }, {});
    return trackerMap;
  })();

  return trackerMap;
};

export default getTracerComponent;
