"use client";

import * as React from "react";

// Minimal shim to replace @radix-ui/react-dialog when the package is not installed.
// This provides basic components and types used across the UI components.

export const Root: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => <div {...props}>{children}</div>;

export const Trigger: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => <button {...props} />;

export const Close: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (
  props,
) => <button {...props} />;

export const Portal: React.FC<React.PropsWithChildren> = ({ children }) => (
  <>{children}</>
);

export const Overlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => <div ref={ref} {...props} />);
Overlay.displayName = "Overlay";

export const Content = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => <div ref={ref} {...props} />);
Content.displayName = "Content";

export const Title: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => <h2 {...props} />;

export const Description: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = (props) => <p {...props} />;

// Export a generic DialogProps type to satisfy imports that only use the type.
export type DialogProps = React.ComponentPropsWithoutRef<typeof Root>;

export default {
  Root,
  Trigger,
  Close,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
};
