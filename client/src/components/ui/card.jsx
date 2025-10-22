import * as React from 'react'
import { cn } from '../../lib/utils'

const Card = ({ className, children, ...props }) => (
  <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)} {...props}>
    {children}
  </div>
)

const CardHeader = ({ className, children, ...props }) => (
  <div className={cn('p-4 border-b', className)} {...props}>
    {children}
  </div>
)

const CardContent = ({ className, children, ...props }) => (
  <div className={cn('p-4', className)} {...props}>
    {children}
  </div>
)

const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn('text-lg font-semibold', className)} {...props}>
    {children}
  </h3>
)

const CardDescription = ({ className, children, ...props }) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props}>
    {children}
  </p>
)

export { Card, CardHeader, CardContent, CardTitle, CardDescription }
