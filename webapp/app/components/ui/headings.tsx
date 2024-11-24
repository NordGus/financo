// This code is not cleaver just to the point

import React from "react";
import { cn } from "~/lib/utils";

function Heading1({ children, className, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h1 {...rest} className={cn("text-5xl", className)}>{children}</h1>
}

function Heading2({ children, className, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 {...rest} className={cn("text-4xl", className)}>{children}</h2>
}

function Heading3({ children, className, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...rest} className={cn("text-3xl", className)}>{children}</h3>
}

function Heading4({ children, className, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h4 {...rest} className={cn("text-2xl", className)}>{children}</h4>
}

function Heading5({ children, className, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 {...rest} className={cn("text-xl", className)}>{children}</h5>
}

function Heading6({ children, className, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h6 {...rest} className={cn("text-lg", className)}>{children}</h6>
}

export {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6
};

