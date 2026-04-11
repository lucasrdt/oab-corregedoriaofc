import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return <div className={`skeleton ${className}`} />;
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-border/50">
      <Skeleton className="h-4 w-1/4 mb-4" />
      <Skeleton className="h-8 w-3/4 mb-6" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
};

export const TableSkeleton = () => {
  return (
    <div className="table-container">
      <div className="p-4 border-b border-border bg-muted/20">
        <Skeleton className="h-6 w-1/4" />
      </div>
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
};
