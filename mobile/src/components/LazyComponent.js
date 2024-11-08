// src/components/LazyComponent.js
import React, { Suspense, lazy } from 'react';

const LazyComponent = (importFunc) => {
  const Component = lazy(importFunc);
  return (props) => (
    <Suspense fallback={<div>加载中...</div>}>
      <Component {...props} />
    </Suspense>
  );
};

export default LazyComponent;
