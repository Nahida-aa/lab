import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true, // 自动处理 memoization（记忆化）, 减少不必要的重新渲染(react 的机制是 ui = f(state), 因此 state 变化时, ui 会变化, ui 包括 被嵌套的 ui, 因此相当于 子组件 会跟着重新渲染), 不用手动写 useMemo, useCallback, React.memo 等优化代码
};

export default nextConfig;
