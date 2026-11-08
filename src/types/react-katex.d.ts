declare module 'react-katex' {
  import type { FC, ReactNode } from 'react';

  interface KatexProps {
    children?: ReactNode;
    math?: string;
    block?: boolean;
    errorColor?: string;
    renderError?: (error: Error) => ReactNode;
    settings?: {
      displayMode?: boolean;
      [key: string]: unknown;
    };
  }

  export const InlineMath: FC<KatexProps>;
  export const BlockMath: FC<KatexProps>;
}