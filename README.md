# react-tracer-component

Support the React component for exposing buried points and clicking buried points, without affecting the dom structure and without the need to package an additional layer of div

支持曝光埋点、点击埋点的 react 组件, 不会影响 dom 结构, 不需要多包一层 div

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
// replace to
const App = () => (
  <Tracer.div clickTrackParam={{ a: 'a', b: 'b', ... }} exposureTrackParam={{ a: 'a', b: 'b', ... }}>
    this is app
  </Tracer.div>
);
```
