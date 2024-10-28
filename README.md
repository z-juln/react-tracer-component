# react-tracer-component

Support the React component for exposing buried points and clicking buried points, without affecting the dom structure and without the need to package an additional layer of div

支持曝光埋点、点击埋点的 react 组件, 不会影响 dom 结构, 不需要多包一层 div

** 注: 不建议使用该库, 已经存在相同功能的知名库: `react-intersection-observer`里的InView组件 **

## install

`npm i react-tracer-component -S` or `yarn add react-tracer-component -S`

## use

```typescript
import { getTracerComponent, SendData } from "react-tracer-component";
import track from "you-track";

// customize your tracer events
// 自定义你的埋点事件
const sendData: SendData = (type, trackerParams) => {
  console.info("tracer type:", type); // 'click' | 'exposure';
  console.info("tracer params:", trackerParams); // { a: 'a', b: 'b', ... }
  track(type, trackerParams);
};

const Tracer = getTracerComponent({
  sendData,
  onError: (err) => console.info("tracer err: ", err),
});

// const App = () => <div>this is app</div>;
// replace with
// 替换成
const App = () => (
  <Tracer.div clickTrackParam={{ a: 'a', b: 'b', ... }} exposureTrackParam={{ a: 'a', b: 'b', ... }}>
    this is app
  </Tracer.div>
);
```

## more tag

Tracer.div
Tracer.li
Tracer.ul
Tracer.span
...

All soundtrack dom tags support

所有原声 dom 标签都支持

## more

Supports Typescript paradigm constraints

支持 Typescript 范型约束

```typescript
type TracerClickParams = {
  act: "click";
  clickKey1: any;
} & {
  [K in string]?: any;
};
type TracerExposureParams = {
  act: "exposure";
  exposureKey1: any;
} & {
  [K in string]?: any;
};
const Tracer = getTracerComponent<TracerClickParams, TracerExposureParams>({
  sendData: () => {},
  onError: (err) => console.info("tracer err: ", err),
});
// error
const node1 = (
  <>
    <Tracer.div clickTrackParam={{ a: "a" }} />
    <Tracer.div exposureTrackParam={{ a: "a" }} />
  </>
);
// ok
const node2 = (
  <>
    <Tracer.div clickTrackParam={{ act: "click", clickKey1: "", a: "a" }} />
    <Tracer.div
      exposureTrackParam={{ act: "exposure", exposureKey1: "", a: "a" }}
    />
  </>
);
```
