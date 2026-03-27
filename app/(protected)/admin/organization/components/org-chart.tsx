"use client"

import React, { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Position {
  id: string
  name: string
  department_id: string | null
  reports_to: string | null
}

interface Department {
  id: string
  name: string
}

const TreeNode = ({
  node,
  childrenMap,
  deptMap,
  isRoot = false,
}: {
  node: Position
  childrenMap: Record<string, Position[]>
  deptMap: Record<string, string>
  isRoot?: boolean
}) => {
  const children = childrenMap[node.id] || []

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div 
        className={cn(
          "z-20 bg-card border shadow-sm rounded-xl p-4 w-[200px] text-center relative transition-all duration-300 hover:shadow-md hover:border-primary/50 group",
          isRoot ? "border-primary/40 shadow-primary/10" : "border-border"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
        <div className="relative z-10">
          <h3 className="font-semibold text-sm mb-1 text-foreground leading-tight">{node.name}</h3>
          {node.department_id && deptMap[node.department_id] && (
            <Badge variant={isRoot ? "default" : "secondary"} className="mt-1">
              {deptMap[node.department_id]}
            </Badge>
          )}
        </div>
      </div>

      {/* Children Wrapper */}
      {children.length > 0 && (
        <div className="flex flex-col items-center mt-0">
          {/* Vertical line from parent card down to horizontal split */}
          <div className="w-px h-8 bg-border transition-colors group-hover:bg-primary/50"></div>
          
          <div className="flex relative">
            {children.map((child, index) => {
              const isFirst = index === 0
              const isLast = index === children.length - 1
              const isOnly = children.length === 1

              return (
                <div key={child.id} className="relative flex flex-col items-center px-4">
                  {/* Connectors for children branches */}
                  {!isOnly && (
                    <div className="absolute top-0 w-full h-px flex">
                      {/* Left half of the horizontal line */}
                      <div className={cn("w-1/2 h-full", !isFirst ? "bg-border transition-colors group-hover:bg-primary/50" : "bg-transparent")}></div>
                      {/* Right half of the horizontal line */}
                      <div className={cn("w-1/2 h-full", !isLast ? "bg-border transition-colors group-hover:bg-primary/50" : "bg-transparent")}></div>
                    </div>
                  )}

                  {/* Vertical line going down to the child card */}
                  <div className="w-px h-8 bg-border transition-colors group-hover:bg-primary/50"></div>
                  
                  {/* Render the child recursively */}
                  <div className="mt-0">
                    <TreeNode
                      node={child}
                      childrenMap={childrenMap}
                      deptMap={deptMap}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrgChart({
  departments,
  positions,
}: {
  departments: Department[]
  positions: Position[]
}) {
  const deptMap = useMemo(() => {
    return departments.reduce((acc, d) => {
      acc[d.id] = d.name
      return acc
    }, {} as Record<string, string>)
  }, [departments])

  const { roots, childrenMap } = useMemo(() => {
    const rootNodes: Position[] = []
    const map: Record<string, Position[]> = {}

    const positionIds = new Set(positions.map((p) => p.id))

    positions.forEach((p) => {
      // If a position has no reports_to, OR its reports_to doesn't exist in the list, it's a root.
      if (!p.reports_to || !positionIds.has(p.reports_to)) {
        rootNodes.push(p)
      } else {
        if (!map[p.reports_to]) map[p.reports_to] = []
        map[p.reports_to].push(p)
      }
    })

    return { roots: rootNodes, childrenMap: map }
  }, [positions])

  if (positions.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
        <p className="text-sm text-muted-foreground">No organization data found.</p>
      </div>
    )
  }

  return (
    <div className="p-8 flex justify-center items-start min-w-max">
      {roots.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-lg text-center w-full">
          <p className="text-sm text-muted-foreground">Invalid hierarchical data (No root nodes found).</p>
        </div>
      ) : (
        <div className="flex gap-16">
          {roots.map((root) => (
            <TreeNode
              key={root.id}
              node={root}
              childrenMap={childrenMap}
              deptMap={deptMap}
              isRoot={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
