import { Tooltip } from "@radix-ui/react-tooltip";
import { isNil } from "lodash-es";
import {
  Maximize2Icon,
  Package2Icon,
  StarIcon,
  StarOffIcon,
  TrashIcon
} from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { Button } from "~/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~/shared/components/ui/card";
import {
  TooltipContent,
  TooltipTrigger
} from "~/shared/components/ui/tooltip";
import { colorContrast } from "~/shared/helpers/color-contrast";
import {
  currencyAmountToHuman
} from "~/shared/helpers/currency-amount-to-human";
import { Account, isCapital } from "~/shared/types/account";

interface Props {
  account: Account
}

export function Preview({
  account: {
    id,
    kind,
    currency,
    name,
    description,
    color,
    settings: {
      favorite,
      balance
    },
    archivedAt
  }
}: Props) {
  const isArchived = !isNil(archivedAt)

  return (
    <Card className={cn(isArchived && "opacity-50")}>
      <CardHeader
        className="min-h-28"
        style={{
          backgroundColor: color,
          color: colorContrast(color)
        }}
      >
        <CardTitle>{name}</CardTitle>
        <CardDescription
          style={{
            color: colorContrast(color),
            opacity: "70%",
          }}
        >
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row-reverse justify-between gap-2 pt-4">
          <span className={cn("font-semibold")}>
            {currencyAmountToHuman(balance, currency)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-end items-baseline gap-2">
        {
          isCapital(kind) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="link" className="text-yellow-500">
                  {
                    favorite
                      ? <StarOffIcon />
                      : <StarIcon />
                  }
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                favorite
              </TooltipContent>
            </Tooltip>
          )
        }
        <span className="grow contents-['']"></span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline" asChild>
              <Link to={`/accounts/${id}`}>
                <Maximize2Icon />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            open
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="secondary">
              <Package2Icon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            archive
          </TooltipContent>
        </Tooltip>
        {
          !isArchived && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="destructive">
                  <TrashIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                delete
              </TooltipContent>
            </Tooltip>
          )
        }
      </CardFooter>
    </Card>
  )
}