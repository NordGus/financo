import { ComponentProps, PropsWithChildren } from "react";
import { Link, useMatches } from "react-router";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "./ui/breadcrumb";

interface WithBreadcrumb {
  breadcrumb?: undefined | null
}

interface EntryProps {
  withSeparator: boolean
  withLink: boolean
  to?: string
}

function Entry({ withSeparator, withLink, to, children }: PropsWithChildren<EntryProps>) {
  return (<>
    {withSeparator && <BreadcrumbSeparator />}
    {
      withLink && to
        ? (
          <BreadcrumbLink asChild>
            <Link to={to}>
              {children}
            </Link>
          </BreadcrumbLink>
        )
        : (
          <BreadcrumbPage>
            {children}
          </BreadcrumbPage>
        )
    }
  </>);
}

export function Breadcrumbs({ ...props }: ComponentProps<typeof Breadcrumb>) {
  const matches = useMatches();
  const crumbs = matches
    .filter(({ data }) => Boolean(data))
    .filter(({ data }) => Boolean((data as WithBreadcrumb).breadcrumb));
  const last = crumbs.length - 1;

  return <Breadcrumb {...props}>
    <BreadcrumbList>
      {
        crumbs.map(({ data, pathname }, idx) => {
          const { breadcrumb } = data as WithBreadcrumb;

          return <Entry
            key={`breadcrumb.${idx}`}
            to={pathname}
            withSeparator={idx !== 0}
            withLink={idx !== last}
          >
            {breadcrumb}
          </Entry>
        })
      }
    </BreadcrumbList>
  </Breadcrumb >
}