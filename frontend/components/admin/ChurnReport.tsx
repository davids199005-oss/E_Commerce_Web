"use client"

import type { ReactElement } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { formatUsd } from "@/lib/format/money"
import type { FeatureFormat, FeatureSpec } from "@/lib/types/admin"
import type { ChurnReportProps } from "@/lib/types/components/admin"

const FEATURES: readonly FeatureSpec[] = [
  { key: "account_age_days", label: "Account age", format: "days" },
  { key: "orders_count", label: "Orders placed", format: "count" },
  { key: "total_spent", label: "Total spent", format: "money" },
  { key: "avg_order_value", label: "Average order value", format: "money" },
  { key: "days_since_last_order", label: "Time since last order", format: "days" },
  { key: "favorites_count", label: "Items saved to favorites", format: "count" },
]

function formatFeature(value: number, format: FeatureFormat): string {
  const whole: number = Math.round(value)
  switch (format) {
    case "money":
      return formatUsd(value)
    case "days":
      return whole === 1 ? "1 day" : `${whole} days`
    case "count":
      return String(whole)
    default: {
      const _exhaustive: never = format
      return _exhaustive
    }
  }
}

export function ChurnReport({ prediction, username }: ChurnReportProps): ReactElement {
  const percent: number = prediction.churn_probability * 100

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">Estimate for {username}</CardTitle>
          <CardDescription className="text-sm">
            How likely the model thinks this customer is to stop buying. It is a prediction from
            past behaviour, not a record of anything that has happened.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 pt-2">
          <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
            <p className="font-mono text-4xl leading-none font-medium tabular-nums text-foreground">
              {percent.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">estimated chance of churning</p>
          </div>

          <div
            role="img"
            aria-label={`Estimated churn probability: ${percent.toFixed(1)} percent`}
            className="h-2 w-full overflow-hidden rounded-full bg-muted"
          >
            <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={prediction.will_churn ? "default" : "secondary"}>
              {prediction.will_churn ? "Flagged as at risk" : "Not flagged"}
            </Badge>
            <p className="text-xs text-muted-foreground">
              The flag is simply the estimate landing above one half, and the model can be wrong
              in either direction.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">What the estimate was built from</CardTitle>
          <CardDescription className="text-sm">
            These six numbers are everything the model saw about this customer.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table className="text-sm">
            <TableBody>
              {FEATURES.map((feature) => {
                const value: number | undefined = prediction.features[feature.key]
                return (
                  <TableRow key={feature.key}>
                    <TableCell className="py-3 whitespace-normal text-muted-foreground">
                      {feature.label}
                    </TableCell>
                    <TableCell className="py-3 text-right font-mono tabular-nums text-foreground">
                      {value === undefined ? "—" : formatFeature(value, feature.format)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
