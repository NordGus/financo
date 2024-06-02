import { getArchivedGoals, getGoals, getReachedGoals } from "@api/goals"
import { staleTimeDefault } from "./Client"

export const reachedGoalsQuery = {
    queryKey: ['goals', 'reached'],
    queryFn: getReachedGoals,
    staleTime: staleTimeDefault
}

export const activeGoalsQuery = {
    queryKey: ['goals', 'active'],
    queryFn: getGoals,
    staleTime: staleTimeDefault
}

export const archivedGoalsQuery = {
    queryKey: ['goals', 'archived'],
    queryFn: getArchivedGoals,
    staleTime: staleTimeDefault
}