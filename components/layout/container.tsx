import type { ComponentPropsWithoutRef } from "react";

export type ContainerProps = ComponentPropsWithoutRef<"div">;

export function Container({ className, ...props }: ContainerProps) {
  const classes = className ? `container ${className}` : "container";

  return <div {...props} data-slot="container" className={classes} />;
}
